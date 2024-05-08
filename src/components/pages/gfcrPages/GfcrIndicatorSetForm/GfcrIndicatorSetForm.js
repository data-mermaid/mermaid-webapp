import React from 'react'
import PropTypes from 'prop-types'
import { formikPropType } from '../../../../library/formikPropType'
import { F1Form, F2Form, F3Form, IndicatorSetForm } from './subForms'

const handleInputBlur = (formik, event, fieldName) => {
  const { value } = event.target

  if (value.trim() === '') {
    setInputToDefaultValue(formik, fieldName)
  }
}

const setInputToDefaultValue = (formik, fieldName) => {
  formik.setFieldValue(fieldName, formik.initialValues[fieldName])
}

const GfcrIndicatorSetForm = ({ formik, selectedNavItem }) => {
  return (
    <form id="indicator-set-form" onSubmit={formik.handleSubmit}>
      {selectedNavItem === 'indicator-set' && (
        <IndicatorSetForm
          formik={formik}
          handleInputBlur={handleInputBlur}
          setInputToDefaultValue={setInputToDefaultValue}
        />
      )}
      {selectedNavItem === 'f1' && <F1Form formik={formik} handleInputBlur={handleInputBlur} />}
      {selectedNavItem === 'f2' && <F2Form formik={formik} handleInputBlur={handleInputBlur} />}
      {selectedNavItem === 'f3' && <F3Form formik={formik} handleInputBlur={handleInputBlur} />}
    </form>
  )
}

GfcrIndicatorSetForm.propTypes = {
  formik: formikPropType.isRequired,
  selectedNavItem: PropTypes.string.isRequired,
}

export default GfcrIndicatorSetForm
