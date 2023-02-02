export const MISSING_NAME = '__null__'

export const getName = (name, missingNameLanguage) => {
  return name === MISSING_NAME ? missingNameLanguage : name
}
