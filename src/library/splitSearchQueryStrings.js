// This method will check for double quotes in string.
// It returns an array of split strings by a space delimiter.
// example A: splitSearchQueryStrings(`"to the" dustin`).
// Also supports multi quotes in string.
// example B: splitSearchQueryStrings(`"to the" dustin "kim"`)
export const splitSearchQueryStrings = (words) => {
  const anythingInDoubleQuotes = /"(.*?)"/.source
  const alphaNumericAndSomeOtherSymbolsIncludingApostrophe = /([a-zA-Z0-9_,;'/-/+]+)/.source
  const pipeCharacter = /(\|)/.source
  const regex = new RegExp(
    `${anythingInDoubleQuotes}|${alphaNumericAndSomeOtherSymbolsIncludingApostrophe}|${pipeCharacter}`,
  )
  const parts = words.split(regex)
  const searchItems = []

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let n = 0; n < parts.length; n++) {
    let item = parts[n]

    if (!item || item.trim().length === 0) {
      continue
    }
    if (item.startsWith('"')) {
      item = item.substr(1, item.length - 2)
    }
    item = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // The 'i' modifier makes the regex case insensitive
    searchItems.push(new RegExp(`.*${item}.*`, 'i'))
  }

  return searchItems
}
