import React from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper } from './subForms.styles'

const F1Form = ({ formik, handleInputBlur }) => {
  return (
    <StyledGfcrInputWrapper>
      <InputWithLabelAndValidation
        label={
          <>
            <b>F 1.1</b> {language.pages.gfcrIndicatorSet.f1_1}
          </>
        }
        id="f1_1"
        type="number"
        unit="km²"
        {...formik.getFieldProps('f1_1')}
        onBlur={(event) => handleInputBlur(formik, event, 'f1_1')}
        helperText="Example helper text"
        onKeyDown={(event) => enforceNumberInput(event)}
      />
    </StyledGfcrInputWrapper>
  )
}

F1Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
}

export default F1Form
