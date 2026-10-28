// `unsuccessful_dry_submit` is the API's summary of everything blocking a submit ("One or
// more invalid fields: ..."). It duplicates errors the user can already see, so it is only
// worth showing once nothing else at the record level is failing.
//
// `len_surveyed_not_positive` and `interval_size_not_positive` come from the observation count
// checks on benthic LIT, benthic PIT and habitat complexity, when the transect length or interval
// size is empty, zero or negative. The transect length and interval size fields report every one
// of those cases themselves, so the record-level copies are never the only sign of the problem.
//
// Both the record-level panel and the form status indicator chips filter through here, so
// the chip totals cannot count a message the panel has hidden.
const DRY_SUBMIT_CODE = 'unsuccessful_dry_submit'
const CODES_REPORTED_BY_A_FIELD = new Set([
  'len_surveyed_not_positive',
  'interval_size_not_positive',
])

const readProperty = (value: unknown, property: 'code' | 'status'): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const read = (value as Record<string, unknown>)[property]

  return typeof read === 'string' ? read : undefined
}

const getRecordLevelValidationsToDisplay = <T>(validations: readonly T[]): T[] => {
  const shown = validations.filter(
    (validation) => !CODES_REPORTED_BY_A_FIELD.has(readProperty(validation, 'code') ?? ''),
  )
  const hasOtherErrors = shown.some(
    (validation) =>
      readProperty(validation, 'code') !== DRY_SUBMIT_CODE &&
      readProperty(validation, 'status') === 'error',
  )

  return shown.filter(
    (validation) => readProperty(validation, 'code') !== DRY_SUBMIT_CODE || !hasOtherErrors,
  )
}

export default getRecordLevelValidationsToDisplay
