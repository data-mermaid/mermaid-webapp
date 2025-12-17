import React from 'react'
import PropTypes from 'prop-types'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { useTranslation } from 'react-i18next'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrDecimalInputField from '../GfcrDecimalInputField'
import GfcrIntegerInputField from '../GfcrIntegerInputField'
import GfcrHelperLinks from './GfcrHelperLinks'

const F3Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr.forms.f3_heading')}</H2>
      <GfcrDecimalInputField
        id="f3_1"
        label={
          <>
            <strong>F 3.1</strong> {t('gfcr.forms.f3_1')}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f3_1_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f3_2"
        label={
          <>
            <strong>F 3.2</strong> {t('gfcr.forms.f3_2')}
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f3_2_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f3_3"
        label={
          <>
            <strong>F 3.3</strong> {t('gfcr.forms.f3_3')}
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f3_3_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <GfcrIntegerInputField
        id="f3_4"
        label={
          <>
            <strong>F 3.4</strong> {t('gfcr.forms.f3_4')}
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f3_4_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <InputRow>
        <label>
          <strong>F 3.5</strong> {t('gfcr.forms.f3_5')}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f3_5a"
            label={<>{t('gfcr.forms.common.men')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f3_5_men_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f3_5b"
            label={<>{t('gfcr.forms.common.women')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f3_5_women_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{t('gfcr.forms.common.total')}</strong>}
            id="f3_5total"
            type="number"
            value={getFieldValueTotal(formik.values.f3_5a, formik.values.f3_5b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{t('gfcr.forms.common.of_total_how_many')}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f3_5c"
            label={<>{t('gfcr.forms.common.youth')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f3_5_youth_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f3_5d"
            label={<>{t('gfcr.forms.common.indigenous')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f3_5_indigenous_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <GfcrIntegerInputField
        id="f3_6"
        label={
          <>
            <strong>F 3.6</strong> {t('gfcr.forms.f3_6')}
          </>
        }
        helperText={<GfcrHelperLinks translationKey="gfcr.forms.f3_6_helper" />}
        displayHelp={displayHelp}
        handleInputFocus={handleInputFocus}
        formik={formik}
      />
      <TextareaWithLabelAndValidation
        id="f3_notes"
        label={t('notes')}
        {...formik.getFieldProps('f3_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F3Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F3Form
