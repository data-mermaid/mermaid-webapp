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

const handleInputFocus = (event) => {
  const { value } = event.target

  if (value === '0') {
    event.target.select()
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
  setSelectedNavItem,
  indicatorSetType,
  indicatorSet,
  setIndicatorSet,
  handleFormSubmit,
  isNewIndicatorSet,
  choices,
  displayHelp,
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
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f1' && (
            <F1Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              handleInputFocus={handleInputFocus}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f2' && (
            <F2Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              handleInputFocus={handleInputFocus}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f3' && (
            <F3Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              handleInputFocus={handleInputFocus}
              getFieldValueTotal={getFieldValueTotal}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f4' && (
            <F4Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              handleInputFocus={handleInputFocus}
              indicatorSetType={indicatorSetType}
              indicatorSet={indicatorSet}
              setInputToDefaultValue={setInputToDefaultValue}
              handleFormSubmit={handleFormSubmit}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f5' && (
            <F5Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              handleInputFocus={handleInputFocus}
              getFieldValueTotal={getFieldValueTotal}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f6' && (
            <F6Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              handleInputFocus={handleInputFocus}
              getFieldValueTotal={getFieldValueTotal}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f7' && (
            <F7Form
              formik={formik}
              handleInputBlur={handleInputBlur}
              handleInputFocus={handleInputFocus}
              getFieldValueTotal={getFieldValueTotal}
              displayHelp={displayHelp}
            />
          )}
        </StyledForm>
      )}
      {selectedNavItem === 'finance-solutions' && (
        <FinanceSolutions
          indicatorSet={indicatorSet}
          setIndicatorSet={setIndicatorSet}
          choices={choices}
          displayHelp={displayHelp}
        />
      )}
      {selectedNavItem === 'investments' && (
        <Investments
          indicatorSet={indicatorSet}
          setIndicatorSet={setIndicatorSet}
          choices={choices}
          setSelectedNavItem={setSelectedNavItem}
          displayHelp={displayHelp}
        />
      )}
      {selectedNavItem === 'revenues' && (
        <Revenues
          indicatorSet={indicatorSet}
          setIndicatorSet={setIndicatorSet}
          choices={choices}
          setSelectedNavItem={setSelectedNavItem}
          displayHelp={displayHelp}
        />
      )}
    </>
  )
}

GfcrIndicatorSetForm.propTypes = {
  formik: formikPropType.isRequired,
  selectedNavItem: PropTypes.string.isRequired,
  setSelectedNavItem: PropTypes.func.isRequired,
  indicatorSetType: PropTypes.string,
  indicatorSet: PropTypes.object.isRequired,
  setIndicatorSet: PropTypes.func.isRequired,
  isNewIndicatorSet: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  choices: choicesPropType,
  displayHelp: PropTypes.bool,
}

export default GfcrIndicatorSetForm
