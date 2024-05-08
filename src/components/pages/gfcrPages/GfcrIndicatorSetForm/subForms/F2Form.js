import React from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper } from './subForms.styles'

const F2Form = ({ formik, handleInputBlur }) => {
  return (
    <StyledGfcrInputWrapper>
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.1a</b> {language.pages.gfcrIndicatorSet.f2_1a}
          </>
        }
        id="f2_1a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_1a')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_1a')}
        onKeyDown={(event) => enforceNumberInput(event)}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.1b</b> {language.pages.gfcrIndicatorSet.f2_1b}
          </>
        }
        id="f2_1b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_1b')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_1b')}
        onKeyDown={(event) => enforceNumberInput(event)}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.2a</b> {language.pages.gfcrIndicatorSet.f2_2a}
          </>
        }
        id="f2_2a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_2a')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_2a')}
        onKeyDown={(event) => enforceNumberInput(event)}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.2b</b> {language.pages.gfcrIndicatorSet.f2_2b}
          </>
        }
        id="f2_2b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_2b')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_2b')}
        onKeyDown={(event) => enforceNumberInput(event)}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.3a</b> {language.pages.gfcrIndicatorSet.f2_3a}
          </>
        }
        id="f2_3a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_3a')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_3a')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText="Example helper text"
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.3b</b> {language.pages.gfcrIndicatorSet.f2_3b}
          </>
        }
        id="f2_3b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_3b')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_3b')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText="Example helper text"
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.4</b> {language.pages.gfcrIndicatorSet.f2_4}
          </>
        }
        id="f2_4"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_4')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_4')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText="Example helper text"
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.Opt1</b> {language.pages.gfcrIndicatorSet.f2_opt1}
          </>
        }
        id="f2_opt1"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_opt1')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_opt1')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText="Example helper text"
      />
    </StyledGfcrInputWrapper>
  )
}

F2Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
}

export default F2Form
