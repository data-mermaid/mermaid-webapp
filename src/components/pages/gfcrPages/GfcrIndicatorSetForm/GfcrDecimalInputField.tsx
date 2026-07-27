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
  let numericValue: number | null = null
  if (rawValue !== null && rawValue !== undefined && rawValue !== '') {
    const parsed = typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue))
    numericValue = Number.isNaN(parsed) ? null : parsed
  }

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
