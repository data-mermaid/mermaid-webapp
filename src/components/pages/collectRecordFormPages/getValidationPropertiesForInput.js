const getValidationPropertiesForInput = (inputValidations) => {
  if (!inputValidations) {
    return {}
  }
  const validationObjectKeys = Object.keys(inputValidations)
  const errors = validationObjectKeys
    .filter((key) => inputValidations[key].status === 'error')
    .map((key) => inputValidations[key])
  const warnings = validationObjectKeys
    .filter((key) => inputValidations[key].status === 'warning')
    .map((key) => inputValidations[key])

  const validationToDisplay = errors.length ? errors[0] : warnings[0]

  return {
    validationType: validationToDisplay?.status,
    validationMessage: validationToDisplay?.message,
  }
}

export default getValidationPropertiesForInput
