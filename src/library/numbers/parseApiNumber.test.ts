import { parseApiNumber } from './parseApiNumber'

describe('parseApiNumber', () => {
  it('converts the strings the API returns into numbers', () => {
    expect(parseApiNumber('1234.56')).toBe(1234.56)
    expect(parseApiNumber('0.00')).toBe(0)
    expect(parseApiNumber('-2.5')).toBe(-2.5)
  })

  it('passes numbers straight through', () => {
    expect(parseApiNumber(12.5)).toBe(12.5)
    expect(parseApiNumber(0)).toBe(0)
  })

  it('returns null for empty or missing input', () => {
    expect(parseApiNumber('')).toBe(null)
    expect(parseApiNumber(null)).toBe(null)
    expect(parseApiNumber(undefined)).toBe(null)
  })

  it('returns null rather than NaN for unparseable input', () => {
    expect(parseApiNumber('nonsense')).toBe(null)
    expect(parseApiNumber({})).toBe(null)
  })
})
