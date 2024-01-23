import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Input, InputRow, HelperText, LabelContainer, RequiredIndicator } from '../../generic/form'
import { useStopInputScrollingIncrementNumber } from '../../../library/useStopInputScrollingIncrementNumber'
import InputNumberNoScrollWithUnit from '../../generic/InputNumberNoScrollWithUnit'

import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import { IconButton } from '../../generic/buttons'
import { IconInfo } from '../../icons'
import theme from '../../../theme'

const CheckBoxLabel = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.small};

  input {
    margin: 0 ${theme.spacing.small} 0 0;
    cursor: pointer;
  }
`

const InputWithLabelAndValidation = ({
  required,
  helperText,
  id,
  ignoreNonObservationFieldValidations,
  label,
  resetNonObservationFieldValidations,
  testId,
  unit,
  validationMessages,
  validationType,
  addCheckbox,
  handleCheckboxUpdate,
  checkboxLabel,

  ...restOfProps
}) => {
  const textFieldRef = useRef()

  useStopInputScrollingIncrementNumber(textFieldRef)

  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)

  const handleInfoIconClick = (event) => {
    isHelperTextShowing ? setIsHelperTextShowing(false) : setIsHelperTextShowing(true)

    event.stopPropagation()
  }

  const inputType = unit ? (
    <InputNumberNoScrollWithUnit
      aria-labelledby={`aria-label${id}`}
      aria-describedby={`aria-descp${id}`}
      id={id}
      unit={unit}
      disabled={isCheckboxChecked}
      {...restOfProps}
    />
  ) : (
    <Input
      aria-labelledby={`aria-label${id}`}
      aria-describedby={`aria-descp${id}`}
      id={id}
      {...restOfProps}
      ref={textFieldRef}
    />
  )

  // example use case is in Benthic Pit Transect Inputs for Interval Start
  const handleCheckboxChange = (checked) => {
    setIsCheckboxChecked(checked)
    handleCheckboxUpdate(checked)
  }

  return (
    <InputRow required={required} validationType={validationType} data-testid={testId}>
      <LabelContainer>
        <label id={`aria-label${id}`} htmlFor={id}>
          {label}
        </label>
        <span>{required ? <RequiredIndicator /> : null}</span>
        {helperText ? (
          <IconButton type="button" onClick={(event) => handleInfoIconClick(event, label)}>
            <IconInfo aria-label="info" />
          </IconButton>
        ) : null}
      </LabelContainer>

      <div>
        {addCheckbox ? (
          <CheckBoxLabel>
            <input
              id="checkbox-sync"
              type="checkbox"
              checked={isCheckboxChecked}
              onChange={(event) => handleCheckboxChange(event.target.checked)}
            />
            {checkboxLabel}
          </CheckBoxLabel>
        ) : null}
        {inputType}
        {isHelperTextShowing ? <HelperText id={`aria-descp${id}`}>{helperText}</HelperText> : null}
      </div>

      <InputValidationInfo
        validationType={validationType}
        validationMessages={validationMessages}
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
      />
    </InputRow>
  )
}

InputWithLabelAndValidation.propTypes = {
  addCheckbox: PropTypes.bool,
  checkboxLabel: PropTypes.string,
  required: PropTypes.bool,
  handleCheckboxUpdate: PropTypes.func,
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  id: PropTypes.string.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func,
  label: PropTypes.string.isRequired,
  resetNonObservationFieldValidations: PropTypes.func,
  testId: PropTypes.string,
  unit: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

InputWithLabelAndValidation.defaultProps = {
  addCheckbox: false,
  checkboxLabel: '',
  required: false,
  helperText: undefined,
  handleCheckboxUpdate: () => {},
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  testId: undefined,
  unit: undefined,
  validationMessages: [],
  validationType: undefined,
}

export default InputWithLabelAndValidation
