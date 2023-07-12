import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { IconContainer, InputRow, Select, HelperText, RequiredIndicator } from '../../generic/form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'

import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import { IconInfo } from '../../icons'

const LabelContainer = styled.div`
  display: flex !important;
  flex-direction: row;
`

const InputSelectWithLabelAndValidation = ({
  label,
  id,
  required,
  options,
  helperText,
  validationMessages,
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationType,
  testId,
  value,
  updateValueAndResetValidationForDuplicateWarning,
  ...restOfProps
}) => {
  const optionList = options.map((item) => (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  ))

  return (
    <InputRow validationType={validationType} data-testid={testId}>
      <LabelContainer>
        <div>
          <label id={`aria-label${id}`} htmlFor={id}>
            {label}
          </label>
        </div>
        <IconContainer>
          <IconInfo aria-label="info" />
        </IconContainer>
        <div>{required ? <RequiredIndicator /> : null}</div>
      </LabelContainer>

      <div>
        <Select
          aria-labelledby={`aria-label${id}`}
          aria-describedby={`aria-descp${id}`}
          id={id}
          value={value}
          {...restOfProps}
        >
          <option value="">Choose...</option>
          {optionList}
        </Select>
        {helperText && <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>}
      </div>
      <InputValidationInfo
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        validationMessages={validationMessages}
        validationType={validationType}
        currentSelectValue={value}
        updateValueAndResetValidationForDuplicateWarning={
          updateValueAndResetValidationForDuplicateWarning
        }
      />
    </InputRow>
  )
}

InputSelectWithLabelAndValidation.propTypes = {
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func,
  label: PropTypes.string.isRequired,
  options: inputOptionsPropTypes.isRequired,
  resetNonObservationFieldValidations: PropTypes.func,
  testId: PropTypes.string,
  value: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
  updateValueAndResetValidationForDuplicateWarning: PropTypes.func,
}

InputSelectWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessages: [],
  helperText: undefined,
  testId: undefined,
  value: '',
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  updateValueAndResetValidationForDuplicateWarning: () => {},
}
export default InputSelectWithLabelAndValidation
