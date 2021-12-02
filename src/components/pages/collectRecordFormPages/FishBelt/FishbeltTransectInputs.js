import React from 'react'
import PropTypes from 'prop-types'

import { choicesPropType, fishBeltPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputRadioWithLabelAndValidation from '../../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'

const TRANSECT_NUMBER_VALIDATION_PATH = 'data.fishbelt_transect.number'
const LABEL_VALIDATION_PATH = 'data.fishbelt_transect.label'
const LENGHT_SURVEYED_VALIDATION_PATH = 'data.fishbelt_transect.len_surveyed'
const WIDTH_VALIDATION_PATH = 'data.fishbelt_transect.width'
const SIZE_BIN_VALIDATION_PATH = 'data.fishbelt_transect.size_bin'
const REEF_SLOPE_VALIDATION_PATH = 'data.fishbelt_transect.reef_slope'
const NOTES_VALIDATION_PATH = 'data.sample_event.notes'

const FishbeltTransectInputs = ({
  areValidationsShowing,
  choices,
  collectRecord,
  formik,
  handleChangeForDirtyIgnoredInput,
  ignoreNonObservationFieldValidations,
  onSizeBinChange,
  resetNonObservationFieldValidations,
}) => {
  const { belttransectwidths, fishsizebins, reefslopes } = choices
  const transectWidthSelectOptions = getOptions(belttransectwidths)
  const fishSizeBinSelectOptions = getOptions(fishsizebins)
  const reefSlopeSelectOptions = getOptions(reefslopes)
  const validationsApiData = collectRecord?.validations?.results?.data
  const fishbelt_transect = validationsApiData?.fishbelt_transect
  const sample_event = validationsApiData?.sample_event

  const transectNumberValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.number,
    areValidationsShowing,
  )

  const labelValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.label,
    areValidationsShowing,
  )
  const lengthSurveyedValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.len_surveyed,
    areValidationsShowing,
  )
  const widthValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.width,
    areValidationsShowing,
  )

  const sizeBinValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.size_bin,
    areValidationsShowing,
  )

  const reefSlopeValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.reef_slope,
    areValidationsShowing,
  )

  const notesValidationProperties = getValidationPropertiesForInput(
    sample_event?.notes,
    areValidationsShowing,
  )

  const handleTransectNumberChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'number',
      validationProperties: transectNumberValidationProperties,
      validationPath: TRANSECT_NUMBER_VALIDATION_PATH,
    })
  }

  const handleLabelChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'label',
      validationProperties: labelValidationProperties,
      validationPath: LABEL_VALIDATION_PATH,
    })
  }

  const handleLengthSurveyedChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'len_surveyed',
      validationProperties: lengthSurveyedValidationProperties,
      validationPath: LENGHT_SURVEYED_VALIDATION_PATH,
    })
  }
  const handleWidthChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'width',
      validationProperties: widthValidationProperties,
      validationPath: WIDTH_VALIDATION_PATH,
    })
  }
  const handleSizeBinChange = (event) => {
    onSizeBinChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'size_bin',
      validationProperties: sizeBinValidationProperties,
      validationPath: SIZE_BIN_VALIDATION_PATH,
    })
  }
  const handleReefSlopeChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'reef_slope',
      validationProperties: reefSlopeValidationProperties,
      validationPath: REEF_SLOPE_VALIDATION_PATH,
    })
  }
  const handleNotesChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'notes',
      validationProperties: notesValidationProperties,
      validationPath: NOTES_VALIDATION_PATH,
    })
  }

  return (
    <>
      <InputWrapper>
        <H2>Transect</H2>
        <InputWithLabelAndValidation
          label="Transect Number"
          id="number"
          testId="transect_number"
          type="number"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({
              validationPath: TRANSECT_NUMBER_VALIDATION_PATH,
            })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: TRANSECT_NUMBER_VALIDATION_PATH })
          }}
          {...transectNumberValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.number}
          onChange={handleTransectNumberChange}
        />
        <InputWithLabelAndValidation
          label="Label"
          id="label"
          testId="label"
          type="text"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: LABEL_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: LABEL_VALIDATION_PATH })
          }}
          {...labelValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.label}
          onChange={handleLabelChange}
        />
        <InputWithLabelAndValidation
          label="Transect Length Surveyed"
          id="len_surveyed"
          testId="len_surveyed"
          type="number"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({
              validationPath: LENGHT_SURVEYED_VALIDATION_PATH,
            })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: LENGHT_SURVEYED_VALIDATION_PATH })
          }}
          {...lengthSurveyedValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.len_surveyed}
          onChange={handleLengthSurveyedChange}
        />
        <InputRadioWithLabelAndValidation
          label="Width"
          id="width"
          testId="width"
          options={transectWidthSelectOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: WIDTH_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: WIDTH_VALIDATION_PATH })
          }}
          {...widthValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.width}
          name="width"
          onChange={handleWidthChange}
        />
        <InputRadioWithLabelAndValidation
          label="Fish Size Bin"
          id="size_bin"
          testId="size_bin"
          name="fish-size-bin"
          options={fishSizeBinSelectOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: SIZE_BIN_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: SIZE_BIN_VALIDATION_PATH })
          }}
          {...sizeBinValidationProperties}
          value={formik.values.size_bin}
          onChange={handleSizeBinChange}
        />
        <InputRadioWithLabelAndValidation
          label="Reef Slope"
          id="reef_slope"
          testId="reef_slope"
          options={reefSlopeSelectOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: REEF_SLOPE_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: REEF_SLOPE_VALIDATION_PATH })
          }}
          {...reefSlopeValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.reef_slope}
          name="reef_slope"
          onChange={handleReefSlopeChange}
        />
        <TextareaWithLabelAndValidation
          label="Notes"
          id="notes"
          testId="notes"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: NOTES_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: NOTES_VALIDATION_PATH })
          }}
          {...notesValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.notes}
          onChange={handleNotesChange}
        />
      </InputWrapper>
    </>
  )
}

FishbeltTransectInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  handleChangeForDirtyIgnoredInput: PropTypes.func.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  onSizeBinChange: PropTypes.func.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
}

FishbeltTransectInputs.defaultProps = {
  collectRecord: undefined,
}

export default FishbeltTransectInputs
