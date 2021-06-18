import { getClosestNumberInArray } from './getClosestNumberInArray'

const unsortedArray = [-100, 6, 9, 15, 4, 2, -10.1]

test('find closest number in unsorted array', () => {
  expect(getClosestNumberInArray(5, unsortedArray)).toEqual(6)
  expect(getClosestNumberInArray(-5, unsortedArray)).toEqual(-10.1)
  expect(getClosestNumberInArray(-5.3, unsortedArray)).toEqual(-10.1)
  expect(getClosestNumberInArray(300, unsortedArray)).toEqual(15)
})
