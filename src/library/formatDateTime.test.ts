import { formatDateOnlyIntl, getDateOnlyYear, getTodayDateOnly } from './formatDateTime'

// Somewhere west of UTC, where a UTC-midnight date lands on the previous day locally.
// Without it the tests pass on a UTC runner whether or not the formatting is correct.
const stubTimezoneWestOfUtc = () => {
  beforeAll(() => {
    vi.stubEnv('TZ', 'America/Vancouver')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })
}

describe('formatDateOnlyIntl', () => {
  stubTimezoneWestOfUtc()

  test('formats a date-only string as the same calendar day the API sent', () => {
    // jsdom reports navigator.language as en-US
    expect(formatDateOnlyIntl('2024-01-01')).toBe('January 1, 2024')
  })

  test.each([
    ['an empty string', ''],
    ['null', null],
    ['an unparseable date', 'not a date'],
  ])('returns an empty string for %s', (_description, value) => {
    expect(formatDateOnlyIntl(value)).toBe('')
  })
})

describe('getDateOnlyYear', () => {
  stubTimezoneWestOfUtc()

  test('returns the year the API sent rather than the local year', () => {
    // A UTC-midnight 1 January is still the previous year in local time west of UTC
    expect(getDateOnlyYear('2024-01-01')).toBe('2024')
  })

  test.each([
    ['an empty string', ''],
    ['null', null],
    ['an unparseable date', 'not a date'],
  ])('returns an empty string for %s', (_description, value) => {
    expect(getDateOnlyYear(value)).toBe('')
  })
})

describe('getTodayDateOnly', () => {
  // East of UTC, where local midnight is still the previous day in UTC - the direction
  // that a toISOString() implementation gets wrong.
  beforeAll(() => {
    vi.stubEnv('TZ', 'Pacific/Auckland')
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-25T09:00:00+12:00'))
  })

  afterAll(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
  })

  test('returns the local calendar date rather than the UTC one', () => {
    expect(getTodayDateOnly()).toBe('2026-08-25')
  })
})
