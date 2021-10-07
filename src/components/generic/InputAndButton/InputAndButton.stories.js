import React from 'react'
import { action } from '@storybook/addon-actions'

import { IconBell } from '../../icons'
import InputAndButton from './InputAndButton'

export default {
  title: 'InputAndButton',
  component: InputAndButton,
}

export const basic = () => (
  <InputAndButton
    buttonChildren={
      <>
        <IconBell /> Click Me
      </>
    }
    buttonOnClick={action('Button Clicked')}
    buttonType="button"
    placeholder="I shouldn't show up as a placeholder or anywhere"
    labelText="Some label"
    inputId="123"
  />
)
