import PropTypes from 'prop-types'
import React from 'react'

import {
  choicesPropType,
  fishBeltPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputRadioWithLabelAndValidation from '../../../generic/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../generic/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../generic/TextareaWithLabelAndValidation'

const FishBeltTransectForms = ({
  choices,
  collectRecord,
  formik,
  onInputChange,
  onSizeBinChange,
}) => {
  const { belttransectwidths, fishsizebins, reefslopes } = choices
  const transectWidthSelectOptions = getOptions(belttransectwidths)
  const fishSizeBinSelectOptions = getOptions(fishsizebins)
  const reefSlopeSelectOptions = getOptions(reefslopes)

  const validations = collectRecord?.validations?.results

  return (
    <>
      <InputWrapper>
        <H2>Transect</H2>
        <InputWithLabelAndValidation
          label="Transect Number"
          id="number"
          type="number"
          {...formik.getFieldProps('number')}
          onChange={(event) => {
            onInputChange({
              event,
              inputValidationPropertyName: undefined,
            })
          }}
        />
        <InputWithLabelAndValidation
          label="Label"
          id="label"
          type="text"
          {...formik.getFieldProps('label')}
          onChange={(event) => {
            onInputChange({ event, inputValidationPropertyName: undefined })
          }}
        />
        <InputWithLabelAndValidation
          label="Transect Length Surveyed"
          id="len_surveyed"
          type="number"
          {...getValidationPropertiesForInput(validations?.len_surveyed)}
          {...formik.getFieldProps('len_surveyed')}
          onChange={(event) => {
            onInputChange({
              event,
              inputValidationPropertyName: 'len_surveyed',
            })
          }}
        />
        <InputRadioWithLabelAndValidation
          label="Width"
          id="width"
          options={transectWidthSelectOptions}
          {...formik.getFieldProps('width')}
          onChange={(event) => {
            onInputChange({ event, inputValidationPropertyName: undefined })
          }}
        />
        <InputRadioWithLabelAndValidation
          label="Fish Size Bin"
          id="size_bin"
          name="fish-size-bin"
          options={fishSizeBinSelectOptions}
          value={formik.values.size_bin}
          onChange={(event) => {
            onSizeBinChange({
              event,
              inputValidationPropertyName: undefined,
            })
          }}
        />
        <InputRadioWithLabelAndValidation
          label="Reef Slope"
          id="reef_slope"
          options={reefSlopeSelectOptions}
          {...formik.getFieldProps('reef_slope')}
          onChange={(event) => {
            onInputChange({ event, inputValidationPropertyName: undefined })
          }}
        />
        <TextareaWithLabelAndValidation
          label="Notes"
          id="notes"
          {...formik.getFieldProps('notes')}
          onChange={(event) => {
            onInputChange({ event, inputValidationPropertyName: undefined })
          }}
        />
      </InputWrapper>
    </>
  )
}

FishBeltTransectForms.propTypes = {
  choices: choicesPropType.isRequired,
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSizeBinChange: PropTypes.func.isRequired,
}

FishBeltTransectForms.defaultProps = { collectRecord: undefined }

export default FishBeltTransectForms
