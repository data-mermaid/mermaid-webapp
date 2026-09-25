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
import {
  GFCR_MAX_INTEGER,
  GFCR_MAX_SMALL_INTEGER,
} from '../../../../../library/numbers/gfcrFieldMaximums'
import GfcrHelperLinks from './GfcrHelperLinks'

const F7Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr.forms.f7_heading')}</H2>
      <InputRow>
        <label>
          <strong>F 7.1</strong>{' '}
          <Trans i18nKey="gfcr.forms.f7_1" components={{ strong: <strong /> }} />
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_1a"
            maxValue={GFCR_MAX_INTEGER}
            label={<>{t('gfcr.forms.common.men')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f7_1_men_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_1b"
            maxValue={GFCR_MAX_INTEGER}
            label={<>{t('gfcr.forms.common.women')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f7_1_women_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{t('gfcr.forms.common.total')}</strong>}
            id="f7_1_total"
            value={getFieldValueTotal(formik.values.f7_1a, formik.values.f7_1b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{t('gfcr.forms.common.of_total_following')}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_1c"
            maxValue={GFCR_MAX_INTEGER}
            label={<>{t('gfcr.forms.common.youth')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f7_1_youth_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_1d"
            maxValue={GFCR_MAX_INTEGER}
            label={<>{t('gfcr.forms.common.indigenous')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f7_1_indigenous_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <InputRow>
        <label>
          <strong>F 7.2</strong>{' '}
          <Trans i18nKey="gfcr.forms.f7_2" components={{ strong: <strong /> }} />
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_2a"
            maxValue={GFCR_MAX_INTEGER}
            label={<>{t('gfcr.forms.common.men')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f7_2_men_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_2b"
            maxValue={GFCR_MAX_INTEGER}
            label={<>{t('gfcr.forms.common.women')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f7_2_women_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{t('gfcr.forms.common.total')}</strong>}
            id="f7_2_total"
            value={getFieldValueTotal(formik.values.f7_2a, formik.values.f7_2b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{t('gfcr.forms.common.of_total_following')}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_2c"
            maxValue={GFCR_MAX_INTEGER}
            label={<>{t('gfcr.forms.common.youth')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f7_2_youth_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_2d"
            maxValue={GFCR_MAX_INTEGER}
            label={<>{t('gfcr.forms.common.indigenous')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f7_2_indigenous_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <GfcrIntegerInputField
        id="f7_3"
        maxValue={GFCR_MAX_SMALL_INTEGER}
        label={
          <>
            <strong>F 7.3</strong> {t('gfcr.forms.f7_3')}
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f7_3_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f7_4"
        maxValue={GFCR_MAX_SMALL_INTEGER}
        label={
          <>
            <strong>F 7.4</strong> {t('gfcr.forms.f7_4')}
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f7_4_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <TextareaWithLabelAndValidation
        id="f7_notes"
        label={t('notes')}
        {...formik.getFieldProps('f7_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F7Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F7Form
