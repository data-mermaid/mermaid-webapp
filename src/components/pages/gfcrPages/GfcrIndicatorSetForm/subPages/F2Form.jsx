import PropTypes from 'prop-types'
import React from 'react'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { StyledGfcrInputWrapper } from './subPages.styles'
import language from '../../../../../language'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrDecimalInputField from '../GfcrDecimalInputField'

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F2Form = ({ formik, displayHelp, handleInputFocus }) => {
  return (
    <StyledGfcrInputWrapper>
      <H2>{gfcrIndicatorSetLanguage.f2Heading}</H2>
      <GfcrDecimalInputField
        id="f2_1a"
        label={
          <>
            <strong>F 2.1a</strong> {gfcrIndicatorSetLanguage.getF2_1a()}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={gfcrIndicatorSetLanguage.getF2_1a_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_1b"
        label={
          <>
            <strong>F 2.1b</strong> {gfcrIndicatorSetLanguage.getF2_1b()}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={gfcrIndicatorSetLanguage.getF2_1b_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_2a"
        label={
          <>
            <strong>F 2.2a</strong> {gfcrIndicatorSetLanguage.getF2_2a()}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={gfcrIndicatorSetLanguage.getF2_2a_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_2b"
        label={
          <>
            <strong>F 2.2b</strong> {gfcrIndicatorSetLanguage.getF2_2b()}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={gfcrIndicatorSetLanguage.getF2_2b_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_3a"
        label={
          <>
            <strong>F 2.3a</strong> {gfcrIndicatorSetLanguage.getF2_3a()}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={gfcrIndicatorSetLanguage.getF2_3a_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_3b"
        label={
          <>
            <strong>F 2.3b</strong> {gfcrIndicatorSetLanguage.getF2_3b()}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={gfcrIndicatorSetLanguage.getF2_3b_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_4"
        label={
          <>
            <strong>F 2.4</strong> {gfcrIndicatorSetLanguage.f2_4}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={gfcrIndicatorSetLanguage.getF2_4_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_5"
        label={
          <>
            <strong>F 2.5</strong> {gfcrIndicatorSetLanguage.f2_5}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={gfcrIndicatorSetLanguage.getF2_5_helper()}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
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
