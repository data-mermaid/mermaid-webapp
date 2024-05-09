import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subForms.styles'
import { InputRow } from '../../../../generic/form'

const StyledHowManyOfTotal = styled.div`
  width: 100%;
  text-align: right;
`

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F3Form = ({ formik, handleInputBlur }) => {
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
        helperText="Example helper text"
        onKeyDown={(event) => enforceNumberInput(event)}
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
        helperText="Example helper text"
        onKeyDown={(event) => enforceNumberInput(event)}
      />
      <InputRow>
        <label>
          <b>F 3.5</b> {gfcrIndicatorSetLanguage.f3_5}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.f3_5a}</>}
            id="f3_5a"
            type="number"
            {...formik.getFieldProps('f3_5a')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5a')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.f3_5b}</>}
            id="f3_5b"
            type="number"
            {...formik.getFieldProps('f3_5b')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5b')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<b>{gfcrIndicatorSetLanguage.f3_5_total}</b>}
            id="f3_5b"
            type="number"
            value={formik.values.f3_5a + formik.values.f3_5b}
          />
        </StyledGfcrSubInputWrapper>
        <StyledHowManyOfTotal>{gfcrIndicatorSetLanguage.f3_5_ofTotalHowMany}</StyledHowManyOfTotal>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.f3_5c}</>}
            id="f3_5c"
            type="number"
            {...formik.getFieldProps('f3_5c')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5c')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.f3_5d}</>}
            id="f3_5d"
            type="number"
            {...formik.getFieldProps('f3_5d')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5d')}
            onKeyDown={(event) => enforceNumberInput(event)}
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
      />
    </StyledGfcrInputWrapper>
  )
}

F3Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
}

export default F3Form
