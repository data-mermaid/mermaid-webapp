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

const F6Form = ({ formik, handleInputBlur, getFieldValueTotal }) => {
  return (
    <StyledGfcrInputWrapper>
      <InputRow>
        <label>
          <b>F 7.1</b> {gfcrIndicatorSetLanguage.getF7_1()}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.men}
            id="f7_1a"
            type="number"
            {...formik.getFieldProps('f7_1a')}
            onBlur={(event) => handleInputBlur(formik, event, 'f7_1a')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.men_helper}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.women}
            id="f7_1b"
            type="number"
            {...formik.getFieldProps('f7_1b')}
            onBlur={(event) => handleInputBlur(formik, event, 'f7_1b')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.women_helper}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<b>{gfcrIndicatorSetLanguage.total}</b>}
            id="f7_1_total"
            type="number"
            value={getFieldValueTotal(formik.values.f7_1a, formik.values.f7_1b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.youth}
            id="f7_1c"
            type="number"
            {...formik.getFieldProps('f7_1c')}
            onBlur={(event) => handleInputBlur(formik, event, 'f7_1c')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.youth_helper}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.indigenous}
            id="f7_1d"
            type="number"
            {...formik.getFieldProps('f7_1d')}
            onBlur={(event) => handleInputBlur(formik, event, 'f7_1d')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.indigenous_helper}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputRow>
        <label>
          <b>F 7.2</b> {gfcrIndicatorSetLanguage.getF7_2()}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.men}
            id="f7_2a"
            type="number"
            {...formik.getFieldProps('f7_2a')}
            onBlur={(event) => handleInputBlur(formik, event, 'f7_2a')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.men_helper}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.women}
            id="f7_2b"
            type="number"
            {...formik.getFieldProps('f7_2b')}
            onBlur={(event) => handleInputBlur(formik, event, 'f7_2b')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.women_helper}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<b>{gfcrIndicatorSetLanguage.total}</b>}
            id="f7_2_total"
            type="number"
            value={getFieldValueTotal(formik.values.f7_2a, formik.values.f7_2b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.youth}
            id="f7_2c"
            type="number"
            {...formik.getFieldProps('f7_2c')}
            onBlur={(event) => handleInputBlur(formik, event, 'f7_2c')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.youth_helper}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.indigenous}
            id="f7_2d"
            type="number"
            {...formik.getFieldProps('f7_2d')}
            onBlur={(event) => handleInputBlur(formik, event, 'f7_2d')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.indigenous_helper}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 7.3</b> {gfcrIndicatorSetLanguage.f7_3}
          </>
        }
        id="f7_3"
        type="number"
        {...formik.getFieldProps('f7_3')}
        onBlur={(event) => handleInputBlur(formik, event, 'f7_3')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f7_3_helper}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 7.4</b> {gfcrIndicatorSetLanguage.f7_4}
          </>
        }
        id="f7_4"
        type="number"
        {...formik.getFieldProps('f7_4')}
        onBlur={(event) => handleInputBlur(formik, event, 'f7_4')}
        onKeyDown={(event) => enforceNumberInput(event)}
        helperText={gfcrIndicatorSetLanguage.f7_4_helper}
      />
      <TextareaWithLabelAndValidation
        id="f7_notes"
        label={gfcrIndicatorSetLanguage.notes}
        {...formik.getFieldProps('f7_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F6Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
}

export default F6Form
