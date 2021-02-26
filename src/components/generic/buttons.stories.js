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
    {/* sometimes your stoy needs supportive positionaing and spacing.
    You can do that however you want */}
    <br />
    <br />
    <ButtonSecondary>Button Secondary</ButtonSecondary>
    <br />
    <br />
    <ButtonCallout>Button Callout</ButtonCallout>
    <br />
    <br />
    <ButtonCaution>Button Caution</ButtonCaution>
    <br />
    <br />
    etc etc
  </>
)
