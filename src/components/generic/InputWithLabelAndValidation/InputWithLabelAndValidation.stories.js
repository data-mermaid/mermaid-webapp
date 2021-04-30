import React from 'react'

import InputWithLabelAndValidation from '.'

export default {
  title: 'InputWithLabelAndValidation',
  component: InputWithLabelAndValidation,
}
export const basic = () => (
  <>
    <InputWithLabelAndValidation id="id2" label="No warnings or errors" />
    <InputWithLabelAndValidation
      id="id2"
      label="With warning"
      validationType="warning"
    />
    <InputWithLabelAndValidation
      id="id3"
      label="With error"
      validationType="error"
    />
    <InputWithLabelAndValidation
      id="id4"
      label="With warning"
      validationType="warning"
      validationMessage="Validation message"
    />
    <InputWithLabelAndValidation
      id="id5"
      label="With error"
      validationType="error"
      validationMessage="Validation message"
    />
    <InputWithLabelAndValidation
      id="id6"
      label="With validation message, but a non-supported (or no) validation type"
      validationType="rainbow"
      validationMessage="Validation message"
    />
  </>
)
