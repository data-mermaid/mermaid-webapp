import { expect, it } from 'vitest'
import { hasNonEmptyValue } from './hasNonEmptyValue'

describe('hasNonEmptyValue', () => {
  it('returns true for 0', () => {
    expect(hasNonEmptyValue(0)).toBe(true)
  })

  it('returns true for false', () => {
    expect(hasNonEmptyValue(false)).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(hasNonEmptyValue('')).toBe(false)
  })

  it('returns false for null', () => {
    expect(hasNonEmptyValue(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(hasNonEmptyValue(undefined)).toBe(false)
  })

  it('returns true for a non-empty string', () => {
    expect(hasNonEmptyValue('value')).toBe(true)
  })
})
