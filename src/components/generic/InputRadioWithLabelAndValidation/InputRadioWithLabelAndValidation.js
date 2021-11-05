import React from 'react'
import PropTypes from 'prop-types'

import { IconCheck } from '../../icons'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import { InputRow, ValidationMessage } from '../form'

const InputRadioWithLabelAndValidation = ({
  id,
  label,
  options,
  validationMessage,
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
      <div>
        {validationMessage && (validationType === 'error' || validationType === 'warning') ? (
          <ValidationMessage validationType={validationType}>{validationMessage}</ValidationMessage>
        ) : null}
        {validationType === 'ok' ? <IconCheck aria-label="Passed validation" /> : null}
      </div>
    </InputRow>
  )
}

InputRadioWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: inputOptionsPropTypes.isRequired,
  testId: PropTypes.string,
  validationType: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputRadioWithLabelAndValidation.defaultProps = {
  testId: undefined,
  validationType: undefined,
  validationMessage: undefined,
}

export default InputRadioWithLabelAndValidation
