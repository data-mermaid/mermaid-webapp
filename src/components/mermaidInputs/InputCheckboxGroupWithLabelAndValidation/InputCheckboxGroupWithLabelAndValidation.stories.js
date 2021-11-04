import { action } from '@storybook/addon-actions'
import React from 'react'

import InputCheckboxGroupWithLabelAndValidation from '.'

export default {
  title: 'InputCheckboxGroupWithLabelAndValidation',
  component: InputCheckboxGroupWithLabelAndValidation,
}

const options = [
  { label: 'Option 1', value: 'one' },
  { label: 'Option 2', value: 'two' },
  { label: 'Option 3', value: 'three' },
  { label: 'Option 4', value: 'four' },
]

export const basic = () => (
  <>
    <InputCheckboxGroupWithLabelAndValidation
      onChange={action('onChange')}
      value={['three', 'one']}
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id1"
      label="No warnings or errors"
      options={options}
    />

    <InputCheckboxGroupWithLabelAndValidation
      onChange={action('onChange')}
      value={['three', 'one']}
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id3"
      label="With error and a really long word fjkdsjfksdjfksjfksdjksdjfkljsdkfjskldfjksldjkl in the label"
      validationType="error"
      validationMessages={[
        { message: 'Validation message 1', id: 1 },
        { message: 'validation message 2', id: 2 },
        {
          message:
            'This one has got a real real ohwowlookhowlongthiswordiswhatsgoingtohappen real long validation message.',
          id: 3,
        },
      ]}
      options={options}
    />
    <InputCheckboxGroupWithLabelAndValidation
      onChange={action('onChange')}
      value={['three', 'one']}
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id4"
      label="With warning"
      validationType="warning"
      validationMessages={[
        { message: 'Validation message 1', id: 1 },
        { message: 'validation message 2', id: 2 },
        {
          message:
            'This one has got a real real ohwowlookhowlongthiswordiswhatsgoingtohappen real long validation message.',
          id: 3,
        },
      ]}
      options={options}
    />
    <InputCheckboxGroupWithLabelAndValidation
      onChange={action('onChange')}
      value={['three', 'one']}
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id5a"
      label="Ignored Validations"
      validationType="ignore"
      validationMessages={[
        { message: 'Validation message 1', id: 1 },
        { message: 'validation message 2', id: 2 },
        {
          message:
            'This one has got a real real ohwowlookhowlongthiswordiswhatsgoingtohappen real long validation message.',
          id: 3,
        },
      ]}
      options={options}
    />
    <InputCheckboxGroupWithLabelAndValidation
      onChange={action('onChange')}
      value={['three', 'one']}
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id5"
      label="With error"
      validationType="error"
      validationMessages={[
        { message: 'Validation message 1', id: 1 },
        { message: 'validation message 2', id: 2 },
        {
          message:
            'This one has got a real real ohwowlookhowlongthiswordiswhatsgoingtohappen real long validation message.',
          id: 3,
        },
      ]}
      options={options}
    />
    <InputCheckboxGroupWithLabelAndValidation
      onChange={action('onChange')}
      value={['three', 'one']}
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id6"
      label="With validation message, but a non-supported (or no) validation type"
      validationType="rainbow"
      validationMessages={[
        { message: 'Validation message 1', id: 1 },
        { message: 'validation message 2', id: 2 },
        {
          message:
            'This one has got a real real ohwowlookhowlongthiswordiswhatsgoingtohappen real long validation message.',
          id: 3,
        },
      ]}
      options={options}
    />
  </>
)
