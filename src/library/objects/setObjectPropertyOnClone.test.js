import { expect, test } from 'vitest'
import setObjectPropertyOnClone from './setObjectPropertyOnClone'

test('setObjectPropertyOnClone on populated object', () => {
  expect(
    setObjectPropertyOnClone({
      object: { first: { second: { third: 'root' } } },
      path: 'first.second.third',
      value: 'howdy',
    }),
  ).toMatchObject({ first: { second: { third: 'howdy' } } })
})
test('setObjectPropertyOnClone on empty object', () => {
  expect(
    setObjectPropertyOnClone({
      object: {},
      path: 'first.second.third',
      value: 'howdy',
    }),
  ).toMatchObject({ first: { second: { third: 'howdy' } } })
})
