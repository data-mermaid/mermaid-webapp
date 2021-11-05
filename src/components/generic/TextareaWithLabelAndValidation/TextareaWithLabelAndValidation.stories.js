import React from 'react'

import TextareaWithLabelAndValidation from '.'

export default {
  title: 'TextareaWithLabelAndValidation',
  component: TextareaWithLabelAndValidation,
}
export const basic = () => (
  <>
    <TextareaWithLabelAndValidation id="id2" label="No warnings or errors" />
    <TextareaWithLabelAndValidation id="id2" label="With warning" validationType="warning" />
    <TextareaWithLabelAndValidation id="id3" label="With error" validationType="error" />
    <TextareaWithLabelAndValidation
      id="id4"
      label="With warning"
      validationType="warning"
      validationMessage="Validation message"
    />
    <TextareaWithLabelAndValidation
      id="id5"
      label="With error"
      validationType="error"
      validationMessage="Validation message"
    />
    <TextareaWithLabelAndValidation
      id="id6"
      label="With validation message, but a non-supported (or no) validation type"
      validationType="rainbow"
      validationMessage="Validation message"
    />
  </>
)
