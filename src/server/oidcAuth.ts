import { Buffer } from 'node:buffer';

export interface AuthenticatedIdentity {
  subject: string;
  issuer: string;
  email?: string;
  name?: string;
}

interface JwtHeader { alg?: string; kid?: string; typ?: string; }
interface JwtClaims {
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  email?: string;
  name?: string;
}

let jwksCache: { uri: string; expiresAt: number; keys: JsonWebKey[] } | undefined;

function decodeSegment<T>(segment: string): T {
  return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8')) as T;
}

async function getJwks(uri: string): Promise<JsonWebKey[]> {
  if (jwksCache?.uri === uri && jwksCache.expiresAt > Date.now()) return jwksCache.keys;
  const response = await fetch(uri, { signal: AbortSignal.timeout(5000), headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Identity provider key discovery failed.');
  const payload = await response.json() as { keys?: JsonWebKey[] };
  if (!Array.isArray(payload.keys) || payload.keys.length === 0) throw new Error('Identity provider returned no signing keys.');
  jwksCache = { uri, keys: payload.keys, expiresAt: Date.now() + 5 * 60 * 1000 };
  return payload.keys;
}

export async function verifyOidcBearerToken(
  authorization: string | undefined,
  config: { jwksUrl?: string; issuer?: string; audience?: string },
): Promise<AuthenticatedIdentity | null> {
  if (!config.jwksUrl || !config.issuer || !config.audience) return null;
  if (!authorization?.startsWith('Bearer ')) return null;

  try {
    const token = authorization.slice(7).trim();
    const parts = token.split('.');
    if (parts.length !== 3 || parts.some((part) => !part)) return null;
    const header = decodeSegment<JwtHeader>(parts[0]);
    const claims = decodeSegment<JwtClaims>(parts[1]);
    // Restrict the accepted algorithm; never trust the token's algorithm choice.
    if (header.alg !== 'RS256' || !header.kid || typeof claims.sub !== 'string' || !claims.sub) return null;
    if (claims.iss !== config.issuer) return null;
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!audiences.includes(config.audience)) return null;
    const now = Math.floor(Date.now() / 1000);
    if (typeof claims.exp !== 'number' || claims.exp <= now) return null;
    if (typeof claims.nbf === 'number' && claims.nbf > now) return null;

    const keys = await getJwks(config.jwksUrl);
    const jwk = keys.find((key) => (key as JsonWebKey & { kid?: string }).kid === header.kid && key.kty === 'RSA');
    if (!jwk) return null;
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      new Uint8Array(Buffer.from(parts[2], 'base64url')),
      new TextEncoder().encode(parts.slice(0, 2).join('.')),
    );
    if (!valid) return null;
    return {
      subject: claims.sub,
      issuer: claims.iss,
      ...(typeof claims.email === 'string' ? { email: claims.email } : {}),
      ...(typeof claims.name === 'string' ? { name: claims.name } : {}),
    };
  } catch {
    return null;
  }
}
