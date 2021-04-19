export const pluralize = (val, singularWord, pluralWord) => {
  if (val === 1) return singularWord

  return pluralWord
}
