import PropTypes from 'prop-types'
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

const InputValidationAlert = ({ warningValidations, errorValidations }) => {
  const warningAlerts = warningValidations.map((message) => (
    <WarningText key={message}>{message}</WarningText>
  ))
  const errorAlerts = errorValidations.map((message) => (
    <ErrorText key={message}>{message}</ErrorText>
  ))

  return (
    <AlertContainer>
      {warningAlerts}
      {errorAlerts}
    </AlertContainer>
  )
}

InputValidationAlert.propTypes = {
  warningValidations: PropTypes.arrayOf(PropTypes.string).isRequired,
  errorValidations: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default InputValidationAlert
