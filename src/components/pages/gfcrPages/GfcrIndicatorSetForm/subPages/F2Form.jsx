import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { StyledGfcrInputWrapper } from './subPages.styles'
import { HelperTextLink } from '../../../../generic/links'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrDecimalInputField from '../GfcrDecimalInputField'

const F2Form = ({ formik, displayHelp, handleInputFocus }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr_indicator_set.f2_heading')}</H2>
      <GfcrDecimalInputField
        id="f2_1a"
        label={
          <>
            <strong>F 2.1a</strong>{' '}
            <Trans i18nKey="gfcr_indicator_set.f2_1a" components={{ 0: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f2_1a_helper"
            components={{
              acaLink: <HelperTextLink href="https://allencoralatlas.org/" target="_blank" />,
              a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
            }}
          />
        }
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_1b"
        label={
          <>
            <strong>F 2.1b</strong>{' '}
            <Trans i18nKey="gfcr_indicator_set.f2_1b" components={{ 0: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f2_1b_helper"
            components={{
              acaLink: <HelperTextLink href="https://allencoralatlas.org/" target="_blank" />,
              a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
            }}
          />
        }
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_2a"
        label={
          <>
            <strong>F 2.2a</strong>{' '}
            <Trans i18nKey="gfcr_indicator_set.f2_2a" components={{ 0: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f2_2a_helper"
            components={{
              a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
            }}
          />
        }
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_2b"
        label={
          <>
            <strong>F 2.2b</strong>{' '}
            <Trans i18nKey="gfcr_indicator_set.f2_2b" components={{ 0: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f2_2b_helper"
            components={{
              a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
            }}
          />
        }
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_3a"
        label={
          <>
            <strong>F 2.3a</strong>{' '}
            <Trans i18nKey="gfcr_indicator_set.f2_3a" components={{ 0: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f2_3a_helper"
            components={{
              a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
            }}
          />
        }
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_3b"
        label={
          <>
            <strong>F 2.3b</strong>{' '}
            <Trans i18nKey="gfcr_indicator_set.f2_3b" components={{ 0: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f2_3b_helper"
            components={{
              a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
            }}
          />
        }
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_4"
        label={
          <>
            <strong>F 2.4</strong> {t('gfcr_indicator_set.f2_4')}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f2_4_helper"
            components={{
              a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
            }}
          />
        }
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_5"
        label={
          <>
            <strong>F 2.5</strong> {t('gfcr_indicator_set.f2_5')}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f2_5_helper"
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
        id="f2_notes"
        label={t('gfcr_indicator_set.notes')}
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
