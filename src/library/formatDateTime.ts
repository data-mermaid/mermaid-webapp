import {
  differenceInCalendarQuarters,
  differenceInSeconds,
  intlFormat,
  intlFormatDistance,
} from 'date-fns'
import { secondsInQuarter, secondsInYear } from 'date-fns/constants'

// intlFormatDistance uses quarters for distances of 3–9 months - force months instead
export const formatDistanceNoQuarters = (laterDate: Date, earlierDate: Date): string => {
  const absSeconds = Math.abs(differenceInSeconds(laterDate, earlierDate))

  if (
    absSeconds >= secondsInQuarter &&
    absSeconds < secondsInYear &&
    Math.abs(differenceInCalendarQuarters(laterDate, earlierDate)) < 4 // intlFormatDistance source logic
  ) {
    return intlFormatDistance(laterDate, earlierDate, { unit: 'month' })
  }

  return intlFormatDistance(laterDate, earlierDate)
}

// e.g. "Wednesday, February 4, 2026 at 14:34 PM"
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
