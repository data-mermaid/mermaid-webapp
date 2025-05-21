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

const F5Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f5Heading}</H2>
      <GfcrIntegerInputField
        id="f5_1"
        label={
          <>
            <strong>F 5.1</strong> {gfcrIndicatorSetLanguage.getF5_1()}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF5_1_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f5_2"
        label={
          <>
            <strong>F 5.2</strong> {gfcrIndicatorSetLanguage.getF5_2()}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF5_2_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f5_3"
        label={
          <>
            <strong>F 5.3</strong> {gfcrIndicatorSetLanguage.f5_3}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF5_3_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <InputRow>
        <label>
          <strong>F 5.4</strong> {gfcrIndicatorSetLanguage.f5_4}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f5_4a"
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            helperText={gfcrIndicatorSetLanguage.getF5_4_men_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f5_4b"
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            helperText={gfcrIndicatorSetLanguage.getF5_4_women_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{gfcrIndicatorSetLanguage.total}</strong>}
            id="f5_4_total"
            type="number"
            value={getFieldValueTotal(formik.values.f5_4a, formik.values.f5_4b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f5_4c"
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            helperText={gfcrIndicatorSetLanguage.getF5_4_youth_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f5_4d"
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            helperText={gfcrIndicatorSetLanguage.getF5_4_indigenous_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <GfcrIntegerInputField
        id="f5_5"
        label={
          <>
            <strong>F 5.5</strong> {gfcrIndicatorSetLanguage.f5_5}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF5_5_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f5_6"
        label={
          <>
            <strong>F 5.6</strong> {gfcrIndicatorSetLanguage.f5_6}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF5_6_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <TextareaWithLabelAndValidation
        id="f5_notes"
        label={gfcrIndicatorSetLanguage.notes}
        {...formik.getFieldProps('f5_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F5Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F5Form
