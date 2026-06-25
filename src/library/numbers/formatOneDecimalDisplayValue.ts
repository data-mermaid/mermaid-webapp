export const formatOneDecimalDisplayValue = (
  value: number | string | null | undefined,
): string => {
  if (value === null || typeof value === 'undefined' || value === '') {
    return ''
  }

  const parsed = Number.parseFloat(String(value))
  return Number.isNaN(parsed) ? '' : parsed.toFixed(1)
}
