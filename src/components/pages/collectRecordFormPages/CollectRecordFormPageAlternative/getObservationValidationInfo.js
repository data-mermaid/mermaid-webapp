import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'

const getObservationValidations = ({ observationId, collectRecord }) => {
  const allObservationsValidations =
    collectRecord?.validations?.results?.data?.[getObservationsPropertyNames(collectRecord)[0]] ??
    []

  const justThisObservationsValidations = allObservationsValidations.flat().filter((validation) => {
    return validation.context?.observation_id === observationId
  })

  return justThisObservationsValidations
}

const getObservationValidationInfo = ({ observationId, collectRecord, areValidationsShowing }) => {
  const observationValidations = getObservationValidations({ observationId, collectRecord })
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

  return {
    isObservationValid,
    hasObservationWarningValidation,
    hasObservationErrorValidation,
    hasObservationIgnoredValidation,
    observationValidationMessages,
    observationValidationType,
  }
}

export default getObservationValidationInfo
