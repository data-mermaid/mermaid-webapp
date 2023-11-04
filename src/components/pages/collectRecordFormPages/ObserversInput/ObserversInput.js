import PropTypes from 'prop-types'
import React from 'react'

import { formikPropType } from '../../../../library/formikPropType'
import { getObserverNameOptions } from '../../../../library/observerHelpers'
import { H2 } from '../../../generic/text'
import InputCheckboxGroupWithLabelAndValidation from '../../../mermaidInputs/InputCheckboxGroupWithLabelAndValidation'
import { InputWrapper } from '../../../generic/form'
import {
  observersPropType,
  observersValidationPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import language from '../../../../language'
import InputMuiChipSelectWithLabelAndValidation from '../../../mermaidInputs/InputMuiChipSelectWithLabelAndValidation/InputMuiChipSelectWithLabelAndValidation'

const ObserversInput = ({
  areValidationsShowing,
  formik,
  ignoreNonObservationFieldValidations,
  observers,
  resetNonObservationFieldValidations,
  validationsApiData,
  validationPropertiesWithDirtyResetOnInputChange,
  ...restOfProps
}) => {
  const validationPath = 'data.observers'
  const validationProperties = getValidationPropertiesForInput(
    validationsApiData?.observers,
    areValidationsShowing,
  )
  const observerNameOptions = getObserverNameOptions(observers)
  const observerNameValues = formik.values.observers?.map(({ profile }) => profile) ?? []

  const filterObserverProfiles = (observerIds) =>
    [...observers].filter(({ profile }) =>
      !observerIds ? undefined : observerIds.includes(profile),
    )

  const handleObserversChange = (selectedItems) => {
    const selectedObservers = filterObserverProfiles(selectedItems)

    formik.setFieldValue('observers', selectedObservers)
    resetNonObservationFieldValidations({
      validationPath,
    })
  }

  return (
    <InputWrapper {...restOfProps}>
      <H2>{language.pages.collectRecord.formSectionTitle.observers}</H2>
      <InputMuiChipSelectWithLabelAndValidation
        label="Observers"
        required={true}
        id="observers"
        options={observerNameOptions}
        value={observerNameValues}
        ignoreNonObservationFieldValidations={() => {
          ignoreNonObservationFieldValidations({ validationPath })
        }}
        resetNonObservationFieldValidations={() => {
          resetNonObservationFieldValidations({ validationPath })
        }}
        {...validationPropertiesWithDirtyResetOnInputChange(validationProperties, 'observers')}
        onChange={({ selectedItems }) => handleObserversChange(selectedItems)}
      />
    </InputWrapper>
  )
}

ObserversInput.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  observers: observersPropType.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: PropTypes.shape({ observers: observersValidationPropType }).isRequired,
  validationPropertiesWithDirtyResetOnInputChange: PropTypes.func.isRequired,
}

export default ObserversInput
