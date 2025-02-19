export const getIsEmptyStringOrWhitespace = (value) => {
  if (typeof value !== 'string') {
    return false
  }

  return value.trim() === ''
}
