import React from 'react'
import { H2 } from '../generic/text'
import InputSelectWithLabelAndValidation from '../generic/InputSelectWithLabelAndValidation'
import InputWithLabelAndValidation from '../generic/InputWithLabelAndValidation'
import { formikPropType } from '../../library/formikHelpers/formikPropType'
import getValidationPropsFromFormik from '../../library/formikHelpers/getValidationPropsFromFormik'

/**
 * Describe your component
 */
const FishBeltTransectForms = ({ formik }) => {
  const emptyOption = [
    { label: 'Placeholder option 1', value: 'value 1' },
    { label: 'Placeholder option 2', value: 'value 2' },
    { label: 'Placeholder option 3', value: 'value 3' },
    { label: 'Placeholder option 4', value: 'value 4' },
  ]

  return (
    <>
      <H2>Transect</H2>

      <InputWithLabelAndValidation
        label="Transect Number"
        id="transectNumber"
        type="number"
        {...formik.getFieldProps('transectNumber')}
        {...getValidationPropsFromFormik(formik, 'transectNumber')}
      />
      <InputWithLabelAndValidation
        label="Label"
        id="label"
        type="text"
        {...formik.getFieldProps('label')}
        {...getValidationPropsFromFormik(formik, 'label')}
      />
      <InputWithLabelAndValidation
        label="Transect Length Surveyed"
        id="transectLengthSurveyed"
        type="number"
        {...formik.getFieldProps('transectLengthSurveyed')}
        {...getValidationPropsFromFormik(formik, 'transectLengthSurveyed')}
      />
      <InputSelectWithLabelAndValidation
        label="Width"
        id="width"
        options={emptyOption}
        {...formik.getFieldProps('width')}
        {...getValidationPropsFromFormik(formik, 'width')}
      />
      <InputSelectWithLabelAndValidation
        label="Fish Size Bin"
        id="fishSizeBin"
        options={emptyOption}
        {...formik.getFieldProps('fishSizeBin')}
        {...getValidationPropsFromFormik(formik, 'fishSizeBin')}
      />
      <InputSelectWithLabelAndValidation
        label="Reef Slope"
        id="reefSlope"
        options={emptyOption}
        {...formik.getFieldProps('reefSlope')}
        {...getValidationPropsFromFormik(formik, 'reefSlope')}
      />
      <InputWithLabelAndValidation
        label="Notes"
        id="notes"
        type="text-area"
        {...formik.getFieldProps('notes')}
        {...getValidationPropsFromFormik(formik, 'notes')}
      />
    </>
  )
}

FishBeltTransectForms.propTypes = {
  formik: formikPropType.isRequired,
}

export default FishBeltTransectForms
