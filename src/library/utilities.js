export const dateFormat = (dateString) => {
  if (!dateString) {
    return undefined
  }

  const dateSplit = dateString.split('-')

  return `${dateSplit[0]}-${`0${dateSplit[1]}`.slice(
    -2,
  )}-${`0${dateSplit[2]}`.slice(-2)}`
}

export const pluralize = (val, singularWord, pluralWord) => {
  if (val === 1) return singularWord

  return pluralWord
}

export const getNameBySearchId = (options, searchId) =>
  options.find(({ id }) => id === searchId).name
