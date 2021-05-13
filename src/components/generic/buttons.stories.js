import styled from 'styled-components/macro'
import React from 'react'
import {
  ButtonCallout,
  ButtonCaution,
  ButtonPrimary,
  ButtonSecondary,
} from './buttons'

export const ButtonWrapper = styled.div`
  p,
  button {
    margin: 10px;
    display: block;
  }
`
export default {
  title: 'Generic Buttons',
}
export const basic = () => (
  <>
    <ButtonWrapper>
      <ButtonPrimary>Button Primary</ButtonPrimary>
      <ButtonSecondary>Button Secondary</ButtonSecondary>
      <ButtonCallout>Button Callout</ButtonCallout>
      <ButtonCaution>Button Caution</ButtonCaution>
      <p>Disabled buttons:</p>
      <ButtonPrimary disabled>Button Primary</ButtonPrimary>
      <ButtonSecondary disabled>Button Secondary</ButtonSecondary>
      <ButtonCallout disabled>Button Callout</ButtonCallout>
      <ButtonCaution disabled>Button Caution</ButtonCaution>
    </ButtonWrapper>
  </>
)
