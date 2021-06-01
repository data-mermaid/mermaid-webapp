import React from 'react'
import { choicesPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../library/formikPropType'
import InputWithLabelAndValidation from '../generic/InputWithLabelAndValidation'
import InputAutocomplete from '../generic/InputAutocomplete'
import { InputWrapper } from '../generic/form'

const SiteInputs = ({ formik, choices }) => {
  const countryOptions = choices.countries.data.map(({ name, id }) => ({
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
        {...formik.getFieldProps('country')}
      />
    </InputWrapper>
  )
}

SiteInputs.propTypes = {
  formik: formikPropType.isRequired,
  choices: choicesPropType.isRequired,
}

export default SiteInputs
