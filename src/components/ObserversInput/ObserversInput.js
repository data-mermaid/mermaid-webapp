import React from 'react'
import PropTypes from 'prop-types'

import { H2 } from '../generic/text'
import { InputWrapper } from '../generic/form'
import { formikPropType } from '../../library/formikPropType'
import { observersPropType } from '../../App/mermaidData/mermaidDataProptypes'
import InputCheckboxGroupWithLabelAndValidation from '../mermaidInputs/InputCheckboxGroupWithLabelAndValidation'
import { getObserverNameOptions } from '../../library/observerHelpers'
import mermaidInputsPropTypes from '../mermaidInputs/mermaidInputsPropTypes'

const ObserversInput = ({
  formik,
  ignoreNonObservationFieldValidations,
  observers,
  onObserversChange,
  resetNonObservationFieldValidations,
  validationPath,
  validationProperties,
  ...restOfProps
}) => {
  const observerNameOptions = getObserverNameOptions(observers)
  const { initialValues, values } = formik
  const observerNameValues = values.observers.map(({ profile }) => profile)

  const filterObserverProfiles = (observerIds) =>
    [...observers].filter(({ profile }) =>
      !observerIds ? undefined : observerIds.includes(profile),
    )

  return (
    <InputWrapper {...restOfProps}>
      <H2>Observers</H2>
      <InputCheckboxGroupWithLabelAndValidation
        label="Observers"
        id="observers"
        options={observerNameOptions}
        value={observerNameValues}
        initialValue={initialValues.observers}
        ignoreNonObservationFieldValidations={() => {
          ignoreNonObservationFieldValidations({ validationPath })
        }}
        resetNonObservationFieldValidations={() => {
          resetNonObservationFieldValidations({ validationPath })
        }}
        {...validationProperties}
        onChange={({ selectedItems }) => {
          const selectedObservers = filterObserverProfiles(selectedItems)

          onObserversChange({
            inputValidationPropertyName: 'observers',
            selectedObservers,
          })
        }}
      />
    </InputWrapper>
  )
}

ObserversInput.propTypes = {
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  observers: PropTypes.arrayOf(observersPropType).isRequired,
  onObserversChange: PropTypes.func.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  validationPath: PropTypes.string.isRequired,
  validationProperties: PropTypes.shape({
    validationType: PropTypes.string,
    validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  }).isRequired,
}

export default ObserversInput
