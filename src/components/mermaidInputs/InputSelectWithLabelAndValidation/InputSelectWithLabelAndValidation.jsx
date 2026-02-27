import React from 'react'
import PropTypes from 'prop-types'
import { InputRow } from '../../generic/form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import InputNoRowSelectWithLabelAndValidation from '../InputNoRowSelectWithLabelAndValidation'

const InputSelectWithLabelAndValidation = ({
  label,
  id,
  required,
  options,
  helperText = undefined,
  validationMessages = [],
  ignoreNonObservationFieldValidations = () => {},
  resetNonObservationFieldValidations = () => {},
  validationType = undefined,
  testId = undefined,
  value = '',
  updateValueAndResetValidationForDuplicateWarning = () => {},
  displayViewLink = false,
  showHelperText = false,
  ...restOfProps
}) => {
  return (
    <InputRow $validationType={validationType} data-testid={testId}>
      <InputNoRowSelectWithLabelAndValidation
        label={label}
        id={id}
        required={required}
        options={options}
        helperText={helperText}
        validationMessages={validationMessages}
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        validationType={validationType}
        testId={testId}
        value={value}
        updateValueAndResetValidationForDuplicateWarning={
          updateValueAndResetValidationForDuplicateWarning
        }
        displayViewLink={displayViewLink}
        showHelperText={showHelperText}
        {...restOfProps}
      />
    </InputRow>
  )
}

InputSelectWithLabelAndValidation.propTypes = {
  displayViewLink: PropTypes.bool,
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
  showHelperText: PropTypes.bool,
}

export default InputSelectWithLabelAndValidation
