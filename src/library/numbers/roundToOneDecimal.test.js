import { expect, it } from 'vitest'
import { roundToOneDecimal } from './roundToOneDecimal'

describe('roundToOneDecimal', () => {
  it.each([
    [1.249, '1.2'],
    [1.45, '1.5'],
    [2.349, '2.3'],
    [0, '0.0'],
  ])('rounds %f to %s', (input, expected) => {
    expect(roundToOneDecimal(input)).toBe(expected)
  })
})
