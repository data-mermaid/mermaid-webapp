import React from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subForms.styles'
import { InputRow } from '../../../../generic/form'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F6Form = ({ formik, handleInputBlur }) => {
  return (
    <StyledGfcrInputWrapper>
      <InputRow>
        <label>
          <b>F 6.1</b> {gfcrIndicatorSetLanguage.f6_1}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            id="f6_1a"
            type="number"
            {...formik.getFieldProps('f6_1a')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_1a')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            id="f6_1b"
            type="number"
            {...formik.getFieldProps('f6_1b')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_1b')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<b>{gfcrIndicatorSetLanguage.total}</b>}
            id="f6_1_total"
            type="number"
            value={parseInt(formik.values.f6_1a + formik.values.f6_1b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            id="f6_1c"
            type="number"
            {...formik.getFieldProps('f6_1c')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_1c')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            id="f6_1d"
            type="number"
            {...formik.getFieldProps('f6_1d')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_1d')}
            onKeyDown={(event) => enforceNumberInput(event)}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
    </StyledGfcrInputWrapper>
  )
}

F6Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
}

export default F6Form
