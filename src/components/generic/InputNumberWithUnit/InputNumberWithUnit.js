import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { InputTextareaSelectStyles } from '../form'
import theme from '../../../theme'
import InputNumberNoScroll from '../../InputNumberNoScroll/InputNumberNoScroll'

const InputContainer = styled.div`
  ${InputTextareaSelectStyles}
  display: flex;
  justify-content: space-between;
  padding: 0;
`

const UnitContainer = styled.span`
  width: 33px;
  background: magenta;
  padding: ${theme.spacing.xsmall};
`

const InnerInput = styled(InputNumberNoScroll)`
  width: 100%;
  border: none;
  padding: ${theme.spacing.xsmall};
`

const InputNumberWithUnit = ({ unit, ...restOfProps }) => {
  return (
    <InputContainer>
      <InnerInput {...restOfProps} />
      <UnitContainer>{unit}</UnitContainer>
    </InputContainer>
  )
}

InputNumberWithUnit.propTypes = { unit: PropTypes.string.isRequired }

export default InputNumberWithUnit
