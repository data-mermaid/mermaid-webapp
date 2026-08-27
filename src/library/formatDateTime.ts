import {
  differenceInCalendarQuarters,
  differenceInSeconds,
  format,
  intlFormat,
  intlFormatDistance,
} from 'date-fns'
import { secondsInQuarter, secondsInYear } from 'date-fns/constants'

// intlFormatDistance uses quarters for distances of 3–9 months - force months instead
export const formatDistanceNoQuarters = (date: Date, baseDate: Date): string => {
  const absSeconds = Math.abs(differenceInSeconds(date, baseDate))

  if (
    absSeconds >= secondsInQuarter &&
    absSeconds < secondsInYear &&
    Math.abs(differenceInCalendarQuarters(date, baseDate)) < 4 // intlFormatDistance source logic
  ) {
    return intlFormatDistance(date, baseDate, { unit: 'month' })
  }

  return intlFormatDistance(date, baseDate)
}

// Date-only values (YYYY-MM-DD) parse as UTC midnight, so they must be formatted in UTC too -
// otherwise anyone west of UTC sees the previous day. e.g. "February 10, 2024"
export const formatDateOnlyIntl = (dateOnly: string): string => {
  // new Date(null) is the epoch rather than an invalid date, so falsy values need their own guard
  if (!dateOnly) {
    return ''
  }

  const date = new Date(dateOnly)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return intlFormat(
    date,
    { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
    { locale: navigator.language },
  )
}

// Date-only values parse as UTC midnight, so the year has to be read with a UTC getter -
// getFullYear() returns the previous year west of UTC for a 1 January date. e.g. "2024"
export const getDateOnlyYear = (dateOnly: string): string => {
  // new Date(null) is the epoch rather than an invalid date, so falsy values need their own guard
  if (!dateOnly) {
    return ''
  }

  const date = new Date(dateOnly)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return String(date.getUTCFullYear())
}

// Today as a date-only value (YYYY-MM-DD) in the browser's timezone, for defaulting date
// inputs. date-fns format reads local getters, unlike toISOString(), which converts to UTC
// and so rolls back a day anywhere east of UTC.
export const getTodayDateOnly = (): string => format(new Date(), 'yyyy-MM-dd')

// e.g. "Wednesday, February 4, 2026 at 14:34"
export const formatDateTimeIntl = (date: Date | string | number): string =>
  intlFormat(date instanceof Date ? date : new Date(date), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })
