import React from 'react'
import PropTypes from 'prop-types'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../../../language'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrDecimalInputField from '../GfcrDecimalInputField'
import GfcrIntegerInputField from '../GfcrIntegerInputField'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F3Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f3Heading}</H2>
      <GfcrDecimalInputField
        id="f3_1"
        label={
          <>
            <strong>F 3.1</strong> {gfcrIndicatorSetLanguage.f3_1}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={gfcrIndicatorSetLanguage.getF3_1_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f3_2"
        label={
          <>
            <strong>F 3.2</strong> {gfcrIndicatorSetLanguage.f3_2}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF3_2_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f3_3"
        label={
          <>
            <strong>F 3.3</strong> {gfcrIndicatorSetLanguage.f3_3}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF3_3_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f3_4"
        label={
          <>
            <strong>F 3.4</strong> {gfcrIndicatorSetLanguage.f3_4}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF3_4_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <InputRow>
        <label>
          <strong>F 3.5</strong> {gfcrIndicatorSetLanguage.f3_5}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f3_5a"
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            helperText={gfcrIndicatorSetLanguage.getF3_5_men_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f3_5b"
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            helperText={gfcrIndicatorSetLanguage.getF3_5_women_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{gfcrIndicatorSetLanguage.total}</strong>}
            id="f3_5total"
            type="number"
            value={getFieldValueTotal(formik.values.f3_5a, formik.values.f3_5b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f3_5c"
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            helperText={gfcrIndicatorSetLanguage.getF3_5_youth_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f3_5d"
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            helperText={gfcrIndicatorSetLanguage.getF3_5_indigenous_helper()}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <GfcrIntegerInputField
        id="f3_6"
        label={
          <>
            <strong>F 3.6</strong> {gfcrIndicatorSetLanguage.f3_6}
          </>
        }
        helperText={gfcrIndicatorSetLanguage.getF3_6_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
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
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F3Form
