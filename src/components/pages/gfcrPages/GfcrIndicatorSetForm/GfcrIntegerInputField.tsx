import React from 'react'
import type { FormikProps } from 'formik'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import InputNoRowWithLabelAndValidation from '../../../mermaidInputs/InputNoRowWithLabelAndValidation'
import LocaleNumberInput from '../../../mermaidInputs/LocaleNumberInput/LocaleNumberInput'
import { parseApiNumber } from '../../../../library/numbers/parseApiNumber'

interface GfcrIntegerInputFieldProps {
  id: string
  label: React.ReactNode
  maxValue: number
  helperText?: React.ReactNode
  displayHelp?: boolean
  handleInputFocus?: React.FocusEventHandler<HTMLInputElement>
  formik: FormikProps<Record<string, string | number | null>>
  required?: boolean
  noRow?: boolean
}

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
}: GfcrIntegerInputFieldProps) => {
  const numericValue = parseApiNumber(formik.values[id])

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
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
      renderInput={(inputProps) => (
        <LocaleNumberInput
          {...inputProps}
          value={numericValue}
          onChange={(val) => formik.setFieldValue(id, val)}
          onBlur={handleBlur}
          onFocus={handleInputFocus}
          decimalPlaces={0}
          min={0}
          max={maxValue}
        />
      )}
    />
  )
}

export default GfcrIntegerInputField
