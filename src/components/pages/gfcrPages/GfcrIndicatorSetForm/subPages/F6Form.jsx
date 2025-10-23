import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation, Trans } from 'react-i18next'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrIntegerInputField from '../GfcrIntegerInputField'
import { HelperTextLink } from '../../../../generic/links'

const F6Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr_indicator_set.f6_heading')}</H2>
      <InputRow>
        <label>
          <strong>F 6.1</strong> {t('gfcr_indicator_set.f6_1')}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1a"
            label={
              <>
                <strong>{t('gfcr_indicator_set.men')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f6_1_men_helper"
                components={{
                  a: (
                    <HelperTextLink
                      href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf"
                      target="_blank"
                    />
                  ),
                }}
              />
            }
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1b"
            label={
              <>
                <strong>{t('gfcr_indicator_set.women')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f6_1_women_helper"
                components={{
                  a: (
                    <HelperTextLink
                      href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf"
                      target="_blank"
                    />
                  ),
                }}
              />
            }
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <InputWithLabelAndValidation
            disabled
            label={<strong>{t('gfcr_indicator_set.total')}</strong>}
            id="f6_1_total"
            type="number"
            value={getFieldValueTotal(formik.values.f6_1a, formik.values.f6_1b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{t('gfcr_indicator_set.of_total_how_many')}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1c"
            label={
              <>
                <strong>{t('gfcr_indicator_set.youth')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f6_1_youth_helper"
                components={{
                  a: (
                    <HelperTextLink
                      href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf"
                      target="_blank"
                    />
                  ),
                }}
              />
            }
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f6_1d"
            label={
              <>
                <strong>{t('gfcr_indicator_set.indigenous')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f6_1_indigenous_helper"
                components={{
                  a: (
                    <HelperTextLink
                      href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf"
                      target="_blank"
                    />
                  ),
                }}
              />
            }
            displayHelp={displayHelp}
            handleInputFocus={handleInputFocus}
            formik={formik}
          />
        </StyledGfcrSubInputWrapper>
      </InputRow>
      <TextareaWithLabelAndValidation
        id="f6_notes"
        label={t('gfcr_indicator_set.notes')}
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
