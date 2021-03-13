import React from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'
import { TextWarning } from '../text'
import { InputWithValidationRow } from '../form'
import { RowCenter } from '../positioning'

const MermaidSelect = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const { name, options } = props

  const optionList = options.map((item) => (
    <option key={item.name} value={item.name}>
      {item.name}
    </option>
  ))

  return (
    <InputWithValidationRow validation={meta.touched && meta.error}>
      <label htmlFor={name}>{label}</label>
      <select {...field} {...props}>
        {optionList}
      </select>
      {meta.touched && meta.error ? (
        <RowCenter>
          <TextWarning> {meta.error}</TextWarning>
        </RowCenter>
      ) : null}
    </InputWithValidationRow>
  )
}

MermaidSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
}

export default MermaidSelect
