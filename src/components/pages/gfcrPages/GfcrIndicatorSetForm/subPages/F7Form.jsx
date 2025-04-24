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

const F7Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f7Heading}</H2>
      <InputRow>
        <label>
          <strong>F 7.1</strong> {gfcrIndicatorSetLanguage.getF7_1()}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.men}
            id="f7_1a"
            type="number"
            {...formik.getFieldProps('f7_1a')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f7_1a' })
            }
            onFocus={(event) => handleInputFocus(event)}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f7_1a' })
            }
            helperText={gfcrIndicatorSetLanguage.getF7_1_men_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.women}
            id="f7_1b"
            type="number"
            {...formik.getFieldProps('f7_1b')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f7_1b' })
            }
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f7_1b' })
            }
            onFocus={(event) => handleInputFocus(event)}
            helperText={gfcrIndicatorSetLanguage.getF7_1_women_helper()}
            showHelperText={displayHelp}
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
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.youth}
            id="f7_1c"
            type="number"
            {...formik.getFieldProps('f7_1c')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f7_1c' })
            }
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f7_1c' })
            }
            helperText={gfcrIndicatorSetLanguage.getF7_1_youth_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.indigenous}
            id="f7_1d"
            type="number"
            {...formik.getFieldProps('f7_1d')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f7_1d' })
            }
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f7_1d' })
            }
            helperText={gfcrIndicatorSetLanguage.getF7_1_indigenous_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputRow>
        <label>
          <strong>F 7.2</strong> {gfcrIndicatorSetLanguage.getF7_2()}
        </label>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.men}
            id="f7_2a"
            type="number"
            {...formik.getFieldProps('f7_2a')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f7_2a' })
            }
            onFocus={(event) => handleInputFocus(event)}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f7_2a' })
            }
            helperText={gfcrIndicatorSetLanguage.getF7_2_men_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.women}
            id="f7_2b"
            type="number"
            {...formik.getFieldProps('f7_2b')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f7_2b' })
            }
            onFocus={(event) => handleInputFocus(event)}
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f7_2b' })
            }
            helperText={gfcrIndicatorSetLanguage.getF7_2_women_helper()}
            showHelperText={displayHelp}
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
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.youth}
            id="f7_2c"
            type="number"
            {...formik.getFieldProps('f7_2c')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f7_2c' })
            }
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f7_2c' })
            }
            helperText={gfcrIndicatorSetLanguage.getF7_2_youth_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            label={gfcrIndicatorSetLanguage.indigenous}
            id="f7_2d"
            type="number"
            {...formik.getFieldProps('f7_2d')}
            onBlur={(event) =>
              resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f7_2d' })
            }
            onChange={(event) =>
              formikHandleIntegerInputChange({ formik, event, fieldName: 'f7_2d' })
            }
            helperText={gfcrIndicatorSetLanguage.getF7_2_indigenous_helper()}
            showHelperText={displayHelp}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 7.3</strong> {gfcrIndicatorSetLanguage.f7_3}
          </>
        }
        id="f7_3"
        type="number"
        {...formik.getFieldProps('f7_3')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f7_3' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f7_3' })}
        helperText={gfcrIndicatorSetLanguage.getF7_3_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 7.4</strong> {gfcrIndicatorSetLanguage.f7_4}
          </>
        }
        id="f7_4"
        type="number"
        {...formik.getFieldProps('f7_4')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f7_4' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) => formikHandleIntegerInputChange({ formik, event, fieldName: 'f7_4' })}
        helperText={gfcrIndicatorSetLanguage.getF7_4_helper()}
        showHelperText={displayHelp}
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
