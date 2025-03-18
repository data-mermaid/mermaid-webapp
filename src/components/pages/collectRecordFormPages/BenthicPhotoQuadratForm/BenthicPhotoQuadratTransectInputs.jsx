import PropTypes from 'prop-types'
import React from 'react'

import {
  benthicpqtValidationPropType,
  choicesPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formik/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import { H2 } from '../../../generic/text'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import { InputWrapper } from '../../../generic/form'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'
import InputSelectWithLabelAndValidation from '../../../mermaidInputs/InputSelectWithLabelAndValidation'
import language from '../../../../language'

const DEPTH_VALIDATION_PATH = 'data.quadrat_transect.depth'
const LABEL_VALIDATION_PATH = 'data.quadrat_transect.label'
const LENGTH_SURVEYED_VALIDATION_PATH = 'data.quadrat_transect.len_surveyed'
const NOTES_VALIDATION_PATH = 'data.quadrat_transect.notes'
const NUM_POINTS_PER_QUADRAT_VALIDATION_PATH = 'data.quadrat_transect.num_points_per_quadrat'
const NUM_QUADRATS_VALIDATION_PATH = 'data.quadrat_transect.num_quadrats'
const QUADRAT_NUMBER_START_VALIDATION_PATH = 'data.quadrat_transect.quadrat_number_start'
const QUADRAT_SIZE_VALIDATION_PATH = 'data.quadrat_transect.quadrat_size'
const SAMPLE_TIME_VALIDATION_PATH = 'data.quadrat_transect.sample_time'
const TRANSECT_NUMBER_VALIDATION_PATH = 'data.quadrat_transect.number'
const VISIBILITY_VALIDATION_PATH = 'data.quadrat_transect.visibility'
const CURRENT_VALIDATION_PATH = 'data.quadrat_transect.current'
const RELATIVE_DEPTH_VALIDATION_PATH = 'data.quadrat_transect.relative_depth'
const TIDE_VALIDATION_PATH = 'data.quadrat_transect.tide'

const BenthicPhotoQuadratTransectInputs = ({
  areValidationsShowing,
  choices,
  formik,
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationsApiData,
  validationPropertiesWithDirtyResetOnInputChange,
}) => {
  const { currents, relativedepths, tides, visibilities } = choices

  const visibilityOptions = getOptions(visibilities.data)
  const currentOptions = getOptions(currents.data)
  const relativeDepthOptions = getOptions(relativedepths.data)
  const tideOptions = getOptions(tides.data)
  const quadrat_transect = validationsApiData?.quadrat_transect

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
    quadrat_transect?.notes,
    areValidationsShowing,
  )

  const handleTransectNumberChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'number',
      validationPath: TRANSECT_NUMBER_VALIDATION_PATH,
    })
  }
  const handleLabelChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'label',
      validationPath: LABEL_VALIDATION_PATH,
    })
  }
  const handleSampleTimeChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'sample_time',
      validationPath: SAMPLE_TIME_VALIDATION_PATH,
    })
  }
  const handleDepthChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'depth',
      validationPath: DEPTH_VALIDATION_PATH,
    })
  }
  const handleLengthSurveyedChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'len_surveyed',
      validationPath: LENGTH_SURVEYED_VALIDATION_PATH,
    })
  }
  const handleQuadratNumberStartChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'quadrat_number_start',
      validationPath: QUADRAT_NUMBER_START_VALIDATION_PATH,
    })
  }
  const handleQuadratSizeChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'quadrat_size',
      validationPath: QUADRAT_SIZE_VALIDATION_PATH,
    })
  }
  const handleNumberOfQuadratsChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'num_quadrats',
      validationPath: NUM_QUADRATS_VALIDATION_PATH,
    })
  }
  const handleNumberOfPointsPerQuadratChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'num_points_per_quadrat',
      validationPath: NUM_POINTS_PER_QUADRAT_VALIDATION_PATH,
    })
  }
  const handleVisibilityChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'visibility',
      validationPath: VISIBILITY_VALIDATION_PATH,
    })
  }
  const handleCurrentChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'current',
      validationPath: CURRENT_VALIDATION_PATH,
    })
  }
  const handleRelativeDepthChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'relative_depth',
      validationPath: RELATIVE_DEPTH_VALIDATION_PATH,
    })
  }
  const handleTideChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'tide',
      validationPath: TIDE_VALIDATION_PATH,
    })
  }

  const handleNotesChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'notes',
      validationPath: NOTES_VALIDATION_PATH,
    })
  }

  return (
    <>
      <InputWrapper>
        <H2>{language.pages.collectRecord.formSectionTitle.transect}</H2>
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
          helperText={language.helperText.transectNumber}
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
          helperText={language.helperText.label}
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
          helperText={language.helperText.sampleTime}
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
          unit="m"
          helperText={language.helperText.depth}
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
          unit="m"
          helperText={language.helperText.transectLengthSurveyed}
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
          {...quadratNumberStartValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.quadrat_number_start}
          onChange={handleQuadratNumberStartChange}
          helperText={language.helperText.quadratNumberStart}
        />
        <InputWithLabelAndValidation
          label="Quadrat Size"
          required={true}
          id="quadrat_size"
          testId="quadrat_size"
          type="number"
          unit="m²"
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
          helperText={language.helperText.quadratSize}
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
          helperText={language.helperText.numberOfQuadrats}
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
          helperText={language.helperText.numberOfPointsPerQuadrat}
        />
        <InputSelectWithLabelAndValidation
          label="Visibility"
          required={false}
          id="visibility"
          testId="visibility"
          options={visibilityOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: VISIBILITY_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: VISIBILITY_VALIDATION_PATH })
          }}
          {...visibilityValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(
            visibilityValidationProperties,
            'visibility',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.visibility}
          onChange={handleVisibilityChange}
          helperText={language.helperText.visibility}
        />
        <InputSelectWithLabelAndValidation
          label="Current"
          required={false}
          id="current"
          testId="current"
          options={currentOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: CURRENT_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: CURRENT_VALIDATION_PATH })
          }}
          {...currentValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(
            currentValidationProperties,
            'current',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.current}
          onChange={handleCurrentChange}
          helperText={language.helperText.current}
        />
        <InputSelectWithLabelAndValidation
          label="Relative Depth"
          required={false}
          id="relative_depth"
          testId="relative_depth"
          options={relativeDepthOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: RELATIVE_DEPTH_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: RELATIVE_DEPTH_VALIDATION_PATH })
          }}
          {...relativeDepthValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(
            relativeDepthValidationProperties,
            'relative_depth',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.relative_depth}
          onChange={handleRelativeDepthChange}
          helperText={language.helperText.getRelativeDepth()}
        />
        <InputSelectWithLabelAndValidation
          label="Tide"
          required={false}
          id="tide"
          testId="tide"
          options={tideOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: TIDE_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: TIDE_VALIDATION_PATH })
          }}
          {...tideValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(tideValidationProperties, 'tide')}
          onBlur={formik.handleBlur}
          value={formik.values.tide}
          onChange={handleTideChange}
          helperText={language.helperText.getTide()}
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
          helperText={language.helperText.notes}
        />
      </InputWrapper>
    </>
  )
}

BenthicPhotoQuadratTransectInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: PropTypes.shape({ quadrat_transect: benthicpqtValidationPropType })
    .isRequired,
  validationPropertiesWithDirtyResetOnInputChange: PropTypes.func.isRequired,
}

export default BenthicPhotoQuadratTransectInputs
