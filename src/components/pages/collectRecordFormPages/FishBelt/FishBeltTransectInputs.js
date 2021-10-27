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
  onSizeBinChange,
}) => {
  const { belttransectwidths, fishsizebins, reefslopes } = choices
  const transectWidthSelectOptions = getOptions(belttransectwidths)
  const fishSizeBinSelectOptions = getOptions(fishsizebins)
  const reefSlopeSelectOptions = getOptions(reefslopes)
  const validationsApiData = collectRecord?.validations?.results?.data
  const fishbelt_transect = validationsApiData?.fishbelt_transect
  const sample_event = validationsApiData?.sample_event

  return (
    <>
      <InputWrapper>
        <H2>Transect</H2>
        <InputWithLabelAndValidation
          label="Transect Number"
          id="number"
          type="number"
          {...getValidationPropertiesForInput(fishbelt_transect?.number)}
          {...formik.getFieldProps('number')}
        />
        <InputWithLabelAndValidation
          label="Label"
          id="label"
          type="text"
          {...getValidationPropertiesForInput(fishbelt_transect?.label)}
          {...formik.getFieldProps('label')}
        />
        <InputWithLabelAndValidation
          label="Transect Length Surveyed"
          id="len_surveyed"
          type="number"
          {...getValidationPropertiesForInput(fishbelt_transect?.len_surveyed)}
          {...formik.getFieldProps('len_surveyed')}
        />
        <InputRadioWithLabelAndValidation
          label="Width"
          id="width"
          options={transectWidthSelectOptions}
          {...getValidationPropertiesForInput(fishbelt_transect?.width)}
          {...formik.getFieldProps('width')}
        />
        <InputRadioWithLabelAndValidation
          label="Fish Size Bin"
          id="size_bin"
          name="fish-size-bin"
          options={fishSizeBinSelectOptions}
          {...getValidationPropertiesForInput(fishbelt_transect?.size_bin)}
          value={formik.values.size_bin}
          onChange={(event) => {
            onSizeBinChange(event)
          }}
        />
        <InputRadioWithLabelAndValidation
          label="Reef Slope"
          id="reef_slope"
          options={reefSlopeSelectOptions}
          {...getValidationPropertiesForInput(fishbelt_transect?.reef_slope)}
          {...formik.getFieldProps('reef_slope')}
        />
        <TextareaWithLabelAndValidation
          label="Notes"
          id="notes"
          {...getValidationPropertiesForInput(sample_event?.notes)}
          {...formik.getFieldProps('notes')}
        />
      </InputWrapper>
    </>
  )
}

FishBeltTransectForms.propTypes = {
  choices: choicesPropType.isRequired,
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  onSizeBinChange: PropTypes.func.isRequired,
}

FishBeltTransectForms.defaultProps = { collectRecord: undefined }

export default FishBeltTransectForms
