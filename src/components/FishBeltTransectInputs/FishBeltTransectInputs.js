import React from 'react'
import { choicesPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../library/formikHelpers/formikPropType'
import { H2 } from '../generic/text'
import getValidationPropsFromFormik from '../../library/formikHelpers/getValidationPropsFromFormik'
import InputSelectWithLabelAndValidation from '../generic/InputSelectWithLabelAndValidation'
import InputWithLabelAndValidation from '../generic/InputWithLabelAndValidation'

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
        id="number"
        type="number"
        {...formik.getFieldProps('number')}
        {...getValidationPropsFromFormik(formik, 'number')}
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
        id="len_surveyed"
        type="number"
        {...formik.getFieldProps('len_surveyed')}
        {...getValidationPropsFromFormik(formik, 'len_surveyed')}
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
        id="size_bin"
        options={fishSizeBinSelectOptions}
        {...formik.getFieldProps('size_bin')}
        {...getValidationPropsFromFormik(formik, 'size_bin')}
      />
      <InputSelectWithLabelAndValidation
        label="Reef Slope"
        id="reef_slope"
        options={reefSlopeSelectOptions}
        {...formik.getFieldProps('reef_slope')}
        {...getValidationPropsFromFormik(formik, 'reef_slope')}
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
