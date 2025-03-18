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

const F5Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f5Heading}</H2>
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 5.1</strong> {gfcrIndicatorSetLanguage.getF5_1()}
          </>
        }
        id="f5_1"
        type="number"
        {...formik.getFieldProps('f5_1')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f5_1' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f5_1' })}
        helperText={gfcrIndicatorSetLanguage.getF5_1_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 5.2</strong> {gfcrIndicatorSetLanguage.getF5_2()}
          </>
        }
        id="f5_2"
        type="number"
        {...formik.getFieldProps('f5_2')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f5_2' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f5_2' })}
        helperText={gfcrIndicatorSetLanguage.getF5_2_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 5.3</strong> {gfcrIndicatorSetLanguage.f5_3}
          </>
        }
        id="f5_3"
        type="number"
        {...formik.getFieldProps('f5_3')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f5_3' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f5_3' })}
        helperText={gfcrIndicatorSetLanguage.getF5_3_helper()}
        showHelperText={displayHelp}
      />
      <InputRow>
        <label>
          <strong>F 5.4</strong> {gfcrIndicatorSetLanguage.f5_4}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.men}</>}
            id="f5_4a"
            type="number"
            {...formik.getFieldProps('f5_4a')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f5_4a' })
            }
            onFocus={(event) => handleInputFocus(event)}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f5_4a' })
            }
            helperText={gfcrIndicatorSetLanguage.getF5_4_men_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.women}</>}
            id="f5_4b"
            type="number"
            {...formik.getFieldProps('f5_4b')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f5_4b' })
            }
            onFocus={(event) => handleInputFocus(event)}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f5_4b' })
            }
            helperText={gfcrIndicatorSetLanguage.getF5_4_women_helper()}
            showHelperText={displayHelp}
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
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.youth}</>}
            id="f5_4c"
            type="number"
            {...formik.getFieldProps('f5_4c')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f5_4c' })
            }
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f5_4c' })
            }
            helperText={gfcrIndicatorSetLanguage.getF5_4_youth_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={<>{gfcrIndicatorSetLanguage.indigenous}</>}
            id="f5_4d"
            type="number"
            {...formik.getFieldProps('f5_4d')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f5_4d' })
            }
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f5_4d' })
            }
            helperText={gfcrIndicatorSetLanguage.getF5_4_indigenous_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 5.5</strong> {gfcrIndicatorSetLanguage.f5_5}
          </>
        }
        id="f5_5"
        type="number"
        {...formik.getFieldProps('f5_5')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f5_5' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f5_5' })}
        helperText={gfcrIndicatorSetLanguage.getF5_5_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 5.6</strong> {gfcrIndicatorSetLanguage.f5_6}
          </>
        }
        id="f5_6"
        type="number"
        {...formik.getFieldProps('f5_6')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f5_6' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f5_6' })}
        helperText={gfcrIndicatorSetLanguage.getF5_6_helper()}
        showHelperText={displayHelp}
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
