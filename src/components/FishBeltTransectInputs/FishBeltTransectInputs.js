import React from 'react'
import { choicesPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../library/formikPropType'
import { H2 } from '../generic/text'
import { InputWrapper } from '../generic/form'
import InputRadioWithLabelAndValidation from '../generic/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../generic/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../generic/TextareaWithLabelAndValidation'
import { getOptions } from '../../library/getOptions'

const FishBeltTransectForms = ({ formik, choices }) => {
  const { belttransectwidths, fishsizebins, reefslopes } = choices
  const transectWidthSelectOptions = getOptions(belttransectwidths)
  const fishSizeBinSelectOptions = getOptions(fishsizebins)
  const reefSlopeSelectOptions = getOptions(reefslopes)

  return (
    <>
      <InputWrapper>
        <H2>Transect</H2>
        <InputWithLabelAndValidation
          label="Transect Number"
          id="number"
          type="number"
          {...formik.getFieldProps('number')}
        />
        <InputWithLabelAndValidation
          label="Label"
          id="label"
          type="text"
          {...formik.getFieldProps('label')}
        />
        <InputWithLabelAndValidation
          label="Transect Length Surveyed"
          id="len_surveyed"
          type="number"
          {...formik.getFieldProps('len_surveyed')}
        />
        <InputRadioWithLabelAndValidation
          label="Width"
          id="width"
          options={transectWidthSelectOptions}
          {...formik.getFieldProps('width')}
        />
        <InputRadioWithLabelAndValidation
          label="Fish Size Bin"
          id="size_bin"
          options={fishSizeBinSelectOptions}
          {...formik.getFieldProps('size_bin')}
        />
        <InputRadioWithLabelAndValidation
          label="Reef Slope"
          id="reef_slope"
          options={reefSlopeSelectOptions}
          {...formik.getFieldProps('reef_slope')}
        />
        <TextareaWithLabelAndValidation
          label="Notes"
          id="notes"
          {...formik.getFieldProps('notes')}
        />
      </InputWrapper>
    </>
  )
}

FishBeltTransectForms.propTypes = {
  formik: formikPropType.isRequired,
  choices: choicesPropType.isRequired,
}

export default FishBeltTransectForms
