import React from 'react'
import PropTypes from 'prop-types'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { useTranslation } from 'react-i18next'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrIntegerInputField from '../GfcrIntegerInputField'
import GfcrHelperLinks from './GfcrHelperLinks'

const F6Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr.forms.f6_heading')}</H2>
      <InputRow>
        <label>
          <strong>F 6.1</strong> {t('gfcr.forms.f6_1')}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1a"
            label={<>{t('gfcr.forms.common.men')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f6_1_men_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1b"
            label={<>{t('gfcr.forms.common.women')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f6_1_women_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{t('gfcr.forms.common.total')}</strong>}
            id="f6_1_total"
            type="number"
            value={getFieldValueTotal(formik.values.f6_1a, formik.values.f6_1b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{t('gfcr.forms.common.of_total_following')}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1c"
            label={<>{t('gfcr.forms.common.youth')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f6_1_youth_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1d"
            label={<>{t('gfcr.forms.common.indigenous')}</>}
            helperText={<GfcrHelperLinks translationKey="gfcr.forms.f6_1_indigenous_helper" />}
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <TextareaWithLabelAndValidation
        id="f6_notes"
        label={t('notes')}
        {...formik.getFieldProps('f6_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F6Form.propTypes = {
  formik: formikPropType.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
  getFieldValueTotal: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default F6Form
