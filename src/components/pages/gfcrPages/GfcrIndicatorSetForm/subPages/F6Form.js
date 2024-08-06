import React from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import { InputRow } from '../../../../generic/form'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import { H2 } from '../../../../generic/text'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F6Form = ({ formik, displayHelp, handleInputBlur, handleInputFocus, getFieldValueTotal }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f6Heading}</H2>
      <InputRow>
        <label>
          <strong>F 6.1</strong> {gfcrIndicatorSetLanguage.f6_1}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            id="f6_1a"
            type="number"
            {...formik.getFieldProps('f6_1a')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_1a')}
            onFocus={(event) => handleInputFocus(event)}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.getF6_1_men_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            id="f6_1b"
            type="number"
            {...formik.getFieldProps('f6_1b')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_1b')}
            onFocus={(event) => handleInputFocus(event)}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.getF6_1_women_helper()}
            showHelperText={displayHelp}
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
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            id="f6_1c"
            type="number"
            {...formik.getFieldProps('f6_1c')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_1c')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.getF6_1_youth_helper()}
            showHelperText={displayHelp}
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
            helperText={gfcrIndicatorSetLanguage.getF6_1_indigenous_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputRow>
        <label>
          <b>F 6.2</b> {gfcrIndicatorSetLanguage.f6_2}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            id="f6_2a"
            type="number"
            {...formik.getFieldProps('f6_2a')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_2a')}
            onFocus={(event) => handleInputFocus(event)}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.getF6_2_men_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            id="f6_2b"
            type="number"
            {...formik.getFieldProps('f6_2b')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_2b')}
            onFocus={(event) => handleInputFocus(event)}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.getF6_2_women_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<b>{gfcrIndicatorSetLanguage.total}</b>}
            id="f6_2_total"
            type="number"
            value={getFieldValueTotal(formik.values.f6_2a, formik.values.f6_2b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{gfcrIndicatorSetLanguage.ofTotalHowMany}</div>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            id="f6_2c"
            type="number"
            {...formik.getFieldProps('f6_2c')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_2c')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.getF6_2_youth_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            id="f6_2d"
            type="number"
            {...formik.getFieldProps('f6_2d')}
            onBlur={(event) => handleInputBlur(formik, event, 'f6_2d')}
            onKeyDown={(event) => enforceNumberInput(event)}
            helperText={gfcrIndicatorSetLanguage.getF6_2_indigenous_helper()}
            showHelperText={displayHelp}
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
  handleInputBlur: PropTypes.func.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.string,
}

export default F6Form
