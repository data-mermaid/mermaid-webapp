import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation, Trans } from 'react-i18next'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { StyledGfcrInputWrapper } from './subPages.styles'
import { HelperTextLink } from '../../../../generic/links'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrDecimalInputField from '../GfcrDecimalInputField'

const F1Form = ({ formik, displayHelp, handleInputFocus }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr_indicator_set.f1_heading')}</H2>
      <GfcrDecimalInputField
        id={'f1_1'}
        label={
          <>
            <strong>F 1.1</strong> {t('gfcr_indicator_set.f1_1')}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f1_1_helper"
            components={{
              a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
            }}
          />
        }
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <TextareaWithLabelAndValidation
        id="f1_notes"
        label={t('gfcr_indicator_set.notes')}
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
