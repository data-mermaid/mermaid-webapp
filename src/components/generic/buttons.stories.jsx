import React from 'react'

import {
  ButtonCallout,
  ButtonCaution,
  ButtonPrimary,
  ButtonSecondary,
  LinkLooksLikeButtonSecondary,
} from './buttons'

export default {
  title: 'Generic Buttons',
}

export const Basic = () => (
  <>
    <ButtonPrimary>Button Primary</ButtonPrimary>
    <ButtonSecondary>Button Secondary</ButtonSecondary>
    <ButtonCallout>Button Callout</ButtonCallout>
    <ButtonCaution>Button Caution</ButtonCaution>
    <LinkLooksLikeButtonSecondary>
      Link that looks like Button Secondary
    </LinkLooksLikeButtonSecondary>
    <p>Disabled buttons:</p>
    <ButtonPrimary disabled>Button Primary</ButtonPrimary>
    <ButtonSecondary disabled>Button Secondary</ButtonSecondary>
    <ButtonCallout disabled>Button Callout</ButtonCallout>
    <ButtonCaution disabled>Button Caution</ButtonCaution>
  </>
)
