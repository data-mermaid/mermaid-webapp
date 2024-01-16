import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getProjectIdFromLocation } from '../../../library/getProjectIdFromLocation'
import {
  IconContainer,
  InputRow,
  Select,
  HelperText,
  InputLinkContainer,
  LabelContainer,
  RequiredIndicator,
} from '../../generic/form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import { IconButton, ViewLink } from '../../generic/buttons'
import { IconInfo, IconSites, IconMgmt } from '../../icons'
import language from '../../../language'

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
  displayViewLink,
  ...restOfProps
}) => {
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const projectId = getProjectIdFromLocation(location)

  const optionList = options.map((item) => (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  ))

  const handleInfoIconClick = (event) => {
    isHelperTextShowing ? setIsHelperTextShowing(false) : setIsHelperTextShowing(true)

    event.stopPropagation()
  }

  const handleViewLinkClick = (event, linkType, linkValue) => {
    event.stopPropagation()
    let navLink

    if (linkType === 'Site') {
      navLink = `/projects/${projectId}/sites/${linkValue}`

      navigate(navLink)
    } else if (linkType === 'Management') {
      navLink = `/projects/${projectId}/management-regimes/${linkValue}`

      navigate(navLink)
    }

    return
  }

  return (
    <InputRow validationType={validationType} data-testid={testId}>
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
        <InputLinkContainer>
          <Select
            aria-labelledby={`aria-label${id}`}
            aria-describedby={`aria-descp${id}`}
            id={id}
            value={value}
            {...restOfProps}
          >
            <option value="">{language.placeholders.select}</option>
            {optionList}
          </Select>
          {displayViewLink ? (
            <ViewLink
              type="button"
              disabled={!value}
              onClick={(event) => handleViewLinkClick(event, label, value)}
            >
              <IconContainer>{label === 'Site' ? <IconSites /> : <IconMgmt />}</IconContainer>
              {language.pages.collectRecord.viewLink}
            </ViewLink>
          ) : null}
        </InputLinkContainer>
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
  displayViewLink: false,
}
export default InputSelectWithLabelAndValidation
