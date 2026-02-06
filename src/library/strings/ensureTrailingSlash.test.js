import { expect, test } from "vitest";
import { ensureTrailingSlash } from './ensureTrailingSlash'

test('ensureTrailingSlash returns a string with slash on end when input string has no trailing slash', () => {
  expect(ensureTrailingSlash('foo')).toEqual('foo/')
})
test('ensureTrailingSlash returns a string with slash on end when input string alreadt has a trailing slash', () => {
  expect(ensureTrailingSlash('foo/')).toEqual('foo/')
})
