import React from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { StyledGfcrInputWrapper } from './subPages.styles'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import { H2 } from '../../../../generic/text'
import { formikHandleNumericTwoDecimalInputChange } from '../../../../../library/formikHandleNumericTwoDecimalInputChange'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F2Form = ({ formik, displayHelp, handleInputBlur, handleInputFocus }) => {
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
        onBlur={(event) => handleInputBlur(formik, event, 'f2_1a')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericTwoDecimalInputChange({ formik, event, fieldName: 'f2_1a' })
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
        onBlur={(event) => handleInputBlur(formik, event, 'f2_1b')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericTwoDecimalInputChange({ formik, event, fieldName: 'f2_1b' })
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
        onBlur={(event) => handleInputBlur(formik, event, 'f2_2a')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericTwoDecimalInputChange({ formik, event, fieldName: 'f2_2a' })
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
        onBlur={(event) => handleInputBlur(formik, event, 'f2_2b')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericTwoDecimalInputChange({ formik, event, fieldName: 'f2_2b' })
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
        onBlur={(event) => handleInputBlur(formik, event, 'f2_3a')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericTwoDecimalInputChange({ formik, event, fieldName: 'f2_3a' })
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
        onBlur={(event) => handleInputBlur(formik, event, 'f2_3b')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericTwoDecimalInputChange({ formik, event, fieldName: 'f2_3b' })
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
        onBlur={(event) => handleInputBlur(formik, event, 'f2_4')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericTwoDecimalInputChange({ formik, event, fieldName: 'f2_4' })
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
        onBlur={(event) => handleInputBlur(formik, event, 'f2_5')}
        onFocus={(event) => handleInputFocus(event)}
        onChange={(event) =>
          formikHandleNumericTwoDecimalInputChange({ formik, event, fieldName: 'f2_5' })
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
  handleInputBlur: PropTypes.func.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
}

export default F2Form
