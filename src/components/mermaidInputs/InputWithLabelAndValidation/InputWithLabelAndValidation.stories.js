import { action } from '@storybook/addon-actions'
import React from 'react'

import InputWithLabelAndValidation from '.'

export default {
  title: 'InputWithLabelAndValidation',
  component: InputWithLabelAndValidation,
}
export const basic = () => (
  <>
    <InputWithLabelAndValidation
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id2"
      label="No warnings or errors"
    />
    <InputWithLabelAndValidation
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="id2"
      label="With warning"
      validationType="warning"
    />
    <InputWithLabelAndValidation
      resetValidations={action('reset validations')}
      ignoreValidations={action('ignore validations')}
      id="myid"
      label="With error"
      validationType="error"
      helperText="this is some helper text right here"
    />
    <InputWithLabelAndValidation
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
    <InputWithLabelAndValidation
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
    <InputWithLabelAndValidation
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
    <InputWithLabelAndValidation
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
