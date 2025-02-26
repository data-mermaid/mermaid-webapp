import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../../theme'
import { inputStyles, Input } from '../form'
import { ButtonSecondary } from '../buttons'

const InputAndButtonWrapper = styled.div`
  display: flex;
  > input {
    ${inputStyles};
    width: 100%;
    border-color: ${theme.color.border};
    &:focus {
      outline-offset: -3px;
    }
  }
`

const InputButton = styled(ButtonSecondary)`
  white-space: nowrap;
  border-color: ${theme.color.border};
  border-left-width: 0;
  ${inputStyles};
`

const InputAndButton = ({
  buttonChildren,
  buttonOnClick,
  buttonType = 'button',
  inputId,
  isLoading,
  labelText,
  ...restOfProps
}) => {
  const { placeholder: _wontBeUsedPlaceholder, ...textPropsWithoutPlaceholder } = restOfProps

  return (
    <div>
      <label htmlFor={inputId}>{labelText}</label>
      <InputAndButtonWrapper>
        <Input {...textPropsWithoutPlaceholder} id={inputId} type="text" />
        <InputButton type={buttonType} onClick={buttonOnClick} disabled={isLoading}>
          {buttonChildren}
        </InputButton>
      </InputAndButtonWrapper>
    </div>
  )
}

InputAndButton.propTypes = {
  buttonChildren: PropTypes.node.isRequired,
  buttonOnClick: PropTypes.func.isRequired,
  buttonType: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default InputAndButton
