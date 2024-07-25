import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getProjectIdFromLocation } from '../../../library/getProjectIdFromLocation'
import {
  IconContainer,
  Select,
  HelperText,
  InputContainer,
  LabelContainer,
  RequiredIndicator,
} from '../../generic/form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import { IconButton } from '../../generic/buttons'
import { ViewLink } from '../../generic/links'
import { IconInfo, IconSites, IconMgmt } from '../../icons'
import language from '../../../language'

const InputNoRowSelectWithLabelAndValidation = ({
  label,
  id,
  required,
  options,
  helperText = undefined,
  validationMessages = [],
  ignoreNonObservationFieldValidations = () => {},
  resetNonObservationFieldValidations = () => {},
  validationType = undefined,
  value = '',
  updateValueAndResetValidationForDuplicateWarning = () => {},
  displayViewLink = false,
  showHelperText = false,
  ...restOfProps
}) => {
  const [internalShowHelperText, setInternalShowHelperText] = useState()

  useEffect(() => {
    setInternalShowHelperText(showHelperText)
  }, [showHelperText])

  const location = useLocation()

  const projectId = getProjectIdFromLocation(location)

  const optionList = options.map((item) => (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  ))

  const handleInfoIconClick = (event) => {
    setInternalShowHelperText(!internalShowHelperText)

    event.stopPropagation()
  }

  const linkToSiteOrMR = `/projects/${projectId}/${
    label === 'Site' ? 'sites' : 'management-regimes'
  }/${value}`

  return (
    <>
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
        <InputContainer>
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
            <ViewLink disabled={!value} href={linkToSiteOrMR}>
              <IconContainer>{label === 'Site' ? <IconSites /> : <IconMgmt />}</IconContainer>
              {language.pages.collectRecord.viewLink}
            </ViewLink>
          ) : null}
        </InputContainer>
        {showHelperText || internalShowHelperText ? (
          <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>
        ) : null}
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
    </>
  )
}

InputNoRowSelectWithLabelAndValidation.propTypes = {
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

export default InputNoRowSelectWithLabelAndValidation
