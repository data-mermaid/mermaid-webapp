import React from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper } from './subPages.styles'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F2Form = ({ formik, handleInputBlur }) => {
  return (
    <StyledGfcrInputWrapper>
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.1a</b> {gfcrIndicatorSetLanguage.getF2_1a()}
          </>
        }
        id="f2_1a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_1a')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_1a')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_1a_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.1b</b> {gfcrIndicatorSetLanguage.getF2_1b()}
          </>
        }
        id="f2_1b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_1b')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_1b')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_1b_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.2a</b> {gfcrIndicatorSetLanguage.getF2_2a()}
          </>
        }
        id="f2_2a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_2a')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_2a')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_2a_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.2b</b> {gfcrIndicatorSetLanguage.getF2_2b()}
          </>
        }
        id="f2_2b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_2b')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_2b')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_2b_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.3a</b> {gfcrIndicatorSetLanguage.getF2_3a()}
          </>
        }
        id="f2_3a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_3a')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_3a')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_3a_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.3b</b> {gfcrIndicatorSetLanguage.getF2_3b()}
          </>
        }
        id="f2_3b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_3b')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_3b')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_3b_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.4</b> {gfcrIndicatorSetLanguage.f2_4}
          </>
        }
        id="f2_4"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_4')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_4')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_4_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 2.Opt1</b> {gfcrIndicatorSetLanguage.f2_opt1}
          </>
        }
        id="f2_opt1"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_opt1')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_opt1')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_opt1_helper}
      />
      <TextareaWithLabelAndValidation
        id="f2_notes"
        label={gfcrIndicatorSetLanguage.notes}
        {...formik.getFieldProps('f2_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F2Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
}

export default F2Form
