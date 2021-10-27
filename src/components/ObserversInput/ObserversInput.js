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

const ObserversInput = ({
  collectRecord,
  formik,
  observers,
  onObserversChange,
  areValidationsShowing,
  ...restOfProps
}) => {
  const observerNameOptions = getObserverNameOptions(observers)
  const observerNameValues = formik.values.observers.map(
    ({ profile }) => profile,
  )

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
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  observers: PropTypes.arrayOf(observersPropType).isRequired,
  onObserversChange: PropTypes.func.isRequired,
  areValidationsShowing: PropTypes.bool.isRequired,
}

ObserversInput.defaultProps = { collectRecord: undefined }

export default ObserversInput
