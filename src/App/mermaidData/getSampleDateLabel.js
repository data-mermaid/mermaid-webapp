export const getSampleDateLabel = (sampleDate) => {
  if (!sampleDate) return undefined

  const [year, month, day] = sampleDate.split('-')
  const zeroIndexedMonth = month - 1
  const locale = navigator.language ?? 'en-US'

  return new Date(year, zeroIndexedMonth, day).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
