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

export const getObjectById = (arrayWithObjects, searchId) =>
  arrayWithObjects.find((object) => object.id === searchId)

export const getProtocolName = (protocol) => {
  switch (protocol) {
    case 'fishbelt':
      return 'Fish Belt'
    case 'benthiclit':
      return 'Benthic Lit'
    case 'benthicpit':
      return 'Benthic Pit'
    case 'habitatcomplexity':
      return 'Habitat Complexity'
    case 'bleaching':
      return 'Bleaching'
    default:
      return ''
  }
}
