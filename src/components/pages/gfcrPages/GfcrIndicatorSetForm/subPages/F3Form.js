import React from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import { InputRow } from '../../../../generic/form'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F3Form = ({ formik, handleInputBlur, getFieldValueTotal }) => {
  return (
    <StyledGfcrInputWrapper>
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 3.1</b> {gfcrIndicatorSetLanguage.f3_1}
          </>
        }
        id="f3_1"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f3_1')}
        onBlur={(event) => handleInputBlur(formik, event, 'f3_1')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f3_1_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 3.2</b> {gfcrIndicatorSetLanguage.f3_2}
          </>
        }
        id="f3_2"
        type="number"
        {...formik.getFieldProps('f3_2')}
        onBlur={(event) => handleInputBlur(formik, event, 'f3_2')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f3_2_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 3.3</b> {gfcrIndicatorSetLanguage.f3_3}
          </>
        }
        id="f3_3"
        type="number"
        {...formik.getFieldProps('f3_3')}
        onBlur={(event) => handleInputBlur(formik, event, 'f3_3')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f3_3_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 3.4</b> {gfcrIndicatorSetLanguage.f3_4}
          </>
        }
        id="f3_4"
        type="number"
        {...formik.getFieldProps('f3_4')}
        onBlur={(event) => handleInputBlur(formik, event, 'f3_4')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f3_4_helper}
      />
      <InputRow>
        <label>
          <b>F 3.5</b> {gfcrIndicatorSetLanguage.f3_5}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            id="f3_5"
            type="number"
            {...formik.getFieldProps('f3_5a')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5a')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.men_helper}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            id="f3_5b"
            type="number"
            {...formik.getFieldProps('f3_5b')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5b')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.women_helper}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<b>{gfcrIndicatorSetLanguage.total}</b>}
            id="f3_5total"
            type="number"
            value={getFieldValueTotal(formik.values.f3_5a, formik.values.f3_5b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            id="f3_5c"
            type="number"
            {...formik.getFieldProps('f3_5c')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5c')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.youth_helper}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            id="f3_5d"
            type="number"
            {...formik.getFieldProps('f3_5d')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5d')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.indigenous_helper}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 3.6</b> {gfcrIndicatorSetLanguage.f3_6}
          </>
        }
        id="f3_6"
        type="number"
        {...formik.getFieldProps('f3_6')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f3_6')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f3_6_helper}
      />
      <TextareaWithLabelAndValidation
        id="f3_notes"
        label={gfcrIndicatorSetLanguage.notes}
        {...formik.getFieldProps('f3_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F3Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
}

export default F3Form
