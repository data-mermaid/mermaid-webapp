import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { inputTextareaSelectStyles } from '../form'
import theme from '../../../theme'
import InputNumberNoScroll from '../../InputNumberNoScroll/InputNumberNoScroll'

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
  padding: ${theme.spacing.xsmall};
  margin: 0 0 0 ${theme.spacing.borderMedium};
`

const InnerInput = styled(InputNumberNoScroll)`
  border: none;
  text-align: inherit;
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
