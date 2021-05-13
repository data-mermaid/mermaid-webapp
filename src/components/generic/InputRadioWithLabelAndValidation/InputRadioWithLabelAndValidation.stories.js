import { action } from '@storybook/addon-actions'
import React from 'react'

import InputRadioWithLabelAndValidation from '.'

export default {
  title: 'InputRadioWithLabelAndValidation',
  component: InputRadioWithLabelAndValidation,
}

const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 'two' },
]

// this thing doesn't work yet
export const basic = () => (
  <InputRadioWithLabelAndValidation
    id="id1"
    label="No warnings or errors"
    options={options}
  />
)
