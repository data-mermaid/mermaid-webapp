import PropTypes from 'prop-types'
import React from 'react'

import {
  benthicPhotoQuadratPropType,
  choicesPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import { H2 } from '../../../generic/text'
import InputRadioWithLabelAndValidation from '../../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import { InputWrapper } from '../../../generic/form'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'

const DEPTH_VALIDATION_PATH = 'data.quadrat_transect.depth'
const LABEL_VALIDATION_PATH = 'data.quadrat_transect.label'
const LENGTH_SURVEYED_VALIDATION_PATH = 'data.quadrat_transect.len_surveyed'
const NOTES_VALIDATION_PATH = 'data.sample_event.notes'
const NUM_POINTS_PER_QUADRAT_VALIDATION_PATH = 'data.quadrat_transect.num_points_per_quadrat'
const NUM_QUADRATS_VALIDATION_PATH = 'data.quadrat_transect.num_quadrat'
const QUADRAT_NUMBER_START_VALIDATION_PATH = 'data.quadrat_transect.quadrat_number_start'
const QUADRAT_SIZE_VALIDATION_PATH = 'data.quadrat_transect.quadrat_size'
const SAMPLE_TIME_VALIDATION_PATH = 'data.quadrat_transect.sample_time'
const TRANSECT_NUMBER_VALIDATION_PATH = 'data.quadrat_transect.number'
const VISIBILITY_VALIDATION_PATH = 'data.quadrat_transect.visibility'
const CURRENT_VALIDATION_PATH = 'data.quadrat_transect.current'
const RELATIVE_DEPTH_VALIDATION_PATH = 'data.quadrat_transect.relative_depth'
const TIDE_VALIDATION_PATH = 'data.quadrat_transect.tide'

const TransectInputs = ({
  areValidationsShowing,
  collectRecord,
  choices,
  formik,
  handleChangeForDirtyIgnoredInput,
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationPropertiesWithDirtyResetOnInputChange,
}) => {
  const { currents, relativedepths, tides, visibilities } = choices

  const currentOptions = [...getOptions(currents), { label: 'not reported', value: '' }]
  const relativeDepthOptions = [...getOptions(relativedepths), { label: 'not reported', value: '' }]
  const tideOptions = [...getOptions(tides), { label: 'not reported', value: '' }]
  const visibilityOptions = [...getOptions(visibilities), { label: 'not reported', value: '' }]
  const validationsApiData = collectRecord?.validations?.results?.data
  const quadrat_transect = validationsApiData?.quadrat_transect
  const sample_event = validationsApiData?.sample_event

  const transectNumberValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.number,
    areValidationsShowing,
  )
  const labelValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.label,
    areValidationsShowing,
  )
  const sampleTimeValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.sample_time,
    areValidationsShowing,
  )
  const depthValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.depth,
    areValidationsShowing,
  )
  const lengthSurveyedValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.len_surveyed,
    areValidationsShowing,
  )
  const quadratNumberStartValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.quadrat_number_start,
    areValidationsShowing,
  )
  const quadratSizeValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.quadrat_size,
    areValidationsShowing,
  )
  const numberOfQuadratsValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.num_quadrats,
    areValidationsShowing,
  )
  const numberOfPointsPerQuadratValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.num_points_per_quadrat,
    areValidationsShowing,
  )
  const visibilityValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.visibility,
    areValidationsShowing,
  )
  const currentValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.current,
    areValidationsShowing,
  )
  const relativeDepthValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.relative_depth,
    areValidationsShowing,
  )
  const tideValidationProperties = getValidationPropertiesForInput(
    quadrat_transect?.tide,
    areValidationsShowing,
  )

  const notesValidationProperties = getValidationPropertiesForInput(
    sample_event?.notes,
    areValidationsShowing,
  )

  const handleTransectNumberChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'number',
      validationProperties: transectNumberValidationProperties,
      validationPath: TRANSECT_NUMBER_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleLabelChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'label',
      validationProperties: labelValidationProperties,
      validationPath: LABEL_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleSampleTimeChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'sample_time',
      validationProperties: sampleTimeValidationProperties,
      validationPath: SAMPLE_TIME_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleDepthChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'depth',
      validationProperties: depthValidationProperties,
      validationPath: DEPTH_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleLengthSurveyedChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'len_surveyed',
      validationProperties: lengthSurveyedValidationProperties,
      validationPath: LENGTH_SURVEYED_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleQuadratNumberStartChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'quadrat_number_start',
      validationProperties: quadratNumberStartValidationProperties,
      validationPath: QUADRAT_NUMBER_START_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleQuadratSizeChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'quadrat_size',
      validationProperties: quadratSizeValidationProperties,
      validationPath: QUADRAT_SIZE_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleNumberOfQuadratsChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'num_quadrats',
      validationProperties: numberOfQuadratsValidationProperties,
      validationPath: NUM_QUADRATS_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleNumberOfPointsPerQuadratChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'num_points_per_quadrat',
      validationProperties: numberOfPointsPerQuadratValidationProperties,
      validationPath: NUM_POINTS_PER_QUADRAT_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleVisibilityChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'visibility',
      validationProperties: visibilityValidationProperties,
      validationPath: VISIBILITY_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleCurrentChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'current',
      validationProperties: currentValidationProperties,
      validationPath: CURRENT_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleRelativeDepthChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'relative_depth',
      validationProperties: relativeDepthValidationProperties,
      validationPath: RELATIVE_DEPTH_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }
  const handleTideChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'tide',
      validationProperties: tideValidationProperties,
      validationPath: TIDE_VALIDATION_PATH,
    })
    formik.handleChange(event)
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
          required={true}
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
          {...validationPropertiesWithDirtyResetOnInputChange(
            transectNumberValidationProperties,
            'number',
          )}
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
          label="Sample Time"
          id="sample_time"
          testId="sample_time"
          type="time"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: SAMPLE_TIME_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: SAMPLE_TIME_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            sampleTimeValidationProperties,
            'sample_time',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.sample_time}
          onChange={handleSampleTimeChange}
        />
        <InputWithLabelAndValidation
          label="Depth"
          required={true}
          id="depth"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: DEPTH_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: DEPTH_VALIDATION_PATH })
          }}
          testId="depth"
          type="number"
          {...validationPropertiesWithDirtyResetOnInputChange(depthValidationProperties, 'depth')}
          onBlur={formik.handleBlur}
          value={formik.values.depth}
          onChange={handleDepthChange}
        />
        <InputWithLabelAndValidation
          label="Transect Length Surveyed"
          required={true}
          id="len_surveyed"
          testId="len_surveyed"
          type="number"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({
              validationPath: LENGTH_SURVEYED_VALIDATION_PATH,
            })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: LENGTH_SURVEYED_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            lengthSurveyedValidationProperties,
            'len_surveyed',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.len_surveyed}
          onChange={handleLengthSurveyedChange}
        />
        <InputWithLabelAndValidation
          label="Quadrat Number Start"
          required={true}
          id="quadrat_number_start"
          testId="quadrat_number_start"
          type="number"
          step="any"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({
              validationPath: QUADRAT_NUMBER_START_VALIDATION_PATH,
            })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({
              validationPath: QUADRAT_NUMBER_START_VALIDATION_PATH,
            })
          }}
          {...quadratSizeValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.quadrat_number_start}
          onChange={handleQuadratNumberStartChange}
        />
        <InputWithLabelAndValidation
          label="Quadrat Size"
          required={true}
          id="quadrat_size"
          testId="quadrat_size"
          type="number"
          unit="m2"
          step="any"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: QUADRAT_SIZE_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: QUADRAT_SIZE_VALIDATION_PATH })
          }}
          {...quadratSizeValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.quadrat_size}
          onChange={handleQuadratSizeChange}
        />
        <InputWithLabelAndValidation
          label="Number of Quadrats"
          required={true}
          id="num_quadrats"
          testId="num_quadrats"
          type="number"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: NUM_QUADRATS_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: NUM_QUADRATS_VALIDATION_PATH })
          }}
          {...numberOfQuadratsValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.num_quadrats}
          onChange={handleNumberOfQuadratsChange}
        />
        <InputWithLabelAndValidation
          label="Number of Points per Quadrat"
          required={true}
          id="num_points_per_quadrat"
          testId="num_points_per_quadrat"
          type="number"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({
              validationPath: NUM_POINTS_PER_QUADRAT_VALIDATION_PATH,
            })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({
              validationPath: NUM_POINTS_PER_QUADRAT_VALIDATION_PATH,
            })
          }}
          {...numberOfPointsPerQuadratValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.num_points_per_quadrat}
          onChange={handleNumberOfPointsPerQuadratChange}
        />
        <InputRadioWithLabelAndValidation
          label="Visibility"
          id="visibility"
          name="visibility"
          testId="visibility"
          options={visibilityOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: VISIBILITY_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: VISIBILITY_VALIDATION_PATH })
          }}
          {...visibilityValidationProperties}
          value={formik.values.visibility}
          onBlur={formik.handleBlur}
          onChange={handleVisibilityChange}
        />
        <InputRadioWithLabelAndValidation
          label="Current"
          id="current"
          name="current"
          testId="current"
          options={currentOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: CURRENT_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: CURRENT_VALIDATION_PATH })
          }}
          {...currentValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.current}
          onChange={handleCurrentChange}
        />
        <InputRadioWithLabelAndValidation
          label="Relative Depth"
          id="relative_depth"
          name="relative_depth"
          testId="relative_depth"
          options={relativeDepthOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: RELATIVE_DEPTH_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: RELATIVE_DEPTH_VALIDATION_PATH })
          }}
          {...relativeDepthValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.relative_depth}
          onChange={handleRelativeDepthChange}
        />
        <InputRadioWithLabelAndValidation
          label="Tide"
          id="tide"
          name="tide"
          testId="tide"
          options={tideOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: TIDE_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: TIDE_VALIDATION_PATH })
          }}
          {...tideValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.tide}
          onChange={handleTideChange}
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

TransectInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  collectRecord: benthicPhotoQuadratPropType,
  choices: choicesPropType.isRequired,
  formik: formikPropType.isRequired,
  handleChangeForDirtyIgnoredInput: PropTypes.func.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  validationPropertiesWithDirtyResetOnInputChange: PropTypes.func.isRequired,
}

TransectInputs.defaultProps = {
  collectRecord: undefined,
}

export default TransectInputs
