import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../../theme'

import {
  Input,
  InputRow,
  InputTextareaSelectStyles,
  ValidationMessage,
} from '../form'
import { useNoInputScrolling } from '../../../library/useNoInputScrolling'

const InputNumberWithUnit = styled.div`
  ${InputTextareaSelectStyles}
  display: flex;
  justify-content: space-between;
  padding: 0;
`

const InnerInput = styled(Input)`
  border: none;
  padding: ${theme.spacing.xsmall};
  flex-grow: 1;
`

const UnitContainer = styled.span`
  width: 32px;
  background: #eeeeee;
  padding: ${theme.spacing.xsmall};
`

const InputWithLabelAndValidation = ({
  label,
  id,
  validationMessage,
  validationType,
  ...restOfProps
}) => {
  const { unit } = restOfProps
  const textFieldRef = useRef()

  useNoInputScrolling(textFieldRef)

  const inputType = unit ? (
    <InputNumberWithUnit>
      <InnerInput id={id} {...restOfProps} ref={textFieldRef} />
      <UnitContainer>ha</UnitContainer>
    </InputNumberWithUnit>
  ) : (
    <Input id={id} {...restOfProps} ref={textFieldRef} />
  )

  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      {inputType}
      <div>
        {validationMessage ? (
          <ValidationMessage validationType={validationType}>
            {validationMessage}
          </ValidationMessage>
        ) : null}
      </div>
    </InputRow>
  )
}

InputWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validationType: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
}

export default InputWithLabelAndValidation
