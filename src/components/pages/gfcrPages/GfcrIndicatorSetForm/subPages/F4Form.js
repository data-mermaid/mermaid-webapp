import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import { InputRow } from '../../../../generic/form'
import { ButtonSecondary } from '../../../../generic/buttons'
import theme from '../../../../../theme'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
const StyledButtonSecondary = styled(ButtonSecondary)`
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

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F4Form = ({
  formik,
  handleInputBlur,
  indicatorSetType,
  indicatorSet,
  setInputToDefaultValue,
  handleFormSubmit,
}) => {
  const [isUpdateFromCalc, setIsUpdateFromCalc] = useState(false)
  const isAnnualReport = indicatorSetType === 'annual_report'

  const _indicatorSetChanged = useEffect(() => {
    if (isUpdateFromCalc) {
      // Set values to calculated values or defaults
      indicatorSet?.f4_1_calc
        ? formik.setFieldValue('f4_1', indicatorSet.f4_1_calc)
        : setInputToDefaultValue(formik, 'f4_1')
      indicatorSet?.f4_2_calc
        ? formik.setFieldValue('f4_2', indicatorSet.f4_2_calc)
        : setInputToDefaultValue(formik, 'f4_1')
      indicatorSet?.f4_3_calc
        ? formik.setFieldValue('f4_3', indicatorSet.f4_3_calc)
        : setInputToDefaultValue(formik, 'f4_3')

      setIsUpdateFromCalc(false)
    }
  }, [formik, indicatorSet, isUpdateFromCalc, setInputToDefaultValue])

  const handleSaveAndUpdateValues = async () => {
    // Save
    await handleFormSubmit(formik.values, { resetForm: formik.resetForm }, true)

    // Set isUpdateFromCalc. This will trigger _indicatorSetChanged useEffect
    setIsUpdateFromCalc(true)
  }

  const isF41UsingCalcValue = formik.values.f4_1 === indicatorSet?.f4_1_calc
  const isF42UsingCalcValue = formik.values.f4_2 === indicatorSet?.f4_2_calc
  const isF43UsingCalcValue = formik.values.f4_3 === indicatorSet?.f4_3_calc

  let f41HelperText,
    f42HelperText,
    f43HelperText = null

  if (isF41UsingCalcValue) {
    f41HelperText = gfcrIndicatorSetLanguage.f4_valueFromMermaidData
  } else if (!isF41UsingCalcValue && indicatorSet?.f4_1_calc) {
    f41HelperText = (
      <>
        {gfcrIndicatorSetLanguage.f4_valueDifferentFromCalc} <strong>({indicatorSet.f4_1_calc})</strong>
      </>
    )
  } else if (!isF41UsingCalcValue && !indicatorSet?.f4_1_calc && !formik.values.f4_1) {
    f41HelperText = gfcrIndicatorSetLanguage.f4_noValue
  }

  if (isF42UsingCalcValue) {
    f42HelperText = gfcrIndicatorSetLanguage.f4_valueFromMermaidData
  } else if (!isF42UsingCalcValue && indicatorSet?.f4_2_calc) {
    f42HelperText = gfcrIndicatorSetLanguage.f4_valueDifferentFromCalc
  } else if (!isF42UsingCalcValue && !indicatorSet?.f4_2_calc && !formik.values.f4_2) {
    f42HelperText = gfcrIndicatorSetLanguage.f4_noValue
  }

  if (isF43UsingCalcValue) {
    f43HelperText = gfcrIndicatorSetLanguage.f4_valueFromMermaidData
  } else if (!isF43UsingCalcValue && indicatorSet?.f4_3_calc) {
    f43HelperText = gfcrIndicatorSetLanguage.f4_valueDifferentFromCalc
  } else if (!isF43UsingCalcValue && !indicatorSet?.f4_3_calc && !formik.values.f4_3) {
    f43HelperText = gfcrIndicatorSetLanguage.f4_noValue
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
      {isAnnualReport && (
        <StyledInputRowDates>
          <label>
            <strong>{gfcrIndicatorSetLanguage.f4_reportingDateRange}</strong>
          </label>
          <StyledGfcrSubInputWrapper>
            <InputWithLabelAndValidation
              label={gfcrIndicatorSetLanguage.f4_start_date}
              id="f4_start_date"
              type="date"
              {...formik.getFieldProps('f4_start_date')}
              onBlur={(event) => handleInputBlur(formik, event, 'f4_start_date')}
            />
            <InputWithLabelAndValidation
              label={gfcrIndicatorSetLanguage.f4_end_date}
              id="f4_end_date"
              type="date"
              {...formik.getFieldProps('f4_end_date')}
              onBlur={(event) => handleInputBlur(formik, event, 'f4_end_date')}
            />
            <StyledButtonSecondary
              type="button"
              onClick={handleSaveAndUpdateValues}
              disabled={saveAndUpdateValuesButtonDisabled}
            >
              {gfcrIndicatorSetLanguage.f4_saveAndUpdateValues}
            </StyledButtonSecondary>
          </StyledGfcrSubInputWrapper>
        </StyledInputRowDates>
      )}
      <StyledInputRowQuestions>
        <InputWithLabelAndValidation
          label={
            <>
              <strong>F 4.1</strong> {gfcrIndicatorSetLanguage.f4_1}
            </>
          }
          id="f4_1"
          type="number"
          unit="%"
          {...formik.getFieldProps('f4_1')}
          onBlur={(event) => handleInputBlur(formik, event, 'f4_1', true)}
          helperText={isAnnualReport ? f41HelperText : gfcrIndicatorSetLanguage.f4_1_helper}
          showHelperText={isAnnualReport && true}
          onKeyDown={(event) => enforceNumberInput(event)}
        />
      </StyledInputRowQuestions>
      <StyledInputRowQuestions>
        <InputWithLabelAndValidation
          label={
            <>
              <strong>F 4.2</strong> {gfcrIndicatorSetLanguage.f4_2}
            </>
          }
          id="f4_2"
          type="number"
          unit="%"
          {...formik.getFieldProps('f4_2')}
          onBlur={(event) => handleInputBlur(formik, event, 'f4_2', true)}
          helperText={isAnnualReport ? f42HelperText : gfcrIndicatorSetLanguage.f4_2_helper}
          showHelperText={isAnnualReport && true}
          onKeyDown={(event) => enforceNumberInput(event)}
        />
      </StyledInputRowQuestions>
      <StyledInputRowQuestions>
        <InputWithLabelAndValidation
          label={
            <>
              <strong>F 4.3</strong> {gfcrIndicatorSetLanguage.f4_3}
            </>
          }
          id="f4_3"
          type="number"
          unit="kg/ha"
          {...formik.getFieldProps('f4_3')}
          onBlur={(event) => handleInputBlur(formik, event, 'f4_3', true)}
          helperText={isAnnualReport ? f43HelperText : gfcrIndicatorSetLanguage.f4_3_helper}
          showHelperText={isAnnualReport && true}
          onKeyDown={(event) => enforceNumberInput(event)}
        />
      </StyledInputRowQuestions>
      <TextareaWithLabelAndValidation
        id="f4_notes"
        label={gfcrIndicatorSetLanguage.notes}
        {...formik.getFieldProps('f4_notes')}
      />
    </StyledGfcrInputWrapper>
  )
}

F4Form.propTypes = {
  formik: formikPropType.isRequired,
  indicatorSet: PropTypes.object.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  setInputToDefaultValue: PropTypes.func.isRequired,
  indicatorSetType: PropTypes.string.isRequired,
}

export default F4Form
