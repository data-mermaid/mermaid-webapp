import { format } from 'date-fns'

export const removeTimeZoneFromDate = (date) => {
  return format(new Date(date), 'EEE MMM dd yyyy HH:mm:ss')
}
