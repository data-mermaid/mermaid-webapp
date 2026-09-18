import type { ValidationStatus } from '../../../types/constants'
import type { Validation, ValidationContext } from '../../../types/validation'

// A row's validations are usually an array, but some paths hold a keyed object (see
// walkFieldSubtree in getValidationSummary), so they are read by key.
export type RowValidations = Validation[] | Record<string, Validation>

export interface ValidationMessage {
  code?: string
  name?: string
  id?: string
  context?: ValidationContext | null
}

export interface InputValidationProperties {
  validationType?: ValidationStatus
  validationMessages?: ValidationMessage[]
}

// Which of a row's validations actually reach the screen. One error hides everything else on
// that row: the required error if there is one, otherwise the first. Otherwise warnings and
// ignores show together, and a row left with only resets shows nothing. Also read by
// getValidationSummary, so the status indicator chips count exactly what this returns.

// An empty field usually fails more than one check (empty depth is also "not a number"), and
// "Required" is the only one of those messages the user can act on.
const REQUIRED_CODE = 'required'

export const getValidationsToDisplay = (inputValidations: RowValidations): Validation[] => {
  const validationObjectKeys = Object.keys(inputValidations)
  const errors = validationObjectKeys
    .filter((key) => inputValidations[key].status === 'error')
    .map((key) => inputValidations[key])
  const warnings = validationObjectKeys
    .filter(
      (key) =>
        inputValidations[key].status === 'warning' || inputValidations[key].status === 'ignore',
    )
    .map((key) => inputValidations[key])
  const resets = validationObjectKeys
    .filter((key) => inputValidations[key].status === 'reset')
    .map((key) => inputValidations[key])

  const areErrors = errors.length
  const areWarnings = warnings.length
  const areResets = resets.length

  if (areErrors) {
    const requiredError = errors.find((validation) => validation.code === REQUIRED_CODE)

    return [requiredError ?? errors[0]]
  }
  if (!areErrors && areWarnings) {
    return warnings
  }
  if (!areErrors && !areWarnings && areResets) {
    return resets
  }

  return []
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
    context: validation.context,
    code: validation.code,
    id: validation.validation_id,
    name: validation.name,
  }))

  const statusToDisplayIfNotOk = validationsToDisplay.length
    ? validationsToDisplay[0].status
    : undefined
  const validationType = !validationsToDisplay.length ? 'ok' : statusToDisplayIfNotOk

  return {
    validationType,
    validationMessages,
  }
}

export default getValidationPropertiesForInput
