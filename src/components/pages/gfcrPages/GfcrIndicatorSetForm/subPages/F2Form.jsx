import PropTypes from 'prop-types'
import React from 'react'

import { formikHandleNumericDecimalInputChange } from '../../../../../library/formik/formikHandleInputTypes'
import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { StyledGfcrInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../../../language'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import { resetEmptyFormikFieldToInitialValue } from '../../../../../library/formik/resetEmptyFormikFieldToInitialValue'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F2Form = ({ formik, displayHelp, handleInputFocus }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f2Heading}</H2>
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.1a</strong> {gfcrIndicatorSetLanguage.getF2_1a()}
          </>
        }
        id="f2_1a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_1a')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f2_1a' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericDecimalInputChange({
            formik,
            event,
            fieldName: 'f2_1a',
            maxNumberOfDecimals: 5,
          })
        }
        helperText={gfcrIndicatorSetLanguage.getF2_1a_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.1b</strong> {gfcrIndicatorSetLanguage.getF2_1b()}
          </>
        }
        id="f2_1b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_1b')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f2_1b' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericDecimalInputChange({
            formik,
            event,
            fieldName: 'f2_1b',
            maxNumberOfDecimals: 5,
          })
        }
        helperText={gfcrIndicatorSetLanguage.getF2_1b_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.2a</strong> {gfcrIndicatorSetLanguage.getF2_2a()}
          </>
        }
        id="f2_2a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_2a')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f2_2a' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericDecimalInputChange({
            formik,
            event,
            fieldName: 'f2_2a',
            maxNumberOfDecimals: 5,
          })
        }
        helperText={gfcrIndicatorSetLanguage.getF2_2a_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.2b</strong> {gfcrIndicatorSetLanguage.getF2_2b()}
          </>
        }
        id="f2_2b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_2b')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f2_2b' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericDecimalInputChange({
            formik,
            event,
            fieldName: 'f2_2b',
            maxNumberOfDecimals: 5,
          })
        }
        helperText={gfcrIndicatorSetLanguage.getF2_2b_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.3a</strong> {gfcrIndicatorSetLanguage.getF2_3a()}
          </>
        }
        id="f2_3a"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_3a')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f2_3a' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericDecimalInputChange({
            formik,
            event,
            fieldName: 'f2_3a',
            maxNumberOfDecimals: 5,
          })
        }
        helperText={gfcrIndicatorSetLanguage.getF2_3a_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.3b</strong> {gfcrIndicatorSetLanguage.getF2_3b()}
          </>
        }
        id="f2_3b"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_3b')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f2_3b' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericDecimalInputChange({
            formik,
            event,
            fieldName: 'f2_3b',
            maxNumberOfDecimals: 5,
          })
        }
        helperText={gfcrIndicatorSetLanguage.getF2_3b_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.4</strong> {gfcrIndicatorSetLanguage.f2_4}
          </>
        }
        id="f2_4"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_4')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f2_4' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericDecimalInputChange({
            formik,
            event,
            fieldName: 'f2_4',
            maxNumberOfDecimals: 5,
          })
        }
        helperText={gfcrIndicatorSetLanguage.getF2_4_helper()}
        showHelperText={displayHelp}
      />
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 2.5</strong> {gfcrIndicatorSetLanguage.f2_5}
          </>
        }
        id="f2_5"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f2_5')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f2_5' })
        }
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericDecimalInputChange({
            formik,
            event,
            fieldName: 'f2_5',
            maxNumberOfDecimals: 5,
          })
        }
        helperText={gfcrIndicatorSetLanguage.getF2_5_helper()}
        showHelperText={displayHelp}
      />
      <TextareaWithLabelAndValidation
        id="f2_notes"
        label={gfcrIndicatorSetLanguage.notes}
        {...formik.getFieldProps('f2_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F2Form.propTypes = {
  formik: formikPropType.isRequired,
  displayHelp: PropTypes.bool,
  handleInputFocus: PropTypes.func.isRequired,
}

export default F2Form
