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

const F7Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr_indicator_set.f7_heading')}</H2>
      <InputRow>
        <label>
          <strong>F 7.1</strong>{' '}
          <Trans i18nKey="gfcr_indicator_set.f7_1" components={{ 0: <strong /> }} />
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_1a"
            label={
              <>
                <strong>{t('gfcr_indicator_set.men')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f7_1_men_helper"
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
            id="f7_1b"
            label={
              <>
                <strong>{t('gfcr_indicator_set.women')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f7_1_women_helper"
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
            id="f7_1_total"
            type="number"
            value={getFieldValueTotal(formik.values.f7_1a, formik.values.f7_1b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{t('gfcr_indicator_set.of_total_how_many')}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_1c"
            label={
              <>
                <strong>{t('gfcr_indicator_set.youth')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f7_1_youth_helper"
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
            id="f7_1d"
            label={
              <>
                <strong>{t('gfcr_indicator_set.indigenous')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f7_1_indigenous_helper"
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
      <InputRow>
        <label>
          <strong>F 7.2</strong>{' '}
          <Trans i18nKey="gfcr_indicator_set.f7_2" components={{ 0: <strong /> }} />
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_2a"
            label={
              <>
                <strong>{t('gfcr_indicator_set.men')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f7_2_men_helper"
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
            id="f7_2b"
            label={
              <>
                <strong>{t('gfcr_indicator_set.women')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f7_2_women_helper"
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
            id="f7_2_total"
            type="number"
            value={getFieldValueTotal(formik.values.f7_2a, formik.values.f7_2b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{t('gfcr_indicator_set.of_total_how_many')}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f7_2c"
            label={
              <>
                <strong>{t('gfcr_indicator_set.youth')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f7_2_youth_helper"
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
            id="f7_2d"
            label={
              <>
                <strong>{t('gfcr_indicator_set.indigenous')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f7_2_indigenous_helper"
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
      <GfcrIntegerInputField
        id="f7_3"
        label={
          <>
            <strong>F 7.3</strong> {t('gfcr_indicator_set.f7_3')}
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f7_3_helper"
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
      <GfcrIntegerInputField
        id="f7_4"
        label={
          <>
            <strong>F 7.4</strong> {t('gfcr_indicator_set.f7_4')}
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f7_4_helper"
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
      <TextareaWithLabelAndValidation
        id="f7_notes"
        label={t('gfcr_indicator_set.notes')}
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
