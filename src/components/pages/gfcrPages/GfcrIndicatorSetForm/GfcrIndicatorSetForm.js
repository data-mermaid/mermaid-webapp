import React from 'react'
import PropTypes from 'prop-types'
import { formikPropType } from '../../../../library/formikPropType'
import {
  F1Form,
  F2Form,
  F3Form,
  F4Form,
  F5Form,
  F6Form,
  F7Form,
  IndicatorSetForm,
} from './subForms'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'

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
  isNewIndicatorSet,
}) => {
  return (
    <form id="indicator-set-form" onSubmit={formik.handleSubmit}>
      {selectedNavItem === 'indicator-set' && (
        <IndicatorSetForm
          formik={formik}
          handleInputBlur={handleInputBlur}
          setInputToDefaultValue={setInputToDefaultValue}
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
    </form>
  )
}

GfcrIndicatorSetForm.propTypes = {
  formik: formikPropType.isRequired,
  selectedNavItem: PropTypes.string.isRequired,
  indicatorSetType: PropTypes.string.isRequired,
  indicatorSet: PropTypes.object.isRequired,
  isNewIndicatorSet: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
}

export default GfcrIndicatorSetForm
