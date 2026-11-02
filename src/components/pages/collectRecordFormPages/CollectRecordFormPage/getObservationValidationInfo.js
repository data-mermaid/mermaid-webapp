import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import { getMessageColumns } from '../../../../library/validationMessageHelpers'
import getDuplicateValuesObservationIds, {
  isDuplicateValuesValidation,
} from './getDuplicateValuesObservationIds'

const getObservationValidations = ({ observationId, collectRecord, observationsPropertyName }) => {
  const allObservationsValidations =
    collectRecord?.validations?.results?.data?.[observationsPropertyName] ?? []

  const duplicateRecordValidator = collectRecord?.validations?.results?.$record?.filter(
    isDuplicateValuesValidation,
  )

  const isObservationIdIncludedInDuplicateRecordValidator = duplicateRecordValidator?.some(
    (validator) => getDuplicateValuesObservationIds(validator).includes(observationId),
  )

  const justThisObservationsValidations = allObservationsValidations.flat().filter((validation) => {
    // api is inconsistent between id and observation_id

    return (
      validation.context?.observation_id === observationId ||
      validation.context?.id === observationId
    )
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

const STATUS_SEVERITY = { ignore: 1, warning: 2, error: 3 }

// Which mark wins when two messages are about one cell: a live message over a greyed one, then
// the more severe status.
const isStrongerMark = (mark, current) => {
  if (!current) {
    return true
  }
  if (mark.isStale !== current.isStale) {
    return !mark.isStale
  }

  return STATUS_SEVERITY[mark.status] > STATUS_SEVERITY[current.status]
}

// The mark for each observation column a row's messages are about, keyed by column.
const getCellMarks = (validationMessages) =>
  validationMessages.reduce((marks, message) => {
    const mark = { status: message.status, isStale: Boolean(message.isStale) }

    getMessageColumns(message).forEach((column) => {
      if (isStrongerMark(mark, marks[column])) {
        marks[column] = mark
      }
    })

    return marks
  }, {})

// Props for an observation cell that answers to one or more columns, such as a bleaching count
// that is both its own column and part of the row's total.
export const getCellMarkProps = (cellMarks = {}, ...columns) => {
  const mark = columns
    .map((column) => cellMarks[column])
    .reduce(
      (strongest, candidate) =>
        candidate && isStrongerMark(candidate, strongest) ? candidate : strongest,
      undefined,
    )

  return mark ? { 'data-validation-mark': mark.isStale ? 'info' : mark.status } : {}
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

  const { validationType: observationValidationType, validationMessages = [] } =
    observationValidationsToDisplay

  // A greyed message is on screen but not live, so the row's flags follow the others.
  const hasLiveMessageWithStatus = (status) =>
    validationMessages.some((message) => message.status === status && !message.isStale)

  return {
    hasObservationErrorValidation: hasLiveMessageWithStatus('error'),
    hasObservationWarningValidation: hasLiveMessageWithStatus('warning'),
    isObservationValid: observationValidationType === 'ok',
    observationValidationMessages: validationMessages,
    observationValidationType,
    cellMarks: getCellMarks(validationMessages),
  }
}

export default getObservationValidationInfo
