import { expect, it } from 'vitest'
import { sanitizeToOneDecimalPlace } from './sanitizeToOneDecimalPlace'

describe('sanitizeToOneDecimalPlace', () => {
  it.each([
    ['52.3456', '52.3'],
    ['52,3456', '523456'],
    ['52.', '52.'],
    ['abc52.3', '52.3'],
    ['', ''],
    [undefined, ''],
    [52.3456, '52.3'],
  ])('sanitizes %s to %s', (input, expected) => {
    expect(sanitizeToOneDecimalPlace(input)).toBe(expected)
  })
})
