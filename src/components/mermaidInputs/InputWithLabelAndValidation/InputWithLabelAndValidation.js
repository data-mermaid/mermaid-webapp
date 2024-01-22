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
import language from '../../../language'
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
  addSyncCheckbox,
  handleSyncIntervalChange,

  ...restOfProps
}) => {
  const textFieldRef = useRef()

  useStopInputScrollingIncrementNumber(textFieldRef)

  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [isSyncItemChecked, setIsSyncItemChecked] = useState(false)

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
      disabled={isSyncItemChecked}
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

  const handleSyncChange = (checked) => {
    setIsSyncItemChecked(checked)
    handleSyncIntervalChange(checked)
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
        {addSyncCheckbox ? (
          <CheckBoxLabel>
            <input
              id="interval-sync-toggle"
              type="checkbox"
              checked={isSyncItemChecked}
              onChange={(event) => handleSyncChange(event.target.checked)}
            />
            {language.pages.collectRecord.benthicPitSyncCheckbox}
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
  addSyncCheckbox: PropTypes.bool,
  required: PropTypes.bool,
  handleSyncIntervalChange: PropTypes.func,
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
  addSyncCheckbox: false,
  required: false,
  helperText: undefined,
  handleSyncIntervalChange: () => {},
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  testId: undefined,
  unit: undefined,
  validationMessages: [],
  validationType: undefined,
}

export default InputWithLabelAndValidation
