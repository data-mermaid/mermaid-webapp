import { action } from '@storybook/addon-actions'
import React from 'react'

import InputRadioWithLabelAndValidation from '.'

export default {
  title: 'InputRadioWithLabelAndValidation',
  component: InputRadioWithLabelAndValidation,
}

const options = [
  { label: 'Option 1', value: 'one' },
  { label: 'Option 2', value: 'two' },
  { label: 'Option 3', value: 'three' },
  { label: 'Option 4', value: 'four' },
]

// this is improving, but the onChange doesn't work yet.
export const basic = () => (
  <>
    <InputRadioWithLabelAndValidation
      onChange={action('Radio Change')}
      id="id1"
      label="No warnings or errors"
      options={options}
    />
    <InputRadioWithLabelAndValidation
      onChange={action('Radio Change')}
      id="id2"
      label="With warning"
      validationType="warning"
      options={options}
    />
    <InputRadioWithLabelAndValidation
      onChange={action('Radio Change')}
      id="id3"
      label="With error and a really long word in the label"
      validationType="error"
      options={options}
    />
    <InputRadioWithLabelAndValidation
      onChange={action('Radio Change')}
      id="id4"
      label="With warning"
      validationType="warning"
      validationMessage="Validation message"
      options={options}
    />
    <InputRadioWithLabelAndValidation
      onChange={action('Radio Change')}
      id="id5"
      label="With error"
      validationType="error"
      validationMessage="This one has got a real real ohwowlookhowlongthiswordiswhatsgoingtohappen real long validation message."
      options={options}
    />
    <InputRadioWithLabelAndValidation
      onChange={action('Radio Change')}
      id="id6"
      label="With validation message, but a non-supported (or no) validation type"
      validationType="rainbow"
      validationMessage="Validation message"
      options={options}
    />
  </>
)
