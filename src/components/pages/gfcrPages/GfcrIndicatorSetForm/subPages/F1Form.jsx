import React from 'react'
import PropTypes from 'prop-types'

import { formikHandleNumericTwoDecimalInputChange } from '../../../../../library/formikHandleInputTypes'
import { formikPropType } from '../../../../../library/formikPropType'
import { H2 } from '../../../../generic/text'
import { StyledGfcrInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../../../language'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F1Form = ({ formik, displayHelp, handleInputBlur, handleInputFocus }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f1Heading}</H2>
      <InputWithLabelAndValidation
        label={
          <>
            <strong>F 1.1</strong> {gfcrIndicatorSetLanguage.f1_1}
          </>
        }
        id="f1_1"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f1_1')}
        onBlur={(event) => handleInputBlur(formik, event, 'f1_1')}
        onFocus={(event) => handleInputFocus(event)}
        helperText={gfcrIndicatorSetLanguage.getF1_1_helper()}
        showHelperText={displayHelp}
        onChange={(event) =>
          formikHandleNumericTwoDecimalInputChange({ formik, event, fieldName: 'f1_1' })
        }
      />
      <TextareaWithLabelAndValidation
        id="f1_notes"
        label={gfcrIndicatorSetLanguage.notes}
        {...formik.getFieldProps('f1_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F1Form.propTypes = {
  formik: formikPropType.isRequired,
  displayHelp: PropTypes.bool,
  handleInputBlur: PropTypes.func.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
}

export default F1Form
