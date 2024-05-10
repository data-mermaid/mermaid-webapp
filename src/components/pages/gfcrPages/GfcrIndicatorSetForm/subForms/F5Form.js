import React from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subForms.styles'
import { InputRow } from '../../../../generic/form'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F5Form = ({ formik, handleInputBlur }) => {
  return (
    <StyledGfcrInputWrapper>
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 5.1</b> {gfcrIndicatorSetLanguage.f5_1}
          </>
        }
        id="f5_1"
        type="number"
        {...formik.getFieldProps('f5_1')}
        onBlur={(event) => handleInputBlur(formik, event, 'f5_1')}
        onKeyDown={(event) => enforceNumberInput(event)}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 5.2</b> {gfcrIndicatorSetLanguage.f5_2}
          </>
        }
        id="f5_2"
        type="number"
        {...formik.getFieldProps('f5_2')}
        onBlur={(event) => handleInputBlur(formik, event, 'f5_2')}
        onKeyDown={(event) => enforceNumberInput(event)}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 5.3</b> {gfcrIndicatorSetLanguage.f5_3}
          </>
        }
        id="f5_3"
        type="number"
        {...formik.getFieldProps('f5_3')}
        onBlur={(event) => handleInputBlur(formik, event, 'f5_3')}
        onKeyDown={(event) => enforceNumberInput(event)}
      />
      <InputRow>
        <label>
          <b>F 5.4</b> {gfcrIndicatorSetLanguage.f5_4}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            id="f5_4a"
            type="number"
            {...formik.getFieldProps('f5_4a')}
            onBlur={(event) => handleInputBlur(formik, event, 'f5_4a')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            id="f5_4b"
            type="number"
            {...formik.getFieldProps('f5_4b')}
            onBlur={(event) => handleInputBlur(formik, event, 'f5_4b')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<b>{gfcrIndicatorSetLanguage.total}</b>}
            id="f3_5_total"
            type="number"
            value={formik.values.f5_4a + formik.values.f5_4b}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            id="f5_4c"
            type="number"
            {...formik.getFieldProps('f5_4c')}
            onBlur={(event) => handleInputBlur(formik, event, 'f5_4c')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            id="f5_4d"
            type="number"
            {...formik.getFieldProps('f5_4d')}
            onBlur={(event) => handleInputBlur(formik, event, 'f5_4d')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 5.5</b> {gfcrIndicatorSetLanguage.f5_5}
          </>
        }
        id="f5_5"
        type="number"
        {...formik.getFieldProps('f5_5')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f5_5')}
        onKeyDown={(event) => enforceNumberInput(event)}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 5.5</b> {gfcrIndicatorSetLanguage.f5_6}
          </>
        }
        id="f5_6"
        type="number"
        {...formik.getFieldProps('f5_6')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f5_6')}
        onKeyDown={(event) => enforceNumberInput(event)}
      />
    </StyledGfcrInputWrapper>
  )
}

F5Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
}

export default F5Form
