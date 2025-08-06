import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { InputRow } from '../../generic/form'
import { useStopInputScrollingIncrementNumber } from '../../../library/useStopInputScrollingIncrementNumber'

import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import InputNoRowWithLabelAndValidation from '../InputNoRowWithLabelAndValidation'

const InputWithLabelAndValidation = ({
  required = false,
  helperText = undefined,
  id,
  ignoreNonObservationFieldValidations = () => {},
  label,
  resetNonObservationFieldValidations = () => {},
  testId = undefined,
  unit = undefined,
  validationMessages = [],
  validationType = undefined,
  renderItemWithinInput = undefined,
  renderItemAboveInput = undefined,
  isInputDisabled = false,
  showHelperText = false,
  ...restOfProps
}) => {
  const textFieldRef = useRef()

  useStopInputScrollingIncrementNumber(textFieldRef)

  return (
    <InputRow required={required} validationType={validationType} data-testid={testId}>
      <InputNoRowWithLabelAndValidation
        required={required}
        helperText={helperText}
        showHelperText={showHelperText}
        id={id}
        isInputDisabled={isInputDisabled}
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        label={label}
        renderItemAboveInput={renderItemAboveInput}
        renderItemWithinInput={renderItemWithinInput}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        testId={testId}
        unit={unit}
        validationMessages={validationMessages}
        validationType={validationType}
        {...restOfProps}
      />
    </InputRow>
  )
}

InputWithLabelAndValidation.propTypes = {
  required: PropTypes.bool,
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  showHelperText: PropTypes.bool,
  id: PropTypes.string.isRequired,
  isInputDisabled: PropTypes.bool,
  ignoreNonObservationFieldValidations: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  renderItemAboveInput: PropTypes.node,
  renderItemWithinInput: PropTypes.node,
  resetNonObservationFieldValidations: PropTypes.func,
  testId: PropTypes.string,
  unit: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

export default InputWithLabelAndValidation
