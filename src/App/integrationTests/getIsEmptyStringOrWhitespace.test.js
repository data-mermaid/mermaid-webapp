import { getIsEmptyStringOrWhitespace } from '../../library/getIsEmptyStringOrWhitespace'

test('getIsEmptyStringOrWhitespace on empty string', () => {
  expect(getIsEmptyStringOrWhitespace('')).toBe(true)
})
test('getIsEmptyStringOrWhitespace on string with whitespace', () => {
  expect(getIsEmptyStringOrWhitespace('    ')).toBe(true)
})
test('getIsEmptyStringOrWhitespace on string with content', () => {
  expect(getIsEmptyStringOrWhitespace('hello')).toBe(false)
})
test('getIsEmptyStringOrWhitespace on number', () => {
  expect(getIsEmptyStringOrWhitespace(0)).toBe(false)
})
test('getIsEmptyStringOrWhitespace on empty array', () => {
  expect(getIsEmptyStringOrWhitespace([])).toBe(false)
})
test('getIsEmptyStringOrWhitespace on array with content', () => {
  expect(getIsEmptyStringOrWhitespace([1, 2, 3])).toBe(false)
})
test('getIsEmptyStringOrWhitespace on empty object', () => {
  expect(getIsEmptyStringOrWhitespace({})).toBe(false)
})
test('getIsEmptyStringOrWhitespace on object with content', () => {
  expect(getIsEmptyStringOrWhitespace({ key: 'value' })).toBe(false)
})
test('getIsEmptyStringOrWhitespace on null', () => {
  expect(getIsEmptyStringOrWhitespace(null)).toBe(false)
})
test('getIsEmptyStringOrWhitespace on undefined', () => {
  expect(getIsEmptyStringOrWhitespace(undefined)).toBe(false)
})
test('getIsEmptyStringOrWhitespace on boolean', () => {
  expect(getIsEmptyStringOrWhitespace(false)).toBe(false)
})
test('getIsEmptyStringOrWhitespace on function', () => {
  expect(getIsEmptyStringOrWhitespace(() => {})).toBe(false)
})
test('getIsEmptyStringOrWhitespace on Infinity', () => {
  expect(getIsEmptyStringOrWhitespace(Infinity)).toBe(false)
})
test('getIsEmptyStringOrWhitespace on Map', () => {
  expect(getIsEmptyStringOrWhitespace(new Map())).toBe(false)
})
test('getIsEmptyStringOrWhitespace on Symbol', () => {
  expect(getIsEmptyStringOrWhitespace(Symbol('symbol'))).toBe(false)
})
test('getIsEmptyStringOrWhitespace on empty Set', () => {
  expect(getIsEmptyStringOrWhitespace(new Set())).toBe(false)
})
test('getIsEmptyStringOrWhitespace on Set with content', () => {
  expect(getIsEmptyStringOrWhitespace(new Set([1, 2, 3]))).toBe(false)
})
test('getIsEmptyStringOrWhitespace on Date', () => {
  expect(getIsEmptyStringOrWhitespace(new Date())).toBe(false)
})
test('getIsEmptyStringOrWhitespace on RegExp', () => {
  expect(getIsEmptyStringOrWhitespace(/regex/)).toBe(false)
})
test('getIsEmptyStringOrWhitespace on TypedArray', () => {
  expect(getIsEmptyStringOrWhitespace(new Uint8Array())).toBe(false)
})
test('getIsEmptyStringOrWhitespace on Buffer', () => {
  expect(getIsEmptyStringOrWhitespace(Buffer.from(''))).toBe(false)
})
test('getIsEmptyStringOrWhitespace on NaN', () => {
  expect(getIsEmptyStringOrWhitespace(NaN)).toBe(false)
})
test('getIsEmptyStringOrWhitespace on ArrayBuffer', () => {
  expect(getIsEmptyStringOrWhitespace(new ArrayBuffer())).toBe(false)
})
test('getIsEmptyStringOrWhitespace on DataView', () => {
  expect(getIsEmptyStringOrWhitespace(new DataView(new ArrayBuffer()))).toBe(false)
})
test('getIsEmptyStringOrWhitespace on Date object', () => {
  expect(getIsEmptyStringOrWhitespace(new Date())).toBe(false)
})
test('getIsEmptyStringOrWhitespace on Error object', () => {
  expect(getIsEmptyStringOrWhitespace(new Error())).toBe(false)
})
test('getIsEmptyStringOrWhitespace on Promise object', () => {
  expect(getIsEmptyStringOrWhitespace(Promise.resolve())).toBe(false)
})
