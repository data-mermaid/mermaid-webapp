import PropTypes from 'prop-types'
import React from 'react'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { StyledGfcrInputWrapper } from './subPages.styles'
import { useTranslation, Trans } from 'react-i18next'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrDecimalInputField from '../GfcrDecimalInputField'
import GfcrHelperLinks from './GfcrHelperLinks'

const F2Form = ({ formik, displayHelp, handleInputFocus }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr.forms.f2_heading')}</H2>
      <GfcrDecimalInputField
        id="f2_1a"
        label={
          <>
            <strong>F 2.1a</strong>{' '}
            <Trans i18nKey="gfcr.forms.f2_1a" components={{ strong: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f2_1a_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_1b"
        label={
          <>
            <strong>F 2.1b</strong>{' '}
            <Trans i18nKey="gfcr.forms.f2_1b" components={{ strong: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f2_1b_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_2a"
        label={
          <>
            <strong>F 2.2a</strong>{' '}
            <Trans i18nKey="gfcr.forms.f2_2a" components={{ strong: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f2_2a_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_2b"
        label={
          <>
            <strong>F 2.2b</strong>{' '}
            <Trans i18nKey="gfcr.forms.f2_2b" components={{ strong: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f2_2b_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_3a"
        label={
          <>
            <strong>F 2.3a</strong>{' '}
            <Trans i18nKey="gfcr.forms.f2_3a" components={{ strong: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f2_3a_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_3b"
        label={
          <>
            <strong>F 2.3b</strong>{' '}
            <Trans i18nKey="gfcr.forms.f2_3b" components={{ strong: <strong /> }} />
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f2_3b_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_4"
        label={
          <>
            <strong>F 2.4</strong> {t('gfcr.forms.f2_4')}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f2_4_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrDecimalInputField
        id="f2_5"
        label={
          <>
            <strong>F 2.5</strong> {t('gfcr.forms.f2_5')}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f2_5_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <TextareaWithLabelAndValidation
        id="f2_notes"
        label={t('forms.notes')}
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
