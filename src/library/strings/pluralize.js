export const pluralize = (val, singularWord, plural) => {
  if (val === 1) {
    return singularWord
  }

  return plural
}
