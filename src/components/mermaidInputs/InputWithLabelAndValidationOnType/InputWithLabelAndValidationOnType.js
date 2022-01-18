import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../../theme'
import { useStopInputScrollingIncrementNumber } from '../../../library/useStopInputScrollingIncrementNumber'
import InputNumberNoScrollWithUnit from '../../generic/InputNumberNoScrollWithUnit'

import { InputRow, Input, HelperText } from '../../generic/form'
import InlineMessage from '../../generic/InlineMessage/InlineMessage'

const ValidationWrapper = styled('div')`
  padding-left: ${theme.spacing.small};
  display: flex;
  align-items: flex-start;
`

const InputWithLabelAndValidationOnType = ({
  helperText,
  id,
  label,
  testId,
  unit,
  formikValidationError,
  ...restOfProps
}) => {
  const textFieldRef = useRef()

  useStopInputScrollingIncrementNumber(textFieldRef)

  const inputType = unit ? (
    <InputNumberNoScrollWithUnit
      aria-labelledby={`aria-label${id}`}
      aria-describedby={`aria-descp${id}`}
      id={id}
      unit={unit}
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

  return (
    <InputRow validationType={formikValidationError && 'error'} data-testid={testId}>
      <label id={`aria-label${id}`} htmlFor={id}>
        {label}
      </label>
      <div>
        {inputType}
        {helperText && <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>}
      </div>
      <ValidationWrapper>
        {formikValidationError && (
          <InlineMessage type="error" key={formikValidationError}>
            <p>{formikValidationError}</p>
          </InlineMessage>
        )}
      </ValidationWrapper>
    </InputRow>
  )
}

InputWithLabelAndValidationOnType.propTypes = {
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  testId: PropTypes.string,
  unit: PropTypes.string,
  formikValidationError: PropTypes.string,
}

InputWithLabelAndValidationOnType.defaultProps = {
  helperText: undefined,
  testId: undefined,
  unit: undefined,
  formikValidationError: undefined,
}

export default InputWithLabelAndValidationOnType
