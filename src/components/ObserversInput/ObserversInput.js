import React from 'react'
import PropTypes from 'prop-types'

import { H2 } from '../generic/text'
import { InputWrapper } from '../generic/form'
import { formikPropType } from '../../library/formikPropType'
import { fishBeltPropType, observersPropType } from '../../App/mermaidData/mermaidDataProptypes'
import InputCheckboxGroupWithLabelAndValidation from '../mermaidInputs/InputCheckboxGroupWithLabelAndValidation'
import { getObserverNameOptions } from '../../library/observerHelpers'
import getValidationPropertiesForInput from '../pages/collectRecordFormPages/getValidationPropertiesForInput'

const ObserversInput = ({
  areValidationsShowing,
  collectRecord,
  formik,
  ignoreValidations,
  observers,
  onObserversChange,
  resetValidations,
  ...restOfProps
}) => {
  const observerNameOptions = getObserverNameOptions(observers)
  const observerNameValues = formik.values.observers.map(({ profile }) => profile)

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
        ignoreValidations={() => {
          ignoreValidations({ validationPath: 'data.observers' })
        }}
        resetValidations={() => {
          resetValidations({ validationPath: 'data.observers' })
        }}
        {...getValidationPropertiesForInput(
          collectRecord?.validations?.results?.data?.observers,
          areValidationsShowing,
        )}
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
  areValidationsShowing: PropTypes.bool.isRequired,
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  ignoreValidations: PropTypes.func.isRequired,
  observers: PropTypes.arrayOf(observersPropType).isRequired,
  onObserversChange: PropTypes.func.isRequired,
  resetValidations: PropTypes.func.isRequired,
}

ObserversInput.defaultProps = { collectRecord: undefined }

export default ObserversInput
