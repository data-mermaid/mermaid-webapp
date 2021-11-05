const getValidationPropertiesForInput = (inputValidations, areValidationsShowing) => {
  if (!areValidationsShowing) {
    return {}
  }
  if (!inputValidations) {
    return { validationType: 'ok' }
  }
  const validationObjectKeys = Object.keys(inputValidations)
  const errors = validationObjectKeys
    .filter(key => inputValidations[key].status === 'error')
    .map(key => inputValidations[key])
  const warnings = validationObjectKeys
    .filter(key => inputValidations[key].status === 'warning')
    .map(key => inputValidations[key])

  const validationToDisplay = errors.length ? errors[0] : warnings[0]

  return {
    validationType: !validationToDisplay ? 'ok' : validationToDisplay?.status,
    validationMessage: validationToDisplay?.code,
  }
}

export default getValidationPropertiesForInput
