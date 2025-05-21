import React from 'react'
import PropTypes from 'prop-types'
import {
  formikHandleGfcrNumberInputChange,
  formikHandleIntegerInputOnBlur,
} from '../../../../library/formik/formikHandleInputTypes'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'

const GfcrIntegerInputField = ({
  id,
  label,
  helperText = '',
  displayHelp = false,
  handleInputFocus = () => {},
  formik,
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

  return (
    <InputWithLabelAndValidation
      label={label}
      id={id}
      type="text"
      inputMode="integer"
      pattern="[0-9]*"
      helperText={helperText}
      showHelperText={displayHelp}
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
}

export default GfcrIntegerInputField
