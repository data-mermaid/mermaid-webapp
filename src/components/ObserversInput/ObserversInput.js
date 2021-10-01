import React from 'react'
import PropTypes from 'prop-types'

import { H2 } from '../generic/text'
import { InputWrapper } from '../generic/form'
import { formikPropType } from '../../library/formikPropType'
import {
  fishBeltPropType,
  observersPropType,
} from '../../App/mermaidData/mermaidDataProptypes'
import InputCheckboxGroupWithLabelAndValidation from '../generic/InputCheckboxGroupWithLabelAndValidation'
import { getObserverNameOptions } from '../../library/observerHelpers'
import getValidationPropertiesForInput from '../pages/collectRecordFormPages/getValidationPropertiesForInput'

const ObserversInput = ({ formik, observers, collectRecord }) => {
  const observerNameOptions = getObserverNameOptions(observers)
  const observerNameValues = formik.values.observers.map(
    ({ profile }) => profile,
  )

  const filterObserverProfiles = (observerIds) =>
    [...observers].filter(({ profile }) => observerIds.includes(profile))

  return (
    <InputWrapper>
      <H2>Observers</H2>
      <InputCheckboxGroupWithLabelAndValidation
        label="Observers"
        id="observers"
        options={observerNameOptions}
        value={observerNameValues}
        onChange={(selectedItems) => {
          const updateSelectedItems = filterObserverProfiles(selectedItems)

          formik.setFieldValue('observers', updateSelectedItems)
        }}
        {...getValidationPropertiesForInput(
          collectRecord?.validations?.results?.observers,
        )}
      />
    </InputWrapper>
  )
}

ObserversInput.propTypes = {
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  observers: PropTypes.arrayOf(observersPropType).isRequired,
}

ObserversInput.defaultProps = { collectRecord: undefined }

export default ObserversInput
