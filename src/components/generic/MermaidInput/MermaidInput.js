import React from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'

import { InputWithValidationRow } from '../form'
import { TextWarning } from '../text'
import { RowCenter } from '../positioning'

const MermaidInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const { name } = props

  return (
    <InputWithValidationRow validation={meta.touched && meta.error}>
      <label htmlFor={name}>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <RowCenter>
          <TextWarning> {meta.error}</TextWarning>
        </RowCenter>
      ) : null}
    </InputWithValidationRow>
  )
}

MermaidInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default MermaidInput
