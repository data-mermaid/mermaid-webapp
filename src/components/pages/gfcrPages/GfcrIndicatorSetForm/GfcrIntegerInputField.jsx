import React from 'react'
import PropTypes from 'prop-types'
import {
  formikHandleGfcrNumberInputChange,
  formikHandleIntegerInputOnBlur,
} from '../../../../library/formik/formikHandleInputTypes'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import InputNoRowWithLabelAndValidation from '../../../mermaidInputs/InputNoRowWithLabelAndValidation'

const GfcrIntegerInputField = ({
  id,
  label,
  helperText = '',
  displayHelp = false,
  handleInputFocus = () => {},
  formik,
  required = false,
  noRow = false,
}) => {
  const handleBlur = (event) => {
    formikHandleIntegerInputOnBlur({
      formik,
      event,
      fieldName: id,
    })
  }

  const handleChange = (event) => {
    formikHandleGfcrNumberInputChange({
      formik,
      event,
      fieldName: id,
    })
  }

  const InputComponent = noRow ? InputNoRowWithLabelAndValidation : InputWithLabelAndValidation

  return (
    <InputComponent
      label={label}
      id={id}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      helperText={helperText}
      showHelperText={displayHelp}
      required={required}
      {...(noRow ? {} : { $textAlign: 'right' })}
      {...formik.getFieldProps(id)}
      onBlur={handleBlur}
      onFocus={handleInputFocus}
      onChange={handleChange}
    />
  )
}

GfcrIntegerInputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  displayHelp: PropTypes.bool,
  helperText: PropTypes.node,
  handleInputFocus: PropTypes.func,
  formik: PropTypes.object.isRequired,
  required: PropTypes.bool,
  noRow: PropTypes.bool,
}

export default GfcrIntegerInputField
