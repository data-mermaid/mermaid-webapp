import React from 'react'
import PropTypes from 'prop-types'
import { formikPropType } from '../../../../library/formikPropType'
import { InputWrapper } from '../../../generic/form'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import styled from 'styled-components'
import language from '../../../../language'

const StyledYearInputWithLabelAndValidation = styled(InputWithLabelAndValidation)`
  width: 10rem;
`

const enforceNumberInput = (event) => {
  // Allow only numbers, special key presses, and copy paste shortcuts.
  const specialActionAndCharacterKeys = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Backspace',
    'Delete',
    '-',
    '.',
    'Tab',
  ]

  const isModifiersKeyPressed = event.metaKey || event.ctrlKey || event.shiftKey
  const isMovingAndSpecialCharactersKeyPressed = specialActionAndCharacterKeys.includes(event.key)
  const isNumbersKeyPressed =
    (event.keyCode >= 48 && event.keyCode <= 58) || (event.keyCode >= 96 && event.keyCode <= 105)

  return !(isModifiersKeyPressed || isMovingAndSpecialCharactersKeyPressed || isNumbersKeyPressed)
}

const handleInputBlur = (formik, event, fieldName) => {
  const { value } = event.target

  if (value.trim() === '') {
    setInputToDefaultValue(formik, fieldName)
  }
}

const setInputToDefaultValue = (formik, fieldName) => {
  formik.setFieldValue(fieldName, formik.initialValues[fieldName])
}

const GfcrIndicatorSetForm = ({ formik, selectedNavItem }) => {
  return (
    <form id="indicator-set-form" onSubmit={formik.handleSubmit}>
      {selectedNavItem === 'indicator-set' && (
        <InputWrapper>
          <InputWithLabelAndValidation
            required
            label="Title"
            id="gfcr-title"
            type="text"
            {...formik.getFieldProps('title')}
            validationType={formik.errors.title && formik.touched.title ? 'error' : null}
            validationMessages={formik.errors.title}
            helperText={'Example helper text'}
          />
          <InputWithLabelAndValidation
            label="Reporting Date"
            id="gfcr-report_date"
            type="date"
            {...formik.getFieldProps('report_date')}
            validationType={
              formik.errors.report_date && formik.touched.report_date ? 'error' : null
            }
            validationMessages={formik.errors.report_date}
            onBlur={(event) => handleInputBlur(formik, event, 'report_date')}
            value={formik.values.report_date}
          />
          <StyledYearInputWithLabelAndValidation
            required
            label="Reporting Year"
            id="gfcr-report-year"
            type="number"
            {...formik.getFieldProps('report_year')}
            validationType={
              formik.errors.report_year && formik.touched.report_year ? 'error' : null
            }
            validationMessages={formik.errors.report_year}
            onKeyDown={(event) => enforceNumberInput(event)}
            onBlur={(event) => {
              const { value } = event.target
              const trimmedValue = value.trim()

              if (
                trimmedValue === '' ||
                parseInt(trimmedValue) < 1900 ||
                parseInt(trimmedValue) > 2099
              ) {
                setInputToDefaultValue(formik, 'report_year')
              }
            }}
          />
        </InputWrapper>
      )}
      {selectedNavItem === 'f1' && <div>f1</div>}
      {selectedNavItem === 'f2' && <div>f2</div>}
    </form>
  )
}

GfcrIndicatorSetForm.propTypes = {
  formik: formikPropType.isRequired,
  selectedNavItem: PropTypes.string.isRequired,
}

export default GfcrIndicatorSetForm
