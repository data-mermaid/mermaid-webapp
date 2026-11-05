import React, { createContext, useContext } from 'react'

import RecordLevelValidationInfo, {
  type RecordLevelValidationInfoProps,
} from '../RecordLevelValidationInfo/RecordLevelValidationInfo'

// CollectRecordFormPage provides one value per observation table, holding the record-level
// validations about that table.
export const ObservationsHeadingValidationsContext =
  createContext<RecordLevelValidationInfoProps | null>(null)

// Rendered under each observation table's heading. Outside a collect record form there is no
// provider, so it renders nothing.
const ObservationsHeadingValidations = () => {
  const context = useContext(ObservationsHeadingValidationsContext)
  const hasValidationToShow = context?.validations.some(({ status }) => status !== 'ok')

  if (!context?.areValidationsShowing || !hasValidationToShow) {
    return null
  }

  return <RecordLevelValidationInfo {...context} testId="observations-heading-validations" />
}

export default ObservationsHeadingValidations
