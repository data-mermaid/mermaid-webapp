import { expect, test } from "vitest";
import getObjectProperty from './getObjectProperty'

test('getObjectProperty on populated object', () => {
  expect(
    getObjectProperty({
      object: { first: { second: { third: 'root' } } },
      path: 'first.second.third',
    }),
  ).toEqual('root')
})
test('getObjectProperty on empty object', () => {
  expect(
    getObjectProperty({
      object: {},
      path: 'first.second.third',
    }),
  ).toBeUndefined()
})
