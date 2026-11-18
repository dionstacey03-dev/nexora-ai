import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { verifyOidcBearerToken } from '../src/server/oidcAuth';

describe('OIDC bearer verification', () => {
  it('rejects missing provider configuration', async () => {
    assert.equal(await verifyOidcBearerToken('Bearer abc.def.ghi', {}), null);
  });

  it('rejects missing bearer credentials', async () => {
    assert.equal(await verifyOidcBearerToken(undefined, {
      jwksUrl: 'https://identity.example/.well-known/jwks.json',
      issuer: 'https://identity.example/',
      audience: 'nexora-api',
    }), null);
  });

  it('rejects malformed and unsupported JWTs without network access', async () => {
    const config = {
      jwksUrl: 'https://identity.example/.well-known/jwks.json',
      issuer: 'https://identity.example/',
      audience: 'nexora-api',
    };
    assert.equal(await verifyOidcBearerToken('Bearer not-a-jwt', config), null);
    const token = [
      Buffer.from(JSON.stringify({ alg: 'none', kid: 'x' })).toString('base64url'),
      Buffer.from(JSON.stringify({ sub: 'user-1', iss: config.issuer, aud: config.audience, exp: 9999999999 })).toString('base64url'),
      'signature',
    ].join('.');
    assert.equal(await verifyOidcBearerToken(`Bearer ${token}`, config), null);
  });
});
