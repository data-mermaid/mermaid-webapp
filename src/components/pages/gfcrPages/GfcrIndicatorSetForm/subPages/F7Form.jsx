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

const F7Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f7Heading}</H2>
      <InputRow>
        <label>
          <strong>F 7.1</strong> {gfcrIndicatorSetLanguage.getF7_1()}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_1a"
            label={gfcrIndicatorSetLanguage.men}
            helperText={gfcrIndicatorSetLanguage.getF7_1_men_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_1b"
            label={gfcrIndicatorSetLanguage.women}
            helperText={gfcrIndicatorSetLanguage.getF7_1_women_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{gfcrIndicatorSetLanguage.total}</strong>}
            id="f7_1_total"
            type="number"
            value={getFieldValueTotal(formik.values.f7_1a, formik.values.f7_1b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_1c"
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            helperText={gfcrIndicatorSetLanguage.getF7_1_youth_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_1d"
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            helperText={gfcrIndicatorSetLanguage.getF7_1_indigenous_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputRow>
        <label>
          <strong>F 7.2</strong> {gfcrIndicatorSetLanguage.getF7_2()}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_2a"
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            helperText={gfcrIndicatorSetLanguage.getF7_2_men_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_2b"
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            helperText={gfcrIndicatorSetLanguage.getF7_2_women_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{gfcrIndicatorSetLanguage.total}</strong>}
            id="f7_2_total"
            type="number"
            value={getFieldValueTotal(formik.values.f7_2a, formik.values.f7_2b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_2c"
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            helperText={gfcrIndicatorSetLanguage.getF7_2_youth_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_2d"
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            helperText={gfcrIndicatorSetLanguage.getF7_2_indigenous_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <GfcrIntegerInputField
        id="f7_3"
        label={
          <>
            <strong>F 7.3</strong> {gfcrIndicatorSetLanguage.f7_3}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF7_3_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f7_4"
        label={
          <>
            <strong>F 7.4</strong> {gfcrIndicatorSetLanguage.f7_4}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF7_4_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <TextareaWithLabelAndValidation
        id="f7_notes"
        label={gfcrIndicatorSetLanguage.notes}
        {...formik.getFieldProps('f7_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F7Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F7Form
