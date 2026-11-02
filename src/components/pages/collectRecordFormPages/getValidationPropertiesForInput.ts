import type { ValidationStatus } from '../../../types/constants'
import type { Validation, ValidationContext } from '../../../types/validation'
import { getRequiredColumn } from '../../../library/validationMessageHelpers'

// A row's validations are usually an array, but some paths hold a keyed object (see
// walkFieldSubtree in getValidationSummary), so they are read by key.
export type RowValidations = Validation[] | Record<string, Validation>

interface ValidationMessage {
  status?: ValidationStatus
  isStale?: boolean
  code?: string
  name?: string
  id?: string
  context?: ValidationContext | null
}

// `info` is the colour of a field or row whose every message is greyed: nothing on it is live.
type InputValidationType = ValidationStatus | 'info'

export interface InputValidationProperties {
  validationType?: InputValidationType
  validationMessages?: ValidationMessage[]
}

const REQUIRED_CODE = 'required'

// An empty cell fails more than one check: an empty count is also not a valid count. Only
// "Required" is actionable, so these errors are hidden when the same column's required error is
// showing. An error missing from this map always shows, so a gap here adds a message rather
// than hiding one.
const EMPTY_CELL_ERROR_COLUMNS: Record<string, string> = {
  invalid_fish_count: 'count',
  invalid_fish_size: 'size',
  invalid_invert_count: 'count',
  not_positive_integer: 'quadrat_number',
}

// The management field's similarity check reports `site_not_found` when the site field is
// empty, so it only ever fires alongside the site field's own Required. A site that is set but
// missing from the project is reported on the site field instead, where it stays.
const isSiteNotFoundOnManagement = (validation: Validation) =>
  validation.code === 'site_not_found' &&
  (validation.fields ?? []).includes('data.sample_event.management')

const isRequiredError = (validation: Validation) =>
  validation.status === 'error' && validation.code === REQUIRED_CODE

// Which of a field's or row's validations reach the screen. Every required error shows, then
// every other error and every warning or ignore, so an error never hides a warning. A field is
// one cell, so its required error hides the field's other errors. A row's required error names
// its column, so it hides only the errors the API also raises for that empty cell. Also read by
// getValidationSummary, so the status indicator chips count exactly what this returns.
export const getValidationsToDisplay = (inputValidations: RowValidations): Validation[] => {
  const validations = Object.values(inputValidations).filter(
    (validation) => !isSiteNotFoundOnManagement(validation),
  )
  const requiredErrors = validations.filter(isRequiredError)
  const isFieldRequired = requiredErrors.some((validation) => !getRequiredColumn(validation.name))
  const emptyColumns = new Set(
    requiredErrors.map((validation) => getRequiredColumn(validation.name)),
  )
  const otherErrors = validations.filter(
    (validation) =>
      validation.status === 'error' &&
      !isRequiredError(validation) &&
      !isFieldRequired &&
      !emptyColumns.has(EMPTY_CELL_ERROR_COLUMNS[validation.code ?? '']),
  )
  const warnings = validations.filter(
    (validation) => validation.status === 'warning' || validation.status === 'ignore',
  )

  return [...requiredErrors, ...otherErrors, ...warnings]
}

const getValidationPropertiesForInput = (
  inputValidations: RowValidations | undefined,
  areValidationsShowing: boolean,
): InputValidationProperties => {
  if (!areValidationsShowing) {
    return {}
  }
  if (!inputValidations) {
    return { validationType: 'ok' }
  }

  const validationsToDisplay = getValidationsToDisplay(inputValidations)

  const validationMessages = validationsToDisplay.map((validation) => ({
    status: validation.status,
    isStale: validation.isStale,
    context: validation.context,
    code: validation.code,
    id: validation.validation_id,
    name: validation.name,
  }))

  // Errors are listed first, so the first live message's status is the field's or row's colour.
  const liveValidations = validationsToDisplay.filter((validation) => !validation.isStale)
  const validationType: InputValidationType =
    liveValidations[0]?.status ?? (validationsToDisplay.length ? 'info' : 'ok')

  return {
    validationType,
    validationMessages,
  }
}

export default getValidationPropertiesForInput
