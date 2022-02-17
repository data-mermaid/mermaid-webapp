// This method will check for double quotes in string.
// It returns an array of split strings by a space delimiter.
// example A: splitSearchQueryStrings(`"to the" dustin`).
// Also supports multi quotes in string.
// example B: splitSearchQueryStrings(`"to the" dustin "kim"`)
export const splitSearchQueryStrings = (words) => {
  const regex = /"(.*?)"|([a-zA-Z0-9_,;\-\+]+)|(\|)/
  const parts = words.split(regex)
  const searchItems = []

  for (let n = 0; n < parts.length; n++) {
    let item = parts[n]

    if (!item || item.trim().length === 0) {
      // eslint-disable-next-line no-continue
      continue
    }
    if (item.startsWith('"')) {
      item = item.substr(1, item.length - 2)
    }
    item = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    searchItems.push(new RegExp(`.*${ item }.*`))
  }

  return searchItems

// return (words.match(/[^\s"]+|"([^"]*)"/gi) || []).map((word) => word.replace(/^"(.+(?="$))"$/, '$1'))

}
