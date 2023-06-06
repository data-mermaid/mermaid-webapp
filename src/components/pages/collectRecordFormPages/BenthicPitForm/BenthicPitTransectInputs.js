import React from 'react'
import PropTypes from 'prop-types'

import {
  benthicPitValidationPropType,
  choicesPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'
import InputSelectWithLabelAndValidation from '../../../mermaidInputs/InputSelectWithLabelAndValidation'

const CURRENT_VALIDATION_PATH = 'data.benthic_transect.current'
const DEPTH_VALIDATION_PATH = 'data.benthic_transect.depth'
const LABEL_VALIDATION_PATH = 'data.benthic_transect.label'
const LENGHT_SURVEYED_VALIDATION_PATH = 'data.benthic_transect.len_surveyed'
const NOTES_VALIDATION_PATH = 'data.benthic_transect.notes'
const REEF_SLOPE_VALIDATION_PATH = 'data.benthic_transect.reef_slope'
const RELATIVE_DEPTH_VALIDATION_PATH = 'data.benthic_transect.relative_depth'
const SAMPLE_TIME_VALIDATION_PATH = 'data.benthic_transect.sample_time'
const TIDE_VALIDATION_PATH = 'data.benthic_transect.tide'
const TRANSECT_NUMBER_VALIDATION_PATH = 'data.benthic_transect.number'
const VISIBILITY_VALIDATION_PATH = 'data.benthic_transect.visibility'
const INTERVAL_SIZE_VALIDATION_PATH = 'data.interval_size'
const INTERVAL_START_VALIDATION_PATH = 'data.interval_start'

const BenthicPitTransectInputs = ({
  areValidationsShowing,
  choices,
  formik,
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationsApiData,
  validationPropertiesWithDirtyResetOnInputChange,
}) => {
  const { reefslopes, relativedepths, visibilities, currents, tides } = choices

  const reefSlopeSelectOptions = getOptions(reefslopes.data)
  const relativeDepthOptions = getOptions(relativedepths.data)
  const visibilityOptions = getOptions(visibilities.data)
  const currentOptions = getOptions(currents.data)
  const tideOptions = getOptions(tides.data)
  const benthic_transect = validationsApiData?.benthic_transect

  const transectNumberValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.number,
    areValidationsShowing,
  )

  const labelValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.label,
    areValidationsShowing,
  )
  const lengthSurveyedValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.len_surveyed,
    areValidationsShowing,
  )

  const reefSlopeValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.reef_slope,
    areValidationsShowing,
  )
  const relativeDepthValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.relative_depth,
    areValidationsShowing,
  )
  const visibilityValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.visibility,
    areValidationsShowing,
  )
  const currentValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.current,
    areValidationsShowing,
  )
  const tideValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.tide,
    areValidationsShowing,
  )

  const notesValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.notes,
    areValidationsShowing,
  )

  const sampleTimeValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.sample_time,
    areValidationsShowing,
  )

  const depthValidationProperties = getValidationPropertiesForInput(
    benthic_transect?.depth,
    areValidationsShowing,
  )

  const intervalSizeValidationProperties = getValidationPropertiesForInput(
    validationsApiData?.interval_size,
    areValidationsShowing,
  )

  const intervalStartValidationProperties = getValidationPropertiesForInput(
    validationsApiData?.interval_start,
    areValidationsShowing,
  )

  const handleTransectNumberChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: TRANSECT_NUMBER_VALIDATION_PATH,
    })
  }

  const handleLabelChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: LABEL_VALIDATION_PATH,
    })
  }

  const handleLengthSurveyedChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: LENGHT_SURVEYED_VALIDATION_PATH,
    })
  }

  const handleReefSlopeChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: REEF_SLOPE_VALIDATION_PATH,
    })
  }
  const handleRelativeDepthChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: RELATIVE_DEPTH_VALIDATION_PATH,
    })
  }
  const handleVisibilityChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: VISIBILITY_VALIDATION_PATH,
    })
  }
  const handleCurrentChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: CURRENT_VALIDATION_PATH,
    })
  }

  const handleNotesChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: NOTES_VALIDATION_PATH,
    })
  }
  const handleTideChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: TIDE_VALIDATION_PATH,
    })
  }

  const handleSampleTimeChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: SAMPLE_TIME_VALIDATION_PATH,
    })
  }

  const handleDepthChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: DEPTH_VALIDATION_PATH,
    })
  }

  const handleIntervalSizeChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: INTERVAL_SIZE_VALIDATION_PATH,
    })
  }

  const handleIntervalStartChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      validationPath: INTERVAL_START_VALIDATION_PATH,
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
          unit="m"
        />
        <InputWithLabelAndValidation
          label="Transect Length Surveyed"
          required={true}
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
          {...validationPropertiesWithDirtyResetOnInputChange(
            lengthSurveyedValidationProperties,
            'len_surveyed',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.len_surveyed}
          onChange={handleLengthSurveyedChange}
          unit="m"
        />
        <InputWithLabelAndValidation
          label="Interval Size"
          required={true}
          id="interval_size"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: INTERVAL_SIZE_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: INTERVAL_SIZE_VALIDATION_PATH })
          }}
          testId="interval_size"
          type="number"
          {...validationPropertiesWithDirtyResetOnInputChange(
            intervalSizeValidationProperties,
            'interval_size',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.interval_size}
          onChange={handleIntervalSizeChange}
          unit="m"
        />
        <InputWithLabelAndValidation
          label="Interval Start"
          required={true}
          id="interval_start"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({
              validationPath: INTERVAL_START_VALIDATION_PATH,
            })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: INTERVAL_START_VALIDATION_PATH })
          }}
          testId="interval_start"
          type="number"
          {...validationPropertiesWithDirtyResetOnInputChange(
            intervalStartValidationProperties,
            'interval_start',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.interval_start}
          onChange={handleIntervalStartChange}
          unit="m"
        />
        <InputSelectWithLabelAndValidation
          label="Reef Slope"
          required={false}
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
          {...validationPropertiesWithDirtyResetOnInputChange(
            reefSlopeValidationProperties,
            'reef_slope',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.reef_slope}
          onChange={handleReefSlopeChange}
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

BenthicPitTransectInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: benthicPitValidationPropType.isRequired,
  validationPropertiesWithDirtyResetOnInputChange: PropTypes.func.isRequired,
}

export default BenthicPitTransectInputs
