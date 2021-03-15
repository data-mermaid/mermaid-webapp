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
      id="id"
      label="No warnings or errors"
      options={options}
    />
    <br /> <br />
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id"
      label="With warning"
      validationType="warning"
      options={options}
    />
    <br /> <br />
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id"
      label="With error"
      validationType="error"
      options={options}
    />
    <br /> <br />
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id"
      label="With warning"
      validationType="warning"
      validationMessage="Validation message"
      options={options}
    />
    <br /> <br />
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id"
      label="With error"
      validationType="error"
      validationMessage="Validation message"
      options={options}
    />
    <br /> <br />
    <InputSelectWithLabelAndValidation
      onChange={action('Select Option Change')}
      id="id"
      label="With validation message, but a non-supported (or no) validation type"
      validationType="rainbow"
      validationMessage="Validation message"
      options={options}
    />
  </>
)
