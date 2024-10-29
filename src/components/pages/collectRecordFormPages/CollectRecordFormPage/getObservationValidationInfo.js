import getValidationPropertiesForInput from '../getValidationPropertiesForInput'

const getObservationValidations = ({ observationId, collectRecord, observationsPropertyName }) => {
  const allObservationsValidations =
    collectRecord?.validations?.results?.data?.[observationsPropertyName] ?? []

  const duplicateRecordValidator = collectRecord?.validations?.results?.$record?.filter(
    (record) => record?.code === 'duplicate_values',
  )

  const isObservationIdIncludedInDuplicateRecordValidator = duplicateRecordValidator?.some(
    (validator) =>
      validator?.context?.duplicates?.some((duplicateArray) =>
        duplicateArray?.some((obs) => obs.id === observationId),
      ),
  )

  const justThisObservationsValidations = allObservationsValidations.flat().filter((validation) => {
    // api is inconsistent between id and observation_id

    if (observationsPropertyName === 'images') {
      return validation.context?.image_id === observationId
    } else {
      return (
        validation.context?.observation_id === observationId ||
        validation.context?.id === observationId
      )
    }
  })

  // if there are duplicate values, in context, there is an array of objects with the duplicate observations ids
  // here we add an id property to the context object so that we can use the same function to get the validation properties for the input

  if (isObservationIdIncludedInDuplicateRecordValidator) {
    duplicateRecordValidator[0].context.id = observationId

    const observationValidationsWithDuplicateValidator =
      justThisObservationsValidations.concat(duplicateRecordValidator)

    return observationValidationsWithDuplicateValidator
  }

  return justThisObservationsValidations
}

const getObservationValidationInfo = ({
  observationId,
  collectRecord,
  areValidationsShowing,
  observationsPropertyName,
}) => {
  const observationValidations = getObservationValidations({
    observationId,
    collectRecord,
    observationsPropertyName,
  })

  const observationValidationsToDisplay = getValidationPropertiesForInput(
    observationValidations,
    areValidationsShowing,
  )

  const { validationType: observationValidationType } = observationValidationsToDisplay
  const observationValidationMessages = observationValidationsToDisplay?.validationMessages ?? []

  const isObservationValid = observationValidationType === 'ok'
  const hasObservationWarningValidation = observationValidationType === 'warning'
  const hasObservationErrorValidation = observationValidationType === 'error'
  const hasObservationIgnoredValidation = observationValidationType === 'ignore'
  const hasObservationResetIgnoredValidation = observationValidationType === 'reset'

  return {
    hasObservationErrorValidation,
    hasObservationIgnoredValidation,
    hasObservationResetIgnoredValidation,
    hasObservationWarningValidation,
    isObservationValid,
    observationValidationMessages,
    observationValidationType,
  }
}

export default getObservationValidationInfo
