import { action } from '@storybook/addon-actions'

import React from 'react'

import TextareaWithLabelAndValidation from '.'

export default {
  title: 'TextareaWithLabelAndValidation',
  component: TextareaWithLabelAndValidation,
}
export const basic = () => (
  <>
    <TextareaWithLabelAndValidation
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id2"
      label="No warnings or errors"
    />
    <TextareaWithLabelAndValidation
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id2"
      label="With warning"
      validationType="warning"
    />
    <TextareaWithLabelAndValidation
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id3"
      label="With error"
      validationType="error"
    />
    <TextareaWithLabelAndValidation
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
    />
    <TextareaWithLabelAndValidation
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
    />
    <TextareaWithLabelAndValidation
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
    />
    <TextareaWithLabelAndValidation
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
    />
  </>
)
