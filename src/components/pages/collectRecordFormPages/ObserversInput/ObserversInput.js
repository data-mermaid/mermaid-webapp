import PropTypes from 'prop-types'
import React from 'react'

import { formikPropType } from '../../../../library/formikPropType'
import { getObserverNameOptions } from '../../../../library/observerHelpers'
import { H2 } from '../../../generic/text'
import InputCheckboxGroupWithLabelAndValidation from '../../../mermaidInputs/InputCheckboxGroupWithLabelAndValidation'
import { InputWrapper } from '../../../generic/form'
import { observersPropType } from '../../../../App/mermaidData/mermaidDataProptypes'

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
