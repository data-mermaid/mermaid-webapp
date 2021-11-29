const getValidationsToDisplay = (inputValidations) => {
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
    return [errors[0]]
  }
  if (!areErrors && areWarnings) {
    return warnings
  }
  if (!areErrors && !areWarnings && areResets) {
    return resets
  }

  return []
}

const getValidationPropertiesForInput = (inputValidations, areValidationsShowing) => {
  if (!areValidationsShowing) {
    return {}
  }
  if (!inputValidations) {
    return { validationType: 'ok' }
  }

  const validationsToDisplay = getValidationsToDisplay(inputValidations)
  const validationMessages = validationsToDisplay.map((validation) => ({
    message: validation.name,
    id: validation.validation_id,
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
