import moment from 'moment'

export const removeTimeZoneFromDate = (date) => {
  const newDate = moment(new Date(date))

  return newDate.format('ddd - MMMM DD YYYY - HH:mm:ss ')
}
