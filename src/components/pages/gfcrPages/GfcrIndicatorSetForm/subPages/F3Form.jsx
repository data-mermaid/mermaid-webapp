import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation, Trans } from 'react-i18next'

import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import GfcrDecimalInputField from '../GfcrDecimalInputField'
import GfcrIntegerInputField from '../GfcrIntegerInputField'
import { HelperTextLink } from '../../../../generic/links'

const F3Form = ({ formik, displayHelp, handleInputFocus, getFieldValueTotal }) => {
  const { t } = useTranslation()

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr_indicator_set.f3_heading')}</H2>
      <GfcrDecimalInputField
        id="f3_1"
        label={
          <>
            <strong>F 3.1</strong> {t('gfcr_indicator_set.f3_1')}
          </>
        }
        unit="km²"
        maxNumberOfDecimals={5}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f3_1_helper"
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
        id="f3_2"
        label={
          <>
            <strong>F 3.2</strong> {t('gfcr_indicator_set.f3_2')}
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f3_2_helper"
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
        id="f3_3"
        label={
          <>
            <strong>F 3.3</strong> {t('gfcr_indicator_set.f3_3')}
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f3_3_helper"
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
        id="f3_4"
        label={
          <>
            <strong>F 3.4</strong> {t('gfcr_indicator_set.f3_4')}
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f3_4_helper"
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
          <strong>F 3.5</strong> {t('gfcr_indicator_set.f3_5')}
        </label>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f3_5a"
            label={
              <>
                <strong>{t('gfcr_indicator_set.men')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f3_5_men_helper"
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
            id="f3_5b"
            label={
              <>
                <strong>{t('gfcr_indicator_set.women')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f3_5_women_helper"
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
            id="f3_5total"
            type="number"
            value={getFieldValueTotal(formik.values.f3_5a, formik.values.f3_5b)}
          />
        </StyledGfcrSubInputWrapper>
        <div>{t('gfcr_indicator_set.of_total_how_many')}</div>
        <StyledGfcrSubInputWrapper>
          <GfcrIntegerInputField
            id="f3_5c"
            label={
              <>
                <strong>{t('gfcr_indicator_set.youth')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f3_5_youth_helper"
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
            id="f3_5d"
            label={
              <>
                <strong>{t('gfcr_indicator_set.indigenous')}</strong>
              </>
            }
            helperText={
              <Trans
                i18nKey="gfcr_indicator_set.f3_5_indigenous_helper"
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
        id="f3_6"
        label={
          <>
            <strong>F 3.6</strong> {t('gfcr_indicator_set.f3_6')}
          </>
        }
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.f3_6_helper"
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
        id="f3_notes"
        label={t('gfcr_indicator_set.notes')}
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
