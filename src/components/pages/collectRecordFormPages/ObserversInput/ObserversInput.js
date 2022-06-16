import React from 'react'
import PropTypes from 'prop-types'

import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import { formikPropType } from '../../../../library/formikPropType'
import { observersPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import InputCheckboxGroupWithLabelAndValidation from '../../../mermaidInputs/InputCheckboxGroupWithLabelAndValidation'
import { getObserverNameOptions } from '../../../../library/observerHelpers'

const ObserversInput = ({ formik, observers, onObserversChange, ...restOfProps }) => {
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
        required={true}
        id="observers"
        options={observerNameOptions}
        value={observerNameValues}
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
  observers: PropTypes.arrayOf(observersPropType).isRequired,
  onObserversChange: PropTypes.func.isRequired,
}

export default ObserversInput
