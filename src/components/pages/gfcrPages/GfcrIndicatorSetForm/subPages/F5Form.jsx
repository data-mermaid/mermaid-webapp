import React from 'react'
import PropTypes from 'prop-types'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { useTranslation, Trans } from 'react-i18next'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrIntegerInputField from '../GfcrIntegerInputField'
import GfcrHelperLinks from './GfcrHelperLinks'

const F5Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr.forms.f5_heading')}</H2>
      <GfcrIntegerInputField
        id="f5_1"
        label={
          <>
            <strong>F 5.1</strong>{' '}
            <Trans i18nKey="gfcr.forms.f5_1" components={{ strong: <strong /> }} />
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f5_1_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f5_2"
        label={
          <>
            <strong>F 5.2</strong>{' '}
            <Trans i18nKey="gfcr.forms.f5_2" components={{ strong: <strong /> }} />
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f5_2_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f5_3"
        label={
          <>
            <strong>F 5.3</strong> {t('gfcr.forms.f5_3')}
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f5_3_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <InputRow>
        <label>
          <strong>F 5.4</strong> {t('gfcr.forms.f5_4')}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f5_4a"
            label={<>{t('gfcr.forms.common.men')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f5_4_men_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f5_4b"
            label={<>{t('gfcr.forms.common.women')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f5_4_women_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{t('gfcr.forms.common.total')}</strong>}
            id="f5_4_total"
            type="number"
            value={getFieldValueTotal(formik.values.f5_4a, formik.values.f5_4b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{t('gfcr.forms.common.of_total_how_many')}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f5_4c"
            label={<>{t('gfcr.forms.common.youth')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f5_4_youth_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f5_4d"
            label={<>{t('gfcr.forms.common.indigenous')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f5_4_indigenous_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <GfcrIntegerInputField
        id="f5_5"
        label={
          <>
            <strong>F 5.5</strong> {t('gfcr.forms.f5_5')}
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f5_5_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f5_6"
        label={
          <>
            <strong>F 5.6</strong> {t('gfcr.forms.f5_6')}
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f5_6_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <TextareaWithLabelAndValidation
        id="f5_notes"
        label={t('forms.notes')}
        {...formik.getFieldProps('f5_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F5Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F5Form
