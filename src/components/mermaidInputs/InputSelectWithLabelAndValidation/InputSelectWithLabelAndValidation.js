import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { InputRow, Select, HelperText, LabelContainer, RequiredIndicator } from '../../generic/form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import { IconButton } from '../../generic/buttons'
import { IconInfo } from '../../icons'

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
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)

  const optionList = options.map((item) => (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  ))

  const handleInfoIconClick = (event) => {
    isHelperTextShowing ? setIsHelperTextShowing(false) : setIsHelperTextShowing(true)

    event.stopPropagation()
  }

  return (
    <InputRow validationType={validationType} data-testid={testId}>
      <LabelContainer>
        <div>
          <label id={`aria-label${id}`} htmlFor={id}>
            {label}
          </label>
        </div>
        {helperText ? (
          <IconButton type="button" onClick={(event) => handleInfoIconClick(event, label)}>
            <IconInfo aria-label="info" />
          </IconButton>
        ) : null}
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
        {isHelperTextShowing ? <HelperText id={`aria-descp${id}`}>{helperText}</HelperText> : null}
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
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
