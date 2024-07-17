import React from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper } from './subPages.styles'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F1Form = ({ formik, handleInputBlur, displayHelp }) => {
  return (
    <StyledGfcrInputWrapper>
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
        helperText={gfcrIndicatorSetLanguage.f1_1_helper}
        showHelperText={displayHelp}
        onKeyDown={(event) => enforceNumberInput(event)}
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
  handleInputBlur: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F1Form
