import React from 'react'
import type { FormikProps } from 'formik'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import GfcrNumberInput from '../../../generic/GfcrNumberInput/GfcrNumberInput'

interface GfcrDecimalInputFieldProps {
  id: string
  label: React.ReactNode
  unit?: string
  maxNumberOfDecimals?: number
  helperText?: React.ReactNode
  displayHelp?: boolean
  handleInputFocus?: React.FocusEventHandler<HTMLInputElement>
  formik: FormikProps<Record<string, string | number | null>>
}

const GfcrDecimalInputField = ({
  id,
  label,
  unit,
  maxNumberOfDecimals,
  helperText = '',
  displayHelp = false,
  handleInputFocus = () => {},
  formik,
}: GfcrDecimalInputFieldProps) => {
  const rawValue = formik.values[id]
  const numericValue: number | null =
    rawValue === null || rawValue === undefined || rawValue === ''
      ? null
      : typeof rawValue === 'number'
      ? rawValue
      : parseFloat(String(rawValue))

  return (
    <InputWithLabelAndValidation
      label={label}
      id={id}
      helperText={helperText}
      showHelperText={displayHelp}
      renderInput={
        <GfcrNumberInput
          id={id}
          value={numericValue}
          onChange={(val) => formik.setFieldValue(id, val)}
          onBlur={formik.handleBlur}
          onFocus={handleInputFocus}
          decimalPlaces={maxNumberOfDecimals}
          min={0}
          unit={unit}
        />
      }
    />
  )
}

export default GfcrDecimalInputField
