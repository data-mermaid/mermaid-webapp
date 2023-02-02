import PropTypes from 'prop-types'
import React from 'react'
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
  padding: 0.2em 0.5em;
  margin: 0;
  font-size: ${theme.typography.defaultFontSize};
`

const InnerInput = styled(InputNumberNoScroll)`
  border: none;
  height: auto;
  padding: ${theme.spacing.xsmall};
`

const InputNumberNoScrollWithUnit = ({ unit, ...restOfProps }) => {
  return (
    <InputContainer>
      <InnerInput {...restOfProps} />
      <UnitContainer>{unit}</UnitContainer>
    </InputContainer>
  )
}

InputNumberNoScrollWithUnit.propTypes = { unit: PropTypes.string.isRequired }

export default InputNumberNoScrollWithUnit
