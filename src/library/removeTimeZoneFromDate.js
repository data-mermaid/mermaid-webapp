import moment from 'moment'

export const removeTimeZoneFromDate = (date) => {
  const newDate = moment(new Date(date))

  return newDate.format('ddd MMM DD YYYY HH:mm:ss')
}
