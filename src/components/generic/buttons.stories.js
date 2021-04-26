import React from 'react'
import {
  ButtonCallout,
  ButtonCaution,
  ButtonPrimary,
  ButtonSecondary,
} from './buttons'

export default {
  title: 'Generic Buttons',
}
export const basic = () => (
  <>
    <ButtonPrimary>Button Primary</ButtonPrimary>
    <br />
    <ButtonSecondary>Button Secondary</ButtonSecondary>
    <br />
    <ButtonCallout>Button Callout</ButtonCallout>
    <br />
    <ButtonCaution>Button Caution</ButtonCaution>
    <br />
    <br />
    Disabled buttons:
    <br />
    <ButtonPrimary disabled>Button Primary</ButtonPrimary>
    <br />
    <ButtonSecondary disabled>Button Secondary</ButtonSecondary>
    <br />
    <ButtonCallout disabled>Button Callout</ButtonCallout>
    <br />
    <ButtonCaution disabled>Button Caution</ButtonCaution>
  </>
)
