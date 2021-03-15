import React from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'
import { Grid } from '../positioning'
import { WarningFormText } from '../text'

const MermaidInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const { name } = props

  return (
    <Grid validation={meta.touched && meta.error}>
      <label htmlFor={name}>{label}</label>
      <input className="text-number-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <WarningFormText> {meta.error}</WarningFormText>
      ) : null}
    </Grid>
  )
}

MermaidInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default MermaidInput
