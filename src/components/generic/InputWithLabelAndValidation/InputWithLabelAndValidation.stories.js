import React from 'react'

import InputWithLabelAndValidation from '.'

export default {
  title: 'InputWithLabelAndValidation',
  component: InputWithLabelAndValidation,
}
export const basic = () => (
  <>
    <InputWithLabelAndValidation id="id" label="No warnings or errors" />
    <br /> <br />
    <InputWithLabelAndValidation
      id="id"
      label="With warning"
      validationType="warning"
    />
    <br /> <br />
    <InputWithLabelAndValidation
      id="id"
      label="With error"
      validationType="error"
    />
    <br /> <br />
    <InputWithLabelAndValidation
      id="id"
      label="With warning"
      validationType="warning"
      validationMessage="Validation message"
    />
    <br /> <br />
    <InputWithLabelAndValidation
      id="id"
      label="With error"
      validationType="error"
      validationMessage="Validation message"
    />
    <br /> <br />
    <InputWithLabelAndValidation
      id="id"
      label="With validation message, but a non-supported (or no) validation type"
      validationType="rainbow"
      validationMessage="Validation message"
    />
  </>
)
