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

export const basic = () => (
  <Formik
    initialValues={{
      test1: 'three',
      test2: '',
      test3: 'one',
      test4: 'two',
      test5: 'thee',
      test6: 'four',
    }}
  >
    {(formik) => (
      <>
        <InputRadioWithLabelAndValidation
          {...formik.getFieldProps('test1')}
          id="id1"
          label="No warnings or errors"
          options={options}
        />
        <InputRadioWithLabelAndValidation
          {...formik.getFieldProps('test2')}
          id="id2"
          label="With warning"
          validationType="warning"
          options={options}
        />
        <InputRadioWithLabelAndValidation
          {...formik.getFieldProps('test3')}
          id="id3"
          label="With error and a really long word in the label"
          validationType="error"
          options={options}
        />
        <InputRadioWithLabelAndValidation
          {...formik.getFieldProps('test4')}
          id="id4"
          label="With warning"
          validationType="warning"
          validationMessage="Validation message"
          options={options}
        />
        <InputRadioWithLabelAndValidation
          {...formik.getFieldProps('test5')}
          id="id5"
          label="With error"
          validationType="error"
          validationMessage="This one has got a real real ohwowlookhowlongthiswordiswhatsgoingtohappen real long validation message."
          options={options}
        />
        <InputRadioWithLabelAndValidation
          {...formik.getFieldProps('test6')}
          id="id6"
          label="With validation message, but a non-supported (or no) validation type"
          validationType="rainbow"
          validationMessage="Validation message"
          options={options}
        />
      </>
    )}
  </Formik>
)
