import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  Input,
  InputContainer,
  HelperText,
  LabelContainer,
  RequiredIndicator,
} from '../../generic/form'
import { useStopInputScrollingIncrementNumber } from '../../../library/useStopInputScrollingIncrementNumber'
import InputNumberNoScrollWithUnit from '../../generic/InputNumberNoScrollWithUnit'

import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import { IconButton } from '../../generic/buttons'
import { IconInfo } from '../../icons'

const InputNoRowWithLabelAndValidation = ({
  required = false,
  helperText = undefined,
  id,
  ignoreNonObservationFieldValidations = () => {},
  label,
  resetNonObservationFieldValidations = () => {},
  unit = undefined,
  validationMessages = [],
  validationType = undefined,
  renderItemWithinInput = undefined,
  renderItemAboveInput = undefined,
  isInputDisabled = false,
  showHelperText = false,
  testId = undefined,
  ...restOfProps
}) => {
  const textFieldRef = useRef()

  useStopInputScrollingIncrementNumber(textFieldRef)

  const [internalShowHelperText, setInternalShowHelperText] = useState()

  useEffect(() => {
    setInternalShowHelperText(showHelperText)
  }, [showHelperText])

  const handleInfoIconClick = (event) => {
    setInternalShowHelperText(!internalShowHelperText)

    event.stopPropagation()
  }

  const inputTestId = testId ? `${testId}-input` : undefined

  const inputType = unit ? (
    <InputNumberNoScrollWithUnit
      aria-labelledby={`aria-label${id}`}
      aria-describedby={`aria-descp${id}`}
      id={id}
      data-testid={inputTestId}
      unit={unit}
      disabled={isInputDisabled}
      {...restOfProps}
    />
  ) : (
    <Input
      aria-labelledby={`aria-label${id}`}
      aria-describedby={`aria-descp${id}`}
      id={id}
      data-testid={inputTestId}
      {...restOfProps}
      ref={textFieldRef}
    />
  )

  return (
    <>
      <LabelContainer>
        <label id={`aria-label${id}`} htmlFor={id}>
          {label}
        </label>
        <span>{required ? <RequiredIndicator /> : null}</span>
        {helperText ? (
          <IconButton
            id={`gtm-help-icon-${id}`}
            type="button"
            onClick={(event) => handleInfoIconClick(event, label)}
          >
            <IconInfo aria-label="info" id={`gtm-help-icon-svg-${id}`} />
          </IconButton>
        ) : null}
      </LabelContainer>

      <div>
        {renderItemAboveInput || null}
        <InputContainer>
          {inputType}

          {renderItemWithinInput || null}
        </InputContainer>
        {internalShowHelperText ? (
          <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>
        ) : null}
      </div>

      <InputValidationInfo
        validationType={validationType}
        validationMessages={validationMessages}
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        testId={testId ? `${testId}-validation` : undefined}
      />
    </>
  )
}

InputNoRowWithLabelAndValidation.propTypes = {
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  testId: PropTypes.string,
}

export default InputNoRowWithLabelAndValidation
