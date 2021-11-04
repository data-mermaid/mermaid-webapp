import React from 'react'
import PropTypes from 'prop-types'

import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import { InputRow } from '../../generic/form'
import ValidationInfo from '../ValidationInfo/ValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const InputRadioWithLabelAndValidation = ({
  id,
  label,
  options,
  validationMessages,
  ignoreValidations,
  resetValidations,
  validationType,
  testId,
  ...restOfProps
}) => {
  const optionsList = options.map(({ label: optionLabel, value }) => {
    return (
      <div key={value}>
        <input
          type="radio"
          id={value}
          {...restOfProps}
          value={value}
          checked={restOfProps.value === value}
        />
        <label htmlFor={value}>{optionLabel}</label>
      </div>
    )
  })

  return (
    <InputRow validationType={validationType} data-testid={testId}>
      <label htmlFor={id}>{label}</label>
      <div>{optionsList}</div>
      <ValidationInfo
        ignoreValidations={ignoreValidations}
        resetValidations={resetValidations}
        validationMessages={validationMessages}
        validationType={validationType}
      />
    </InputRow>
  )
}

InputRadioWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  ignoreValidations: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: inputOptionsPropTypes.isRequired,
  resetValidations: PropTypes.func.isRequired,
  testId: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

InputRadioWithLabelAndValidation.defaultProps = {
  testId: undefined,
  validationType: undefined,
  validationMessages: [],
}

export default InputRadioWithLabelAndValidation
