import React from 'react'
import PropTypes from 'prop-types'

import { H2 } from '../generic/text'
import { InputWrapper } from '../generic/form'
import { formikPropType } from '../../library/formikPropType'
import { observersPropType } from '../../App/mermaidData/mermaidDataProptypes'
import InputCheckboxGroupWithLabel from '../generic/InputCheckboxGroupWithLabel'
import { getObserverNameOptions } from '../../library/observerHelpers'

const ObserversInput = ({ formik, observers }) => {
  const observerNameOptions = getObserverNameOptions(observers)

  const observerNameValues = formik.values.observers.map(
    ({ profile }) => profile,
  )

  const filterObserverProfiles = (observerIds) =>
    [...observers].filter(({ profile }) => observerIds.includes(profile))

  return (
    <InputWrapper>
      <H2>Observers</H2>
      <InputCheckboxGroupWithLabel
        label="Observers"
        id="observers"
        options={observerNameOptions}
        value={observerNameValues}
        onChange={(selectedItems) => {
          const updateSelectedItems = filterObserverProfiles(selectedItems)

          formik.setFieldValue('observers', updateSelectedItems)
        }}
      />
    </InputWrapper>
  )
}

ObserversInput.propTypes = {
  observers: PropTypes.arrayOf(observersPropType).isRequired,
  formik: formikPropType.isRequired,
}

export default ObserversInput
