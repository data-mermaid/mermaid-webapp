import { formatDateOnlyIntl } from './formatDateTime'

describe('formatDateOnlyIntl', () => {
  // Somewhere west of UTC, where a UTC-midnight date lands on the previous day locally.
  // Without it the test passes on a UTC runner whether or not the formatting is correct.
  beforeAll(() => {
    vi.stubEnv('TZ', 'America/Vancouver')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

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
