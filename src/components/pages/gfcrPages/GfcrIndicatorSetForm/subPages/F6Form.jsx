import React from 'react'
import PropTypes from 'prop-types'

import { formikHandleIntegerInputChange } from '../../../../../library/formik/formikHandleInputTypes'
import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../../../language'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import { resetEmptyFormikFieldToInitialValue } from '../../../../../library/formik/resetEmptyFormikFieldToInitialValue'

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
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            id="f6_1a"
            type="number"
            {...formik.getFieldProps('f6_1a')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f6_1a' })
            }
            onFocus={(event) => handleInputFocus(event)}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f6_1a' })
            }
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
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f6_1b' })
            }
            onFocus={(event) => handleInputFocus(event)}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f6_1b' })
            }
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
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f6_1c' })
            }
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f6_1c' })
            }
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
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f6_1d' })
            }
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f6_1d' })
            }
            helperText={gfcrIndicatorSetLanguage.getF6_1_indigenous_helper()}
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
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F6Form
