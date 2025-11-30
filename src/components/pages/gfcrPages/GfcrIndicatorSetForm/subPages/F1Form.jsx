import React from 'react'
import PropTypes from 'prop-types'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { StyledGfcrInputWrapper } from './subPages.styles'
import { useTranslation } from 'react-i18next'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrDecimalInputField from '../GfcrDecimalInputField'
import GfcrHelperLinks from './GfcrHelperLinks'

const F1Form = ({ formik, displayHelp, handleInputFocus }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr.forms.f1_heading')}</H2>
      <GfcrDecimalInputField
        id={'f1_1'}
        label={
          <>
            <strong>F 1.1</strong> {t('gfcr.forms.f1_1')}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={2}
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f1_1_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <TextareaWithLabelAndValidation
        id="f1_notes"
        label={t('forms.notes')}
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
