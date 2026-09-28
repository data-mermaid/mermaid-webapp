import React from 'react'
import type { FormikProps } from 'formik'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import LocaleNumberInput from '../../../mermaidInputs/LocaleNumberInput/LocaleNumberInput'
import { parseApiNumber } from '../../../../library/numbers/parseApiNumber'

interface GfcrDecimalInputFieldProps {
  id: string
  label: React.ReactNode
  unit?: string
  maxNumberOfDecimals?: number
  maxValue?: number
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
  maxValue,
  helperText = '',
  displayHelp = false,
  handleInputFocus = () => {},
  formik,
}: GfcrDecimalInputFieldProps) => {
  const numericValue = parseApiNumber(formik.values[id])

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // Every GFCR indicator field is NOT NULL with a database default of 0, so an emptied
    // field has to settle on 0. Sending null gets rejected with "This field may not be null."
    if (numericValue === null) {
      formik.setFieldValue(id, 0)
    }

    formik.handleBlur(event)
  }

  return (
    <InputWithLabelAndValidation
      label={label}
      id={id}
      helperText={helperText}
      showHelperText={displayHelp}
      renderInput={
        <LocaleNumberInput
          id={id}
          aria-labelledby={`aria-label${id}`}
          aria-describedby={`aria-descp${id}`}
          value={numericValue}
          onChange={(val) => formik.setFieldValue(id, val)}
          onBlur={handleBlur}
          onFocus={handleInputFocus}
          decimalPlaces={maxNumberOfDecimals}
          min={0}
          max={maxValue}
          unit={unit}
        />
      }
    />
  )
}

export default GfcrDecimalInputField
