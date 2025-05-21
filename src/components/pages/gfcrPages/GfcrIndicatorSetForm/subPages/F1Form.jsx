import React from 'react'
import PropTypes from 'prop-types'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { StyledGfcrInputWrapper } from './subPages.styles'
import language from '../../../../../language'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrDecimalInputField from '../GfcrDecimalInputField'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F1Form = ({ formik, displayHelp, handleInputFocus }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f1Heading}</H2>
      <GfcrDecimalInputField
        id={'f1_1'}
        label={
          <>
            <strong>F 1.1</strong> {gfcrIndicatorSetLanguage.f1_1}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={gfcrIndicatorSetLanguage.getF1_1_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
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
  handleInputFocus: PropTypes.func.isRequired,
}

export default F1Form
