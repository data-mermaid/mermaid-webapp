import PropTypes from 'prop-types'
import React from 'react'

import { choicesPropType, fishBeltPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputRadioWithLabelAndValidation from '../../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'

const FishBeltTransectForms = ({
  areValidationsShowing,
  choices,
  collectRecord,
  formik,
  ignoreValidations,
  onSizeBinChange,
  resetValidations,
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
          testId="transect_number"
          type="number"
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.fishbelt_transect.number' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.fishbelt_transect.number' })
          }}
          {...getValidationPropertiesForInput(fishbelt_transect?.number, areValidationsShowing)}
          {...formik.getFieldProps('number')}
        />
        <InputWithLabelAndValidation
          label="Label"
          id="label"
          testId="label"
          type="text"
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.fishbelt_transect.label' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.fishbelt_transect.label' })
          }}
          {...getValidationPropertiesForInput(fishbelt_transect?.label, areValidationsShowing)}
          {...formik.getFieldProps('label')}
        />
        <InputWithLabelAndValidation
          label="Transect Length Surveyed"
          id="len_surveyed"
          testId="len_surveyed"
          type="number"
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.fishbelt_transect.len_surveyed' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.fishbelt_transect.len_surveyed' })
          }}
          {...getValidationPropertiesForInput(
            fishbelt_transect?.len_surveyed,
            areValidationsShowing,
          )}
          {...formik.getFieldProps('len_surveyed')}
        />
        <InputRadioWithLabelAndValidation
          label="Width"
          id="width"
          testId="width"
          options={transectWidthSelectOptions}
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.fishbelt_transect.width' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.fishbelt_transect.width' })
          }}
          {...getValidationPropertiesForInput(fishbelt_transect?.width, areValidationsShowing)}
          {...formik.getFieldProps('width')}
        />
        <InputRadioWithLabelAndValidation
          label="Fish Size Bin"
          id="size_bin"
          testId="size_bin"
          name="fish-size-bin"
          options={fishSizeBinSelectOptions}
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.fishbelt_transect.size_bin' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.fishbelt_transect.size_bin' })
          }}
          {...getValidationPropertiesForInput(fishbelt_transect?.size_bin, areValidationsShowing)}
          value={formik.values.size_bin}
          onChange={(event) => {
            onSizeBinChange(event)
          }}
        />
        <InputRadioWithLabelAndValidation
          label="Reef Slope"
          id="reef_slope"
          testId="reef_slope"
          options={reefSlopeSelectOptions}
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.fishbelt_transect.reef_slope' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.fishbelt_transect.reef_slope' })
          }}
          {...getValidationPropertiesForInput(fishbelt_transect?.reef_slope, areValidationsShowing)}
          {...formik.getFieldProps('reef_slope')}
        />
        <TextareaWithLabelAndValidation
          label="Notes"
          id="notes"
          testId="notes"
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.sample_event.notes' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.sample_event.notes' })
          }}
          {...getValidationPropertiesForInput(sample_event?.notes, areValidationsShowing)}
          {...formik.getFieldProps('notes')}
        />
      </InputWrapper>
    </>
  )
}

FishBeltTransectForms.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  ignoreValidations: PropTypes.func.isRequired,
  onSizeBinChange: PropTypes.func.isRequired,
  resetValidations: PropTypes.func.isRequired,
}

FishBeltTransectForms.defaultProps = { collectRecord: undefined }

export default FishBeltTransectForms
