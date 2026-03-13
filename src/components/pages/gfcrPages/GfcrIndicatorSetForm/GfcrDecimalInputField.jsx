import React from 'react'
import PropTypes from 'prop-types'
import {
  formikHandleDecimalInputOnBlur,
  formikHandleGfcrNumberInputChange,
} from '../../../../library/formik/formikHandleInputTypes'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'

const GfcrDecimalInputField = ({
  id,
  label,
  unit,
  maxNumberOfDecimals,
  helperText = '',
  displayHelp = false,
  handleInputFocus = () => {},
  formik,
}) => {
  const handleBlur = (event) => {
    formikHandleDecimalInputOnBlur({
      formik,
      event,
      fieldName: id,
      maxNumberOfDecimals,
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
      $textAlign="right"
      inputMode="decimal"
      pattern="[0-9.]*"
      unit={unit}
      helperText={helperText}
      showHelperText={displayHelp}
      {...formik.getFieldProps(id)}
      onBlur={handleBlur}
      onFocus={handleInputFocus}
      onChange={handleChange}
    />
  )
}

GfcrDecimalInputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  unit: PropTypes.string,
  displayHelp: PropTypes.bool,
  helperText: PropTypes.node,
  maxNumberOfDecimals: PropTypes.number,
  handleInputFocus: PropTypes.func,
  formik: PropTypes.object.isRequired,
}

export default GfcrDecimalInputField
