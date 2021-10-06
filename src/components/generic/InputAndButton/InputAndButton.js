import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { inputStyles } from '../form'
import { ButtonSecondary } from '../buttons'

const InputAndButtonWrapper = styled.div`
  display: flex;
  > input {
    ${inputStyles};
    width: 100%;
  }
`

const AddUserButton = styled(ButtonSecondary)`
  white-space: nowrap;
`

const InputAndButton = ({
  buttonChildren,
  buttonOnClick,
  buttonType,
  inputId,
  labelText,
  ...restOfProps
}) => {
  const {
    placeholder: _wontBeUsedPlaceholder,
    ...textPropsWithoutPlaceholder
  } = restOfProps

  return (
    <div>
      <label htmlFor={inputId}>{labelText}</label>
      <InputAndButtonWrapper>
        <input {...textPropsWithoutPlaceholder} id={inputId} type="text" />
        <AddUserButton type={buttonType} onClick={buttonOnClick}>
          {buttonChildren}
        </AddUserButton>
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
}
InputAndButton.defaultProps = { buttonType: 'button' }

export default InputAndButton
