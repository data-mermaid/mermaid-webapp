import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'

import { ButtonPrimary } from '../../../../generic/buttons'
import { formikPropType } from '../../../../../library/formik/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { useTranslation } from 'react-i18next'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import theme from '../../../../../theme'
import { resetEmptyFormikFieldToInitialValue } from '../../../../../library/formik/resetEmptyFormikFieldToInitialValue'
import GfcrDecimalInputField from '../GfcrDecimalInputField'
import GfcrHelperLinks from './GfcrHelperLinks'

const StyledButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
`

const StyledInputRowDates = styled(InputRow)`
  border: 1px solid ${theme.color.border};
  &:hover:not([disabled]) {
    background-color: white;
  }
`

const StyledInputRowQuestions = styled(InputRow)`
  > .inputRow {
    padding: 1rem 0;
    border: none;
    width: 100%;
  }
`

const StyledValueUpdateText = styled.strong`
  font-size: ${theme.typography.smallFontSize};
`

const F4Form = ({
  formik,
  handleInputFocus,
  indicatorSetType,
  indicatorSet,
  handleFormSubmit,
  displayHelp,
}) => {
  const { t } = useTranslation()
  const [isUpdateFromCalc, setIsUpdateFromCalc] = useState(false)
  // Eventually 'annual_report' can be removed if we're sure there are no indicators sets with this value in the DB
  const isReport = indicatorSetType === 'report' || indicatorSetType === 'annual_report'

  const _indicatorSetChanged = useEffect(() => {
    if (isUpdateFromCalc) {
      const formikInitialValues = formik.initialValues
      const { f4_1_calc, f4_2_calc, f4_3_calc } = indicatorSet ?? {}

      // Set values to calculated values or defaults
      formik.setFieldValue('f4_1', f4_1_calc ? f4_1_calc : formikInitialValues.f4_1)
      formik.setFieldValue('f4_2', f4_2_calc ? f4_2_calc : formikInitialValues.f4_2)
      formik.setFieldValue('f4_3', f4_3_calc ? f4_3_calc : formikInitialValues.f4_3)

      setIsUpdateFromCalc(false)
    }
  }, [formik, indicatorSet, isUpdateFromCalc])

  const handleSaveAndUpdateValues = async () => {
    // Save
    await handleFormSubmit(formik.values, { resetForm: formik.resetForm }, true)

    // Set isUpdateFromCalc. This will trigger _indicatorSetChanged useEffect
    setIsUpdateFromCalc(true)
  }

  const isF41UsingCalcValue = formik.values.f4_1 === indicatorSet?.f4_1_calc
  const isF42UsingCalcValue = formik.values.f4_2 === indicatorSet?.f4_2_calc
  const isF43UsingCalcValue = formik.values.f4_3 === indicatorSet?.f4_3_calc

  let f41ValueUpdateText,
    f42ValueUpdateText,
    f43ValueUpdateText = null

  if (isF41UsingCalcValue) {
    f41ValueUpdateText = t('gfcr.forms.f4_value_from_mermaid_data')
  } else if (!isF41UsingCalcValue && indicatorSet?.f4_1_calc) {
    f41ValueUpdateText = (
      <>
        {t('gfcr.forms.f4_value_different_from_calc')} <strong>({indicatorSet.f4_1_calc})</strong>
      </>
    )
  } else if (!isF41UsingCalcValue && !indicatorSet?.f4_1_calc && !formik.values.f4_1) {
    f41ValueUpdateText = t('gfcr.forms.f4_no_value')
  }

  if (isF42UsingCalcValue) {
    f42ValueUpdateText = t('gfcr.forms.f4_value_from_mermaid_data')
  } else if (!isF42UsingCalcValue && indicatorSet?.f4_2_calc) {
    f42ValueUpdateText = t('gfcr.forms.f4_value_different_from_calc')
  } else if (!isF42UsingCalcValue && !indicatorSet?.f4_2_calc && !formik.values.f4_2) {
    f42ValueUpdateText = t('gfcr.forms.f4_no_value')
  }

  if (isF43UsingCalcValue) {
    f43ValueUpdateText = t('gfcr.forms.f4_value_from_mermaid_data')
  } else if (!isF43UsingCalcValue && indicatorSet?.f4_3_calc) {
    f43ValueUpdateText = t('gfcr.forms.f4_value_different_from_calc')
  } else if (!isF43UsingCalcValue && !indicatorSet?.f4_3_calc && !formik.values.f4_3) {
    f43ValueUpdateText = t('gfcr.forms.f4_no_value')
  }

  const isF41ValueZeroAndCalcValueNull = formik.values.f4_1 === 0 && !indicatorSet?.f4_1_calc
  const isF42ValueZeroAndCalcValueNull = formik.values.f4_2 === 0 && !indicatorSet?.f4_2_calc
  const isF43ValueZeroAndCalcValueNull = formik.values.f4_3 === 0 && !indicatorSet?.f4_3_calc

  const dateRangeDirty =
    formik.values.f4_start_date !== indicatorSet?.f4_start_date ||
    formik.values.f4_end_date !== indicatorSet?.f4_end_date
  const fValuesChanged = !(
    (isF41UsingCalcValue || isF41ValueZeroAndCalcValueNull) &&
    (isF42UsingCalcValue || isF42ValueZeroAndCalcValueNull) &&
    (isF43UsingCalcValue || isF43ValueZeroAndCalcValueNull)
  )

  // Disable the “save and update” button if the indicator set has not title, the date range has not changed or if no changes have been made to the F values.
  const saveAndUpdateValuesButtonDisabled =
    !formik.values.title || (!dateRangeDirty && !fValuesChanged)

  return (
    <StyledGfcrInputWrapper>
      <H2>{t('gfcr.forms.f4_heading')}</H2>
      {isReport && (
        <StyledInputRowDates>
          <label>
            <strong>{t('gfcr.forms.f4_reporting_date_range')}</strong>
          </label>
          <StyledGfcrSubInputWrapper>
            <InputWithLabelAndValidation
              label={t('gfcr.forms.f4_start_date')}
              id="f4_start_date"
              type="date"
              {...formik.getFieldProps('f4_start_date')}
              onBlur={(event) =>
                resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f4_start_date' })
              }
            />
            <InputWithLabelAndValidation
              label={t('gfcr.forms.f4_end_date')}
              id="f4_end_date"
              type="date"
              {...formik.getFieldProps('f4_end_date')}
              onBlur={(event) =>
                resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'f4_end_date' })
              }
            />
            <StyledButtonPrimary
              type="button"
              onClick={handleSaveAndUpdateValues}
              disabled={saveAndUpdateValuesButtonDisabled}
            >
              {t('gfcr.forms.f4_save_and_update_values')}
            </StyledButtonPrimary>
          </StyledGfcrSubInputWrapper>
        </StyledInputRowDates>
      )}
      <StyledInputRowQuestions>
        <GfcrDecimalInputField
          id={'f4_1'}
          label={
            <>
              <strong>F 4.1</strong> {t('gfcr.forms.f4_1')}
            </>
          }
          unit="%"
          maxNumberOfDecimals={2}
          helperText={<GfcrHelperLinks translationKey="gfcr.forms.f4_1_helper" />}
          displayHelp={displayHelp}
          handleInputFocus={handleInputFocus}
          formik={formik}
        />
        {isReport && <StyledValueUpdateText>{f41ValueUpdateText}</StyledValueUpdateText>}
      </StyledInputRowQuestions>
      <StyledInputRowQuestions>
        <GfcrDecimalInputField
          id={'f4_2'}
          label={
            <>
              <strong>F 4.2</strong> {t('gfcr.forms.f4_2')}
            </>
          }
          unit="%"
          maxNumberOfDecimals={1}
          helperText={<GfcrHelperLinks translationKey="gfcr.forms.f4_2_helper" />}
          displayHelp={displayHelp}
          handleInputFocus={handleInputFocus}
          formik={formik}
        />
        {isReport && <StyledValueUpdateText>{f42ValueUpdateText}</StyledValueUpdateText>}
      </StyledInputRowQuestions>
      <StyledInputRowQuestions>
        <GfcrDecimalInputField
          id={'f4_3'}
          label={
            <>
              <strong>F 4.3</strong> {t('gfcr.forms.f4_3')}
            </>
          }
          unit="kg/ha"
          maxNumberOfDecimals={2}
          helperText={<GfcrHelperLinks translationKey="gfcr.forms.f4_3_helper" />}
          displayHelp={displayHelp}
          handleInputFocus={handleInputFocus}
          formik={formik}
        />
        {isReport && <StyledValueUpdateText>{f43ValueUpdateText}</StyledValueUpdateText>}
      </StyledInputRowQuestions>
      <TextareaWithLabelAndValidation
        id="f4_notes"
        label={t('notes')}
        {...formik.getFieldProps('f4_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F4Form.propTypes = {
  formik: formikPropType.isRequired,
  indicatorSet: PropTypes.object.isRequired,
  handleInputFocus: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  setInputToDefaultValue: PropTypes.func.isRequired,
  indicatorSetType: PropTypes.string.isRequired,
  displayHelp: PropTypes.bool,
}

export default F4Form
