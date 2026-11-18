import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isNonEmptyString, isOptionalString, isPlainObject } from '../src/server/requestValidation';
describe('request validation', () => {
 it('accepts plain objects only', () => { assert.equal(isPlainObject({a:1}), true); assert.equal(isPlainObject([]), false); assert.equal(isPlainObject(null), false); });
 it('validates optional bounded strings', () => { assert.equal(isOptionalString(undefined, 5), true); assert.equal(isOptionalString('hello', 5), true); assert.equal(isOptionalString('longer', 5), false); assert.equal(isOptionalString(4, 5), false); });
 it('requires non-empty bounded strings', () => { assert.equal(isNonEmptyString('NEXORA', 10), true); assert.equal(isNonEmptyString('  ', 10), false); assert.equal(isNonEmptyString('long', 2), false); });
});
