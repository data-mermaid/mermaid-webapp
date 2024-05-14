import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import language from '../../../../../language'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subForms.styles'
import { InputRow } from '../../../../generic/form'
import { ButtonSecondary } from '../../../../generic/buttons'
import theme from '../../../../../theme'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../../../library/getToastArguments'

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

const calculatedValueCorrespondingNames = {
  f4_1_calc: 'F 4.1',
  f4_2_calc: 'F 4.2',
  f4_3_calc: 'F 4.3',
}

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

      // Display a toast saying which values could not be calculated
      const nullCalcKeys = Object.keys(indicatorSet)
        .filter((key) => ['f4_1_calc', 'f4_2_calc', 'f4_3_calc'].includes(key))
        .filter((key) => indicatorSet[key] === null)

      if (nullCalcKeys.length) {
        toast.warning(
          ...getToastArguments(
            `${gfcrIndicatorSetLanguage.f4_couldNotGetCalcValues} ${nullCalcKeys
              .map((key) => calculatedValueCorrespondingNames[key])
              .join(', ')}`,
          ),
        )
      }

      setIsUpdateFromCalc(false)
    }
  }, [formik, indicatorSet, isUpdateFromCalc, setInputToDefaultValue])

  const handleSaveAndUpdateValues = async () => {
    // Save
    await handleFormSubmit(formik.values, { resetForm: formik.resetForm })

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
    f41HelperText = indicatorSet?.f4_1_calc
      ? gfcrIndicatorSetLanguage.f4_valueFromMermaidData
      : gfcrIndicatorSetLanguage.f4_valueFromSubmittedSampleUnits
  } else if (!isF41UsingCalcValue && indicatorSet?.f4_1_calc) {
    f41HelperText = gfcrIndicatorSetLanguage.f4_valueFromSubmittedSampleUnits
  }

  if (isF42UsingCalcValue) {
    f42HelperText = indicatorSet?.f4_2_calc
      ? gfcrIndicatorSetLanguage.f4_valueFromMermaidData
      : gfcrIndicatorSetLanguage.f4_valueFromSubmittedSampleUnits
  } else if (!isF42UsingCalcValue && indicatorSet?.f4_2_calc) {
    f42HelperText = gfcrIndicatorSetLanguage.f4_valueFromSubmittedSampleUnits
  }

  if (isF43UsingCalcValue) {
    f43HelperText = gfcrIndicatorSetLanguage.f4_valueFromMermaidData
  } else if (!isF43UsingCalcValue && indicatorSet?.f4_3_calc) {
    f43HelperText = gfcrIndicatorSetLanguage.f4_valueFromSubmittedSampleUnits
  }

  return (
    <StyledGfcrInputWrapper>
      {isAnnualReport && (
        <StyledInputRowDates>
          <label>
            <b>{gfcrIndicatorSetLanguage.f4_reportingDateRange}</b>
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
            <StyledButtonSecondary type="button" onClick={handleSaveAndUpdateValues}>
              {gfcrIndicatorSetLanguage.f4_saveAndUpdateValues}
            </StyledButtonSecondary>
          </StyledGfcrSubInputWrapper>
        </StyledInputRowDates>
      )}
      <StyledInputRowQuestions>
        <InputWithLabelAndValidation
          label={
            <>
              <b>F 4.1</b> {gfcrIndicatorSetLanguage.f4_1}
            </>
          }
          id="f4_1"
          type="number"
          unit="%"
          {...formik.getFieldProps('f4_1')}
          onBlur={(event) => handleInputBlur(formik, event, 'f4_1')}
          helperText={isAnnualReport && f41HelperText}
          showHelperText={true}
          onKeyDown={(event) => enforceNumberInput(event)}
        />
        {isAnnualReport && indicatorSet?.f4_1_calc && !isF41UsingCalcValue && (
          <ButtonSecondary
            type="button"
            onClick={() => formik.setFieldValue('f4_1', indicatorSet.f4_1_calc)}
          >
            {`${gfcrIndicatorSetLanguage.f4_updateValue} ${indicatorSet.f4_1_calc}%`}
          </ButtonSecondary>
        )}
      </StyledInputRowQuestions>
      <StyledInputRowQuestions>
        <InputWithLabelAndValidation
          label={
            <>
              <b>F 4.2</b> {gfcrIndicatorSetLanguage.f4_2}
            </>
          }
          id="f4_2"
          type="number"
          unit="%"
          {...formik.getFieldProps('f4_2')}
          onBlur={(event) => handleInputBlur(formik, event, 'f4_2')}
          helperText={isAnnualReport && f42HelperText}
          showHelperText={true}
          onKeyDown={(event) => enforceNumberInput(event)}
        />
        {isAnnualReport && indicatorSet?.f4_2_calc && !isF42UsingCalcValue && (
          <ButtonSecondary
            type="button"
            onClick={() => formik.setFieldValue('f4_2', indicatorSet.f4_2_calc)}
          >
            {`${gfcrIndicatorSetLanguage.f4_updateValue} ${indicatorSet.f4_2_calc}%`}
          </ButtonSecondary>
        )}
      </StyledInputRowQuestions>
      <StyledInputRowQuestions>
        <InputWithLabelAndValidation
          label={
            <>
              <b>F 4.3</b> {gfcrIndicatorSetLanguage.f4_3}
            </>
          }
          id="f4_3"
          type="number"
          unit="kg/ha"
          {...formik.getFieldProps('f4_3')}
          onBlur={(event) => handleInputBlur(formik, event, 'f4_3')}
          helperText={isAnnualReport && f43HelperText}
          showHelperText={true}
          onKeyDown={(event) => enforceNumberInput(event)}
        />
        {isAnnualReport && indicatorSet?.f4_3_calc && isF43UsingCalcValue && (
          <ButtonSecondary
            type="button"
            onClick={() => formik.setFieldValue('f4_3', indicatorSet.f4_3_calc)}
          >
            {`${gfcrIndicatorSetLanguage.f4_updateValue} ${indicatorSet.f4_3_calc}%`}
          </ButtonSecondary>
        )}
      </StyledInputRowQuestions>
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
