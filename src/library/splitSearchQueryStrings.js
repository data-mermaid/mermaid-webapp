// This method will check for double quotes in string.
// It returns an array of split strings by a space delimiter.
// example A: splitSearchQueryStrings(`"to the" dustin`).
// Also supports multi quotes in string.
// example B: splitSearchQueryStrings(`"to the" dustin "kim"`)
export const splitSearchQueryStrings = (words) =>
  (words.match(/[^\s"]+|"([^"]*)"/gi) || []).map((word) => word.replace(/^"(.+(?="$))"$/, '$1'))
