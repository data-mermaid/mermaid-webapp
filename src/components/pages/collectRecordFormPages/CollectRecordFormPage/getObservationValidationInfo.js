import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import { getMessageColumns } from '../../../../library/validationMessageHelpers'
import getDuplicateValuesObservationIds from './getDuplicateValuesObservationIds'

// A row's own validations, then each record-level duplicate_values that names the row. Bleaching
// has one duplicate check per table, so a row shows only the one about its own table.
const getObservationValidations = ({ observationId, collectRecord, observationsPropertyName }) => {
  const results = collectRecord?.validations?.results

  const rowValidations = (results?.data?.[observationsPropertyName] ?? []).flat().filter(
    // The API names the row in either property.
    (validation) =>
      validation.context?.observation_id === observationId ||
      validation.context?.id === observationId,
  )

  const duplicatesNamingRow = (results?.$record ?? []).filter((validation) =>
    getDuplicateValuesObservationIds(validation).includes(observationId),
  )

  return [...rowValidations, ...duplicatesNamingRow]
}

const STATUS_SEVERITY = { ignore: 1, warning: 2, error: 3 }

// When two messages are about one cell, the more severe status marks it.
const isStrongerMark = (mark, current) =>
  !current || STATUS_SEVERITY[mark.status] > STATUS_SEVERITY[current.status]

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
export const getCellMarkProps = (cellMarks, ...columns) => {
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
