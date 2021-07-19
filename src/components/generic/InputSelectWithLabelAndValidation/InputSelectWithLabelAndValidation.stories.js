import { action } from '@storybook/addon-actions'
import React from 'react'

import InputSelectWithLabelAndValidation from '.'

export default {
  title: 'InputSelectWithLabelAndValidation',
  component: InputSelectWithLabelAndValidation,
}

const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 'two' },
]

export const basic = () => (
  <>
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id1"
      label="No warnings or errors"
      options={options}
    />
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id2"
      label="With warning"
      validationType="warning"
      options={options}
    />
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id3"
      label="With error and a reallylonglonglonglonglongword word word in the label"
      helperText="Here's a message to help you with this select input"
      validationType="error"
      options={options}
    />
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id4"
      label="With warning"
      validationType="warning"
      validationMessage="Validation message"
      options={options}
    />
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id5"
      label="With error"
      validationType="error"
      validationMessage="This one has got a real real ohwowlookhowlongthiswordiswhatsgoingtohappen real long validation message."
      options={options}
    />
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id6"
      label="With validation message, but a non-supported (or no) validation type"
      validationType="rainbow"
      validationMessage="Validation message"
      options={options}
    />
  </>
)
