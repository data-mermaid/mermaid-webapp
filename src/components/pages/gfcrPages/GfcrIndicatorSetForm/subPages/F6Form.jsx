import React from 'react'
import PropTypes from 'prop-types'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../../../language'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrIntegerInputField from '../GfcrIntegerInputField'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F6Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f6Heading}</H2>
      <InputRow>
        <label>
          <strong>F 6.1</strong> {gfcrIndicatorSetLanguage.f6_1}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1a"
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            helperText={gfcrIndicatorSetLanguage.getF6_1_men_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1b"
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            helperText={gfcrIndicatorSetLanguage.getF6_1_women_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{gfcrIndicatorSetLanguage.total}</strong>}
            id="f6_1_total"
            type="number"
            value={getFieldValueTotal(formik.values.f6_1a, formik.values.f6_1b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1c"
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            helperText={gfcrIndicatorSetLanguage.getF6_1_youth_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1d"
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            helperText={gfcrIndicatorSetLanguage.getF6_1_indigenous_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <TextareaWithLabelAndValidation
        id="f6_notes"
        label={gfcrIndicatorSetLanguage.notes}
        {...formik.getFieldProps('f6_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F6Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F6Form
