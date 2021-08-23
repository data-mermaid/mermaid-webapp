import React from 'react'
import styled from 'styled-components/macro'

const AlertContainer = styled.div`
  padding-bottom: 20px;
`

const WarningText = styled.div`
  color: orange;
`
const ErrorText = styled.div`
  color: red;
`

const InputValidationAlert = () => {
  const warningValidations = ['validation warning 1', 'validation warning 2']
  const errorValidations = ['validation warning 1', 'validation warning 2']

  const warningAlerts = warningValidations.map((warning) => (
    <WarningText>{warning}</WarningText>
  ))
  const errorAlerts = errorValidations.map((warning) => (
    <ErrorText>{warning}</ErrorText>
  ))

  return (
    <AlertContainer>
      {warningAlerts}
      {errorAlerts}
    </AlertContainer>
  )
}

export default InputValidationAlert
