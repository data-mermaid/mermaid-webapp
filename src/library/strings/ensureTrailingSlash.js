export const ensureTrailingSlash = string => {
  return string.slice(-1) === '/' ? string : `${string}/`
}
