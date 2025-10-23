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

const F5Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr_indicator_set.f5_heading')}</H2>
      <GfcrIntegerInputField
        id="f5_1"
        label={
          <>
            <strong>F 5.1</strong>{' '}
            <Trans i18nKey="gfcr_indicator_set.f5_1" components={{ 0: <strong /> }} />
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f5_1_helper"
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
        id="f5_2"
        label={
          <>
            <strong>F 5.2</strong>{' '}
            <Trans i18nKey="gfcr_indicator_set.f5_2" components={{ 0: <strong /> }} />
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f5_2_helper"
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
        id="f5_3"
        label={
          <>
            <strong>F 5.3</strong> {t('gfcr_indicator_set.f5_3')}
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f5_3_helper"
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
      <InputRow>
        <label>
          <strong>F 5.4</strong> {t('gfcr_indicator_set.f5_4')}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f5_4a"
            label={
              <>
                <strong>{t('gfcr_indicator_set.men')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f5_4_men_helper"
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
            id="f5_4b"
            label={
              <>
                <strong>{t('gfcr_indicator_set.women')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f5_4_women_helper"
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
            id="f5_4_total"
            type="number"
            value={getFieldValueTotal(formik.values.f5_4a, formik.values.f5_4b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{t('gfcr_indicator_set.of_total_how_many')}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f5_4c"
            label={
              <>
                <strong>{t('gfcr_indicator_set.youth')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f5_4_youth_helper"
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
            id="f5_4d"
            label={
              <>
                <strong>{t('gfcr_indicator_set.indigenous')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f5_4_indigenous_helper"
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
        id="f5_5"
        label={
          <>
            <strong>F 5.5</strong> {t('gfcr_indicator_set.f5_5')}
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f5_5_helper"
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
        id="f5_6"
        label={
          <>
            <strong>F 5.6</strong> {t('gfcr_indicator_set.f5_6')}
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f5_6_helper"
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
        id="f5_notes"
        label={t('gfcr_indicator_set.notes')}
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
