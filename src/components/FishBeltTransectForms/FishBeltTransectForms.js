import React from 'react'
import { H2 } from '../generic/text'
import InputSelectWithLabelAndValidation from '../generic/InputSelectWithLabelAndValidation'
import InputWithLabelAndValidation from '../generic/InputWithLabelAndValidation'
import { formikPropType } from '../../library/formikHelpers/formikPropType'
import getValidationPropsFromFormik from '../../library/formikHelpers/getValidationPropsFromFormik'
import { choicesPropType } from '../../library/mermaidData/mermaidDataProptypes'

/**
 * Describe your component
 */
const FishBeltTransectForms = ({ formik, choices }) => {
  const { belttransectwidths, fishsizebins, reefslopes } = choices

  const transectWidthSelectOptions = belttransectwidths.data.map(
    ({ name, id }) => ({
      label: name,
      value: id,
    }),
  )
  const fishSizeBinSelectOptions = fishsizebins.data.map(({ name, id }) => ({
    label: name,
    value: id,
  }))
  const reefSlopeSelectOptions = reefslopes.data.map(({ name, id }) => ({
    label: name,
    value: id,
  }))

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
        options={transectWidthSelectOptions}
        {...formik.getFieldProps('width')}
        {...getValidationPropsFromFormik(formik, 'width')}
      />
      <InputSelectWithLabelAndValidation
        label="Fish Size Bin"
        id="fishSizeBin"
        options={fishSizeBinSelectOptions}
        {...formik.getFieldProps('fishSizeBin')}
        {...getValidationPropsFromFormik(formik, 'fishSizeBin')}
      />
      <InputSelectWithLabelAndValidation
        label="Reef Slope"
        id="reefSlope"
        options={reefSlopeSelectOptions}
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
  choices: choicesPropType.isRequired,
}

export default FishBeltTransectForms
