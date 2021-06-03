import React from 'react'
import { choicesPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../library/formikPropType'
import InputWithLabelAndValidation from '../generic/InputWithLabelAndValidation'
import InputRadioWithLabelAndValidation from '../generic/InputRadioWithLabelAndValidation'
import InputAutocomplete from '../generic/InputAutocomplete'
import TextareaWithLabelAndValidation from '../generic/TextareaWithLabelAndValidation'
import { InputWrapper } from '../generic/form'

const SiteInputs = ({ formik, choices }) => {
  const countryOptions = choices.countries.data.map(({ name, id }) => ({
    label: name,
    value: id,
  }))

  const exposureOptions = choices.reefexposures.data.map(({ name, id }) => ({
    label: name,
    value: id,
  }))
  const reefTypeOptions = choices.reeftypes.data.map(({ name, id }) => ({
    label: name,
    value: id,
  }))
  const reefZoneOptions = choices.reefzones.data.map(({ name, id }) => ({
    label: name,
    value: id,
  }))

  return (
    <InputWrapper>
      <InputWithLabelAndValidation
        label="Name"
        id="name"
        type="text"
        {...formik.getFieldProps('name')}
      />
      <InputAutocomplete
        label="Country"
        id="country"
        options={countryOptions}
        value={formik.getFieldProps('country').value}
        onChange={(selectedItem) => formik.setFieldValue('country', selectedItem.value)}
      />
      <InputRadioWithLabelAndValidation
        label="Exposure"
        id="exposure"
        options={exposureOptions}
        {...formik.getFieldProps('exposure')}
      />
      <InputRadioWithLabelAndValidation
        label="Reef Type"
        id="reef_type"
        options={reefTypeOptions}
        {...formik.getFieldProps('reef_type')}
      />
      <InputRadioWithLabelAndValidation
        label="Reef Zone"
        id="reef_zone"
        options={reefZoneOptions}
        {...formik.getFieldProps('reef_zone')}
      />
      <TextareaWithLabelAndValidation
        label="Notes"
        id="notes"
        {...formik.getFieldProps('notes')}
      />
    </InputWrapper>
  )
}

SiteInputs.propTypes = {
  formik: formikPropType.isRequired,
  choices: choicesPropType.isRequired,
}

export default SiteInputs
