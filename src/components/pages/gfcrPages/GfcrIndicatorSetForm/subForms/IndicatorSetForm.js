import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper } from './subForms.styles'

const StyledYearInputWithLabelAndValidation = styled(InputWithLabelAndValidation)`
  width: 10rem;
`

const IndicatorSetForm = ({ formik, handleInputBlur, setInputToDefaultValue }) => {
  return (
    <StyledGfcrInputWrapper>
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
        validationType={formik.errors.report_date && formik.touched.report_date ? 'error' : null}
        validationMessages={formik.errors.report_date}
        onBlur={(event) => handleInputBlur(formik, event, 'report_date')}
        value={formik.values.report_date}
      />
      <StyledYearInputWithLabelAndValidation
        label="Reporting Year"
        id="gfcr-report-year"
        type="number"
        {...formik.getFieldProps('report_year')}
        validationType={formik.errors.report_year && formik.touched.report_year ? 'error' : null}
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
    </StyledGfcrInputWrapper>
  )
}

IndicatorSetForm.propTypes = {
  formik: formikPropType.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
  setInputToDefaultValue: PropTypes.func.isRequired,
}

export default IndicatorSetForm
