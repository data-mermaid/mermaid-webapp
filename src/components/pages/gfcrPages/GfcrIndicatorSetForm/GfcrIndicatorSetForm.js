import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { formikPropType } from '../../../../library/formikPropType'
import {
  F1Form,
  F2Form,
  F3Form,
  F4Form,
  F5Form,
  F6Form,
  F7Form,
  ReportTitleAndDateForm,
} from './subPages'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import FinanceSolutions from './subPages/FinanceSolutions'
import { choicesPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import Investments from './subPages/Investments'
import Revenues from './subPages/Revenues'

const StyledForm = styled.form`
  width: 100%;
`

const handleInputBlur = (formik, event, fieldName, isRoundTo1DP = false) => {
  const { value } = event.target
  if (value.trim() === '') {
    setInputToDefaultValue(formik, fieldName)
  }
  const valueAsNumber = Number(value)

  if (value && isRoundTo1DP && !Number.isInteger(valueAsNumber)) {
    formik.setFieldValue(fieldName, Number(roundToOneDecimal(valueAsNumber)))
  }
}

const getFieldValueTotal = (fieldValue1, fieldValue2) => {
  return parseInt(fieldValue1) + parseInt(fieldValue2)
}

const setInputToDefaultValue = (formik, fieldName) => {
  formik.setFieldValue(fieldName, formik.initialValues[fieldName])
}

const GfcrIndicatorSetForm = ({
  formik,
  selectedNavItem,
  indicatorSetType,
  indicatorSet,
  handleFormSubmit,
  handleFinanceSolutionSubmit,
  handleFinanceSolutionDelete,
  handleInvestmentSubmit,
  handleInvestmentDelete,
  handleRevenueSubmit,
  handleRevenueDelete,
  isNewIndicatorSet,
  choices,
}) => {
  return (
    <>
      {!['finance-solutions'].includes(selectedNavItem) && (
        <StyledForm id="gfcr-indicator-set-form" onSubmit={formik.handleSubmit}>
          {selectedNavItem === 'report-title-and-year' && (
            <ReportTitleAndDateForm
              formik={formik}
              handleInputBlur={handleInputBlur}
              isNewIndicatorSet={isNewIndicatorSet}
            />
          )}
          {selectedNavItem === 'f1' && <F1Form formik={formik} handleInputBlur={handleInputBlur} />}
          {selectedNavItem === 'f2' && <F2Form formik={formik} handleInputBlur={handleInputBlur} />}
          {selectedNavItem === 'f3' && (
            <F3Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              getFieldValueTotal={getFieldValueTotal}
            />
          )}
          {selectedNavItem === 'f4' && (
            <F4Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              indicatorSetType={indicatorSetType}
              indicatorSet={indicatorSet}
              setInputToDefaultValue={setInputToDefaultValue}
              handleFormSubmit={handleFormSubmit}
            />
          )}
          {selectedNavItem === 'f5' && (
            <F5Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              getFieldValueTotal={getFieldValueTotal}
            />
          )}
          {selectedNavItem === 'f6' && (
            <F6Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              getFieldValueTotal={getFieldValueTotal}
            />
          )}
          {selectedNavItem === 'f7' && (
            <F7Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              getFieldValueTotal={getFieldValueTotal}
            />
          )}
        </StyledForm>
      )}
      {selectedNavItem === 'finance-solutions' && (
        <FinanceSolutions
          indicatorSet={indicatorSet}
          choices={choices}
          onSubmit={handleFinanceSolutionSubmit}
          onDelete={handleFinanceSolutionDelete}
        />
      )}
      {selectedNavItem === 'investments' && (
        <Investments
          indicatorSet={indicatorSet}
          choices={choices}
          onSubmit={handleInvestmentSubmit}
          onDelete={handleInvestmentDelete}
        />
      )}
      {selectedNavItem === 'revenues' && (
        <Revenues
          indicatorSet={indicatorSet}
          choices={choices}
          onSubmit={handleRevenueSubmit}
          onDelete={handleRevenueDelete}
        />
      )}
    </>
  )
}

GfcrIndicatorSetForm.propTypes = {
  formik: formikPropType.isRequired,
  selectedNavItem: PropTypes.string.isRequired,
  indicatorSetType: PropTypes.string,
  indicatorSet: PropTypes.object.isRequired,
  isNewIndicatorSet: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  handleFinanceSolutionSubmit: PropTypes.func.isRequired,
  handleFinanceSolutionDelete: PropTypes.func.isRequired,
  handleInvestmentSubmit: PropTypes.func.isRequired,
  handleInvestmentDelete: PropTypes.func.isRequired,
  handleRevenueSubmit: PropTypes.func.isRequired,
  handleRevenueDelete: PropTypes.func.isRequired,
  choices: choicesPropType,
}

export default GfcrIndicatorSetForm
