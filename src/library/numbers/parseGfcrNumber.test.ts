import { parseGfcrNumber } from './parseGfcrNumber'

describe('parseGfcrNumber', () => {
  it('converts the strings the API returns into numbers', () => {
    expect(parseGfcrNumber('1234.56')).toBe(1234.56)
    expect(parseGfcrNumber('0.00')).toBe(0)
    expect(parseGfcrNumber('-2.5')).toBe(-2.5)
  })

  it('passes numbers straight through', () => {
    expect(parseGfcrNumber(12.5)).toBe(12.5)
    expect(parseGfcrNumber(0)).toBe(0)
  })

  it('returns null for empty or missing input', () => {
    expect(parseGfcrNumber('')).toBe(null)
    expect(parseGfcrNumber(null)).toBe(null)
    expect(parseGfcrNumber(undefined)).toBe(null)
  })

  it('returns null rather than NaN for unparseable input', () => {
    expect(parseGfcrNumber('nonsense')).toBe(null)
    expect(parseGfcrNumber({})).toBe(null)
  })
})
