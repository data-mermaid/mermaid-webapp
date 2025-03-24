import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from '../../../../generic/buttons'
import { formikHandleNumericDecimalInputChange } from '../../../../../library/formikHandleInputTypes'
import { formikPropType } from '../../../../../library/formikPropType'
import { H2 } from '../../../../generic/text'
import { InputRow } from '../../../../generic/form'
import { StyledGfcrInputWrapper, StyledGfcrSubInputWrapper } from './subPages.styles'
import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../../../language'
import TextareaWithLabelAndValidation from '../../../../mermaidInputs/TextareaWithLabelAndValidation'
import theme from '../../../../../theme'

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

const { gfcrIndicatorSet: gfcrIndicatorSetLanguage } = language.pages

const F4Form = ({
  formik,
  handleInputBlur,
  handleInputFocus,
  indicatorSetType,
  indicatorSet,
  handleFormSubmit,
  displayHelp,
}) => {
  const [isUpdateFromCalc, setIsUpdateFromCalc] = useState(false)
  // Eventually 'annual_report' can be removed if we're sure there are no indicators sets with this value in the DB
  const isReport = indicatorSetType === 'report' || 'annual_report'

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
    f41ValueUpdateText = gfcrIndicatorSetLanguage.f4_valueFromMermaidData
  } else if (!isF41UsingCalcValue && indicatorSet?.f4_1_calc) {
    f41ValueUpdateText = (
      <>
        {gfcrIndicatorSetLanguage.f4_valueDifferentFromCalc}{' '}
        <strong>({indicatorSet.f4_1_calc})</strong>
      </>
    )
  } else if (!isF41UsingCalcValue && !indicatorSet?.f4_1_calc && !formik.values.f4_1) {
    f41ValueUpdateText = gfcrIndicatorSetLanguage.f4_noValue
  }

  if (isF42UsingCalcValue) {
    f42ValueUpdateText = gfcrIndicatorSetLanguage.f4_valueFromMermaidData
  } else if (!isF42UsingCalcValue && indicatorSet?.f4_2_calc) {
    f42ValueUpdateText = gfcrIndicatorSetLanguage.f4_valueDifferentFromCalc
  } else if (!isF42UsingCalcValue && !indicatorSet?.f4_2_calc && !formik.values.f4_2) {
    f42ValueUpdateText = gfcrIndicatorSetLanguage.f4_noValue
  }

  if (isF43UsingCalcValue) {
    f43ValueUpdateText = gfcrIndicatorSetLanguage.f4_valueFromMermaidData
  } else if (!isF43UsingCalcValue && indicatorSet?.f4_3_calc) {
    f43ValueUpdateText = gfcrIndicatorSetLanguage.f4_valueDifferentFromCalc
  } else if (!isF43UsingCalcValue && !indicatorSet?.f4_3_calc && !formik.values.f4_3) {
    f43ValueUpdateText = gfcrIndicatorSetLanguage.f4_noValue
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
      <H2>{gfcrIndicatorSetLanguage.f4Heading}</H2>
      {isReport && (
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
            <StyledButtonPrimary
              type="button"
              onClick={handleSaveAndUpdateValues}
              disabled={saveAndUpdateValuesButtonDisabled}
            >
              {gfcrIndicatorSetLanguage.f4_saveAndUpdateValues}
            </StyledButtonPrimary>
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
          onFocus={(event) => handleInputFocus(event)}
          helperText={gfcrIndicatorSetLanguage.getF4_1_helper()}
          showHelperText={displayHelp}
          onChange={(event) =>
            formikHandleNumericDecimalInputChange({ formik, event, fieldName: 'f4_1' })
          }
        />
        {isReport && <StyledValueUpdateText>{f41ValueUpdateText}</StyledValueUpdateText>}
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
          onFocus={(event) => handleInputFocus(event)}
          helperText={gfcrIndicatorSetLanguage.getF4_2_helper()}
          showHelperText={displayHelp}
          onChange={(event) =>
            formikHandleNumericDecimalInputChange({ formik, event, fieldName: 'f4_2' })
          }
        />
        {isReport && <StyledValueUpdateText>{f42ValueUpdateText}</StyledValueUpdateText>}
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
          onFocus={(event) => handleInputFocus(event)}
          helperText={gfcrIndicatorSetLanguage.getF4_3_helper()}
          showHelperText={displayHelp}
          onChange={(event) =>
            formikHandleNumericDecimalInputChange({ formik, event, fieldName: 'f4_3' })
          }
        />
        {isReport && <StyledValueUpdateText>{f43ValueUpdateText}</StyledValueUpdateText>}
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
  handleInputFocus: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  setInputToDefaultValue: PropTypes.func.isRequired,
  indicatorSetType: PropTypes.string.isRequired,
  displayHelp: PropTypes.bool,
}

export default F4Form
