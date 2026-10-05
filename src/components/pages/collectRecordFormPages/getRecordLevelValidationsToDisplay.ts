// `unsuccessful_dry_submit` is the API's summary of everything blocking a submit ("One or
// more invalid fields: ..."). It duplicates errors the user can already see, so it is only
// worth showing once nothing else at the record level is failing.
//
// Both the record-level panel and the form status indicator chips filter through here, so
// the chip totals cannot count a summary the panel has hidden.
const DRY_SUBMIT_CODE = 'unsuccessful_dry_submit'

const readProperty = (value: unknown, property: 'code' | 'status'): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const read = (value as Record<string, unknown>)[property]

  return typeof read === 'string' ? read : undefined
}

const getRecordLevelValidationsToDisplay = <T>(validations: readonly T[]): T[] => {
  const hasOtherErrors = validations.some(
    (validation) =>
      readProperty(validation, 'code') !== DRY_SUBMIT_CODE &&
      readProperty(validation, 'status') === 'error',
  )

  return validations.filter(
    (validation) => readProperty(validation, 'code') !== DRY_SUBMIT_CODE || !hasOtherErrors,
  )
}

export default getRecordLevelValidationsToDisplay
