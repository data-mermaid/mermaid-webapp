import React from 'react'
import PropTypes from 'prop-types'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import InputNoRowWithLabelAndValidation from '../../../mermaidInputs/InputNoRowWithLabelAndValidation'
import GfcrNumberInput from '../../../generic/GfcrNumberInput/GfcrNumberInput'
import { parseGfcrNumber } from '../../../../library/numbers/parseGfcrNumber'

const GfcrIntegerInputField = ({
  id,
  label,
  maxValue,
  helperText = '',
  displayHelp = false,
  handleInputFocus = () => {},
  formik,
  required = false,
  noRow = false,
}) => {
  const numericValue = parseGfcrNumber(formik.values[id])

  const handleBlur = (event) => {
    // Every GFCR integer field is NOT NULL with a database default of 0, so an emptied
    // field has to settle on 0. Sending null gets rejected with "This field may not be null."
    if (numericValue === null) {
      formik.setFieldValue(id, 0)
    }

    formik.handleBlur(event)
  }

  const InputComponent = noRow ? InputNoRowWithLabelAndValidation : InputWithLabelAndValidation

  return (
    <InputComponent
      label={label}
      id={id}
      helperText={helperText}
      showHelperText={displayHelp}
      required={required}
      renderInput={
        <GfcrNumberInput
          id={id}
          aria-labelledby={`aria-label${id}`}
          aria-describedby={`aria-descp${id}`}
          value={numericValue}
          onChange={(val) => formik.setFieldValue(id, val)}
          onBlur={handleBlur}
          onFocus={handleInputFocus}
          decimalPlaces={0}
          min={0}
          max={maxValue}
        />
      }
    />
  )
}

GfcrIntegerInputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  maxValue: PropTypes.number.isRequired,
  displayHelp: PropTypes.bool,
  helperText: PropTypes.node,
  handleInputFocus: PropTypes.func,
  formik: PropTypes.object.isRequired,
  required: PropTypes.bool,
  noRow: PropTypes.bool,
}

export default GfcrIntegerInputField
