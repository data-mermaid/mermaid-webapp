export const hasNonEmptyValue = (value) => {
  return value !== null && typeof value !== 'undefined' && value !== ''
}
