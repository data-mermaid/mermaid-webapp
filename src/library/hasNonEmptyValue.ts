export const hasNonEmptyValue = (value: unknown): boolean => {
  return value !== null && typeof value !== 'undefined' && value !== ''
}
