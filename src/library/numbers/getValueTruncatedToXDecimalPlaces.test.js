import { expect, test } from 'vitest'
import { getValueTruncatedToXDecimalPlaces } from './getValueTruncatedToXDecimalPlaces'

test('getValueTruncatedToXDecimalPlaces works with strings and returns a value of the same type as the input', () => {
  expect(
    getValueTruncatedToXDecimalPlaces({ inputValue: '1.234567', maxNumberOfDecimals: 1 }),
  ).toBe('1.2')
  expect(
    getValueTruncatedToXDecimalPlaces({ inputValue: '1.234567', maxNumberOfDecimals: 2 }),
  ).toBe('1.23')
  expect(
    getValueTruncatedToXDecimalPlaces({ inputValue: '1.234567', maxNumberOfDecimals: 3 }),
  ).toBe('1.234')
  expect(
    getValueTruncatedToXDecimalPlaces({ inputValue: '1.234567', maxNumberOfDecimals: 4 }),
  ).toBe('1.2345')
  expect(
    getValueTruncatedToXDecimalPlaces({ inputValue: '1.234567', maxNumberOfDecimals: 5 }),
  ).toBe('1.23456')
  expect(
    getValueTruncatedToXDecimalPlaces({ inputValue: '1.234567', maxNumberOfDecimals: 6 }),
  ).toBe('1.234567')
})

test('getValueTruncatedToXDecimalPlaces works with numbers and returns a value of the same type as the input', () => {
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1.234567, maxNumberOfDecimals: 1 })).toBe(
    1.2,
  )
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1.234567, maxNumberOfDecimals: 2 })).toBe(
    1.23,
  )
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1.234567, maxNumberOfDecimals: 3 })).toBe(
    1.234,
  )
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1.234567, maxNumberOfDecimals: 4 })).toBe(
    1.2345,
  )
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1.234567, maxNumberOfDecimals: 5 })).toBe(
    1.23456,
  )
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1.234567, maxNumberOfDecimals: 6 })).toBe(
    1.234567,
  )
})

test('getValueTruncatedToXDecimalPlaces returns the original value if it has less than or equal to the maximum number of decimals specified', () => {
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: '1.2', maxNumberOfDecimals: 1 })).toBe(
    '1.2',
  )
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: '1', maxNumberOfDecimals: 1 })).toBe('1')
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: '1.23', maxNumberOfDecimals: 2 })).toBe(
    '1.23',
  )
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: '1.2', maxNumberOfDecimals: 2 })).toBe(
    '1.2',
  )

  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1.2, maxNumberOfDecimals: 1 })).toBe(1.2)
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1, maxNumberOfDecimals: 1 })).toBe(1)
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1.23, maxNumberOfDecimals: 2 })).toBe(1.23)
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1.2, maxNumberOfDecimals: 2 })).toBe(1.2)
})

test('getValueTruncatedToXDecimalPlaces returns integers of the original input type if maxNumberOfDecimals is set to 0', () => {
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: '1.2', maxNumberOfDecimals: 0 })).toBe('1')
  expect(getValueTruncatedToXDecimalPlaces({ inputValue: 1.2, maxNumberOfDecimals: 0 })).toBe(1)
})

test('getValueTruncatedToXDecimalPlaces throws an error if maxNumberOfDecimals is less than 0 or more than 100', () => {
  expect(() => {
    getValueTruncatedToXDecimalPlaces({ inputValue: '1.2', maxNumberOfDecimals: '-1 ' })
  }).toThrowError('maxNumberOfDecimals must be a string or numeric value between 0 and 100')
  expect(() => {
    getValueTruncatedToXDecimalPlaces({ inputValue: '1.2', maxNumberOfDecimals: -1 })
  }).toThrowError('maxNumberOfDecimals must be a string or numeric value between 0 and 100')
  expect(() => {
    getValueTruncatedToXDecimalPlaces({ inputValue: '1.2', maxNumberOfDecimals: '101' })
  }).toThrowError('maxNumberOfDecimals must be a string or numeric value between 0 and 100')
  expect(() => {
    getValueTruncatedToXDecimalPlaces({ inputValue: '1.2', maxNumberOfDecimals: 101 })
  }).toThrowError('maxNumberOfDecimals must be a string or numeric value between 0 and 100')
})
