import PropTypes from 'prop-types'
import React from 'react'
import { styled } from 'styled-components'

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

const InputNumberNoScrollWithUnit = ({ unit = '', alignUnitsLeft = false, ...restOfProps }) => {
  return (
    <InputContainer>
      {alignUnitsLeft && <UnitContainer>{unit}</UnitContainer>}
      <InnerInput {...restOfProps} />
      {!alignUnitsLeft && <UnitContainer>{unit}</UnitContainer>}
    </InputContainer>
  )
}

InputNumberNoScrollWithUnit.propTypes = {
  unit: PropTypes.string.isRequired,
  alignUnitsLeft: PropTypes.bool,
}

export default InputNumberNoScrollWithUnit
