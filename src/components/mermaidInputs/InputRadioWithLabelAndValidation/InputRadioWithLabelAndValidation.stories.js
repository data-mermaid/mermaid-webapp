import { action } from '@storybook/addon-actions'
import { Formik } from 'formik'
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

// 'nothing' needs to be empty string, not null or undefined. This is because react complains when inputs change type.
const optionsWithNothing = [...options, { label: 'Nothing', value: '' }]

export const basic = () => (
  <Formik
    initialValues={{
      test1: 'three',
      test2: '',
      test3: 'one',
      test4: 'two',
      test5: 'thee',
      test5a: 'thee',
      test6: 'four',
    }}
  >
    {(formik) => (
      <>
        <InputRadioWithLabelAndValidation
          resetNonObservationFieldValidations={action('reset validations')}
          ignoreNonObservationFieldValidations={action('ignore validations')}
          {...formik.getFieldProps('test1')}
          id="id1"
          label="No warnings or errors"
          options={options}
        />

        <InputRadioWithLabelAndValidation
          resetNonObservationFieldValidations={action('reset validations')}
          ignoreNonObservationFieldValidations={action('ignore validations')}
          {...formik.getFieldProps('test2')}
          id="id2"
          label="Can select nothing"
          options={optionsWithNothing}
        />

        <InputRadioWithLabelAndValidation
          resetNonObservationFieldValidations={action('reset validations')}
          ignoreNonObservationFieldValidations={action('ignore validations')}
          {...formik.getFieldProps('test3')}
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
        <InputRadioWithLabelAndValidation
          resetNonObservationFieldValidations={action('reset validations')}
          ignoreNonObservationFieldValidations={action('ignore validations')}
          {...formik.getFieldProps('test4')}
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
        <InputRadioWithLabelAndValidation
          {...formik.getFieldProps('test5a')}
          resetNonObservationFieldValidations={action('reset validations')}
          ignoreNonObservationFieldValidations={action('ignore validations')}
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
        <InputRadioWithLabelAndValidation
          resetNonObservationFieldValidations={action('reset validations')}
          ignoreNonObservationFieldValidations={action('ignore validations')}
          {...formik.getFieldProps('test5')}
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
        <InputRadioWithLabelAndValidation
          resetNonObservationFieldValidations={action('reset validations')}
          ignoreNonObservationFieldValidations={action('ignore validations')}
          {...formik.getFieldProps('test6')}
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
    )}
  </Formik>
)
