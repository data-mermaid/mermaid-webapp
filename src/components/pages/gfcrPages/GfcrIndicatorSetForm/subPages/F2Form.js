import React from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper } from './subPages.styles'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import { H2 } from '../../../../generic/text'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F2Form = ({ formik, handleInputBlur, handleInputFocus }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f2Heading}</H2>
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.1a</strong> {gfcrIndicatorSetLanguage.getF2_1a()}
          </>
        }
        id="f2_1a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_1a')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_1a')}
        onFocus={(event) => handleInputFocus(event)}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_1a_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.1b</strong> {gfcrIndicatorSetLanguage.getF2_1b()}
          </>
        }
        id="f2_1b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_1b')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_1b')}
        onFocus={(event) => handleInputFocus(event)}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_1b_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.2a</strong> {gfcrIndicatorSetLanguage.getF2_2a()}
          </>
        }
        id="f2_2a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_2a')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_2a')}
        onFocus={(event) => handleInputFocus(event)}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_2a_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.2b</strong> {gfcrIndicatorSetLanguage.getF2_2b()}
          </>
        }
        id="f2_2b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_2b')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_2b')}
        onFocus={(event) => handleInputFocus(event)}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_2b_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.3a</strong> {gfcrIndicatorSetLanguage.getF2_3a()}
          </>
        }
        id="f2_3a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_3a')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_3a')}
        onFocus={(event) => handleInputFocus(event)}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_3a_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.3b</strong> {gfcrIndicatorSetLanguage.getF2_3b()}
          </>
        }
        id="f2_3b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_3b')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_3b')}
        onFocus={(event) => handleInputFocus(event)}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_3b_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.4</strong> {gfcrIndicatorSetLanguage.f2_4}
          </>
        }
        id="f2_4"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_4')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_4')}
        onFocus={(event) => handleInputFocus(event)}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f2_4_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.Opt1</strong> {gfcrIndicatorSetLanguage.f2_opt1}
          </>
        }
        id="f2_opt1"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_opt1')}
        onBlur={(event) => handleInputBlur(formik, event, 'f2_opt1')}
        onFocus={(event) => handleInputFocus(event)}
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
  handleInputFocus: PropTypes.func.isRequired,
}

export default F2Form
