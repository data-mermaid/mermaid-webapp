import React from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import { formikPropType } from '../../../../library/formik/formikPropType'
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
import FinanceSolutions from './subPages/FinanceSolutions'
import { choicesPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import Investments from './subPages/Investments'
import Revenues from './subPages/Revenues'

const StyledForm = styled.form`
  width: 100%;
`

const handleInputFocus = (event) => {
  const { value } = event.target

  if (value === '0') {
    event.target.select()
  }
}

const getFieldValueTotal = (fieldValue1, fieldValue2) => {
  return parseInt(fieldValue1) + parseInt(fieldValue2)
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
              isNewIndicatorSet={isNewIndicatorSet}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f1' && (
            <F1Form formik={formik} handleInputFocus={handleInputFocus} displayHelp={displayHelp} />
          )}
          {selectedNavItem === 'f2' && (
            <F2Form formik={formik} handleInputFocus={handleInputFocus} displayHelp={displayHelp} />
          )}
          {selectedNavItem === 'f3' && (
            <F3Form
              formik={formik}
              handleInputFocus={handleInputFocus}
              getFieldValueTotal={getFieldValueTotal}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f4' && (
            <F4Form
              formik={formik}
              handleInputFocus={handleInputFocus}
              indicatorSetType={indicatorSetType}
              indicatorSet={indicatorSet}
              handleFormSubmit={handleFormSubmit}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f5' && (
            <F5Form
              formik={formik}
              handleInputFocus={handleInputFocus}
              getFieldValueTotal={getFieldValueTotal}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f6' && (
            <F6Form
              formik={formik}
              handleInputFocus={handleInputFocus}
              getFieldValueTotal={getFieldValueTotal}
              displayHelp={displayHelp}
            />
          )}
          {selectedNavItem === 'f7' && (
            <F7Form
              formik={formik}
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
