import React from 'react'
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonCallout,
} from '../generic/buttons'
import { IconCheck } from '../icons'

const FishBeltFormButtonStage = {
  saving: 3,
  saved: 5,
  validating: 10,
  validated: 15,
  submitting: 20,
  submitted: 25,
}

const StagedButton = ({ buttonState, handleButtonChange }) => {
  const savedState = (
    <ButtonCallout onClick={handleButtonChange}>
      <IconCheck />
      Validate
    </ButtonCallout>
  )

  const validatingState = (
    <ButtonPrimary disabled>
      <IconCheck />
      Validating
    </ButtonPrimary>
  )

  const validatedState = (
    <ButtonSecondary disabled>
      <IconCheck />
      Validated
    </ButtonSecondary>
  )

  const validateButton = () => {
    switch (buttonState) {
      case FishBeltFormButtonStage.validating:
        return validatingState
      case FishBeltFormButtonStage.validated:
        return validatedState
      default:
        return savedState
    }
  }

  return <>{validateButton()}</>
}

export default StagedButton
