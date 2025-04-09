import React from 'react'
import PropTypes from 'prop-types'

import {
  formikHandleIntegerInputChange,
  formikHandleNumericDecimalInputChange,
} from '../../../../../library/formikHandleInputTypes'
import { formikPropType } from '../../../../../library/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../../../language'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F3Form = ({ formik, displayHelp, handleInputBlur, handleInputFocus, getFieldValueTotal }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f3Heading}</H2>
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 3.1</strong> {gfcrIndicatorSetLanguage.f3_1}
          </>
        }
        id="f3_1"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f3_1')}
        onBlur={(event) => handleInputBlur(formik, event, 'f3_1')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericDecimalInputChange({
            formik,
            event,
            fieldName: 'f3_1',
            maxNumberOfDecimals: 5,
          })
        }
        helperText={gfcrIndicatorSetLanguage.getF3_1_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 3.2</strong> {gfcrIndicatorSetLanguage.f3_2}
          </>
        }
        id="f3_2"
        type="number"
        {...formik.getFieldProps('f3_2')}
        onBlur={(event) => handleInputBlur(formik, event, 'f3_2')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f3_2' })}
        helperText={gfcrIndicatorSetLanguage.getF3_2_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 3.3</strong> {gfcrIndicatorSetLanguage.f3_3}
          </>
        }
        id="f3_3"
        type="number"
        {...formik.getFieldProps('f3_3')}
        onBlur={(event) => handleInputBlur(formik, event, 'f3_3')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f3_3' })}
        helperText={gfcrIndicatorSetLanguage.getF3_3_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 3.4</strong> {gfcrIndicatorSetLanguage.f3_4}
          </>
        }
        id="f3_4"
        type="number"
        {...formik.getFieldProps('f3_4')}
        onBlur={(event) => handleInputBlur(formik, event, 'f3_4')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f3_4' })}
        helperText={gfcrIndicatorSetLanguage.getF3_4_helper()}
        showHelperText={displayHelp}
      />
      <InputRow>
        <label>
          <strong>F 3.5</strong> {gfcrIndicatorSetLanguage.f3_5}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            id="f3_5"
            type="number"
            {...formik.getFieldProps('f3_5a')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5a')}
            onFocus={(event) => handleInputFocus(event)}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f3_5a' })
            }
            helperText={gfcrIndicatorSetLanguage.getF3_5_men_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            id="f3_5b"
            type="number"
            {...formik.getFieldProps('f3_5b')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5b')}
            onFocus={(event) => handleInputFocus(event)}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f3_5b' })
            }
            helperText={gfcrIndicatorSetLanguage.getF3_5_women_helper()}
            showHelperText={displayHelp}
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
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            id="f3_5c"
            type="number"
            {...formik.getFieldProps('f3_5c')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5c')}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f3_5c' })
            }
            helperText={gfcrIndicatorSetLanguage.getF3_5_youth_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            id="f3_5d"
            type="number"
            {...formik.getFieldProps('f3_5d')}
            onBlur={(event) => handleInputBlur(formik, event, 'f3_5d')}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f3_5d' })
            }
            helperText={gfcrIndicatorSetLanguage.getF3_5_indigenous_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 3.6</strong> {gfcrIndicatorSetLanguage.f3_6}
          </>
        }
        id="f3_6"
        type="number"
        {...formik.getFieldProps('f3_6')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) => handleInputBlur(formik, event, 'f3_6')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f3_6' })}
        helperText={gfcrIndicatorSetLanguage.getF3_6_helper()}
        showHelperText={displayHelp}
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
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F3Form
