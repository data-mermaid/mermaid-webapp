import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components/macro'

import { inputTextareaSelectStyles } from '../form'
import theme from '../../../theme'
import InputNumberNoScroll from '../InputNumberNoScroll/InputNumberNoScroll'

const InputContainer = styled.div`
  ${inputTextareaSelectStyles}
  display: flex;
  justify-content: space-between;
  padding: 0;
`

const UnitContainer = styled.span`
  width: auto;
  white-space: nowrap;
  background: ${theme.color.unitBackground};
  padding: 0 0.5em;
  margin: 0;
  font-size: ${theme.typography.defaultFontSize};
`

const InnerInput = styled(InputNumberNoScroll)`
  border: none;
  height: auto;
  padding: ${theme.spacing.xsmall};
`

const InputNumberNoScrollWithUnit = ({
  unit = '',
  alignUnitsLeft = false,
  value = '',
  onChange = () => {},
  name = '',
  ...restOfProps
}) => {
  const [inputValue, setInputValue] = useState(value || '')

  const handleInputChange = (e) => {
    let rawValue = e.target.value

    if (unit === 'USD $') {
      rawValue = rawValue.replace(/[^0-9.]/g, '')

      // Restrict to a valid decimal format: up to two decimal places
      if (rawValue.includes('.')) {
        const [integerPart, decimalPart] = rawValue.split('.')
        if (decimalPart.length > 2) {
          rawValue = `${integerPart}.${decimalPart.slice(0, 2)}`
        }
      }
    }

    setInputValue(rawValue)

    if (onChange) {
      onChange({ ...e, target: { ...e.target, value: rawValue, name } })
    }
  }

  return (
    <InputContainer>
      {alignUnitsLeft && <UnitContainer>{unit}</UnitContainer>}
      <InnerInput {...restOfProps} value={inputValue} onChange={handleInputChange} />
      {!alignUnitsLeft && <UnitContainer>{unit}</UnitContainer>}
    </InputContainer>
  )
}

InputNumberNoScrollWithUnit.propTypes = {
  unit: PropTypes.string.isRequired,
  alignUnitsLeft: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  name: PropTypes.string,
}

export default InputNumberNoScrollWithUnit
