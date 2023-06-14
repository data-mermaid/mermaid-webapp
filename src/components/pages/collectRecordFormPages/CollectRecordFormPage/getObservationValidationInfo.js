import getValidationPropertiesForInput from '../getValidationPropertiesForInput'

const getObservationValidations = ({ observationId, collectRecord, observationsPropertyName }) => {
  const allObservationsValidations =
    collectRecord?.validations?.results?.data?.[observationsPropertyName] ?? []
  const justThisObservationsValidations = allObservationsValidations.flat().filter((validation) => {
    // api is inconsistent between id and observation_id
    return (
      validation.context?.observation_id === observationId ||
      validation.context?.id === observationId
    )
  })

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
