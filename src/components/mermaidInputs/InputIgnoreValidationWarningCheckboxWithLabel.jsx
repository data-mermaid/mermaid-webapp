import React from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'

const IgnoreWarningLabel = styled.label`
  white-space: nowrap;
  display: block;
  & input {
    vertical-align: middle;
    position: relative;
  }
`

const InputIgnoreValidationWarningCheckboxWithLabel = ({ onChange, checked }) => {
  const { t } = useTranslation()
  const ignoreWarningText = t('ignore_warning')

  return (
    <IgnoreWarningLabel>
      <input
        type="checkbox"
        onChange={onChange}
        checked={checked}
        aria-label={ignoreWarningText}
        data-testid="ignore-warning-checkbox"
      />
      {ignoreWarningText}
    </IgnoreWarningLabel>
  )
}

InputIgnoreValidationWarningCheckboxWithLabel.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  testId: PropTypes.string,
}

export default InputIgnoreValidationWarningCheckboxWithLabel
