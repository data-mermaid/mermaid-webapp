import React from 'react'
import PropTypes from 'prop-types'

import {
  choicesPropType,
  fishbeltValidationPropType,
  observationsReducerPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputRadioWithLabelAndValidation from '../../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import language from '../../../../language'

const CURRENT_VALIDATION_PATH = 'data.fishbelt_transect.current'
const DEPTH_VALIDATION_PATH = 'data.fishbelt_transect.depth'
const LABEL_VALIDATION_PATH = 'data.fishbelt_transect.label'
const LENGHT_SURVEYED_VALIDATION_PATH = 'data.fishbelt_transect.len_surveyed'
const NOTES_VALIDATION_PATH = 'data.fishbelt_transect.notes'
const REEF_SLOPE_VALIDATION_PATH = 'data.fishbelt_transect.reef_slope'
const RELATIVE_DEPTH_VALIDATION_PATH = 'data.fishbelt_transect.relative_depth'
const SAMPLE_TIME_VALIDATION_PATH = 'data.fishbelt_transect.sample_time'
const SIZE_BIN_VALIDATION_PATH = 'data.fishbelt_transect.size_bin'
const TIDE_VALIDATION_PATH = 'data.fishbelt_transect.tide'
const TRANSECT_NUMBER_VALIDATION_PATH = 'data.fishbelt_transect.number'
const VISIBILITY_VALIDATION_PATH = 'data.fishbelt_transect.visibility'
const WIDTH_VALIDATION_PATH = 'data.fishbelt_transect.width'

const FishBeltTransectInputs = ({
  areValidationsShowing,
  choices,
  formik,
  ignoreNonObservationFieldValidations,
  onSizeBinChange,
  observationsReducer,
  resetNonObservationFieldValidations,
  validationsApiData,
  validationPropertiesWithDirtyResetOnInputChange,
}) => {
  const [observationsState] = observationsReducer
  const {
    belttransectwidths,
    fishsizebins,
    reefslopes,
    relativedepths,
    visibilities,
    currents,
    tides,
  } = choices
  const transectWidthSelectOptions = sortArrayByObjectKey(
    getOptions(belttransectwidths.data),
    'label',
  )
  const fishSizeBinSelectOptions = getOptions(fishsizebins.data)
  const reefSlopeSelectOptions = [
    ...getOptions(reefslopes.data),
    { label: 'not reported', value: '' },
  ]
  const relativeDepthOptions = [
    ...getOptions(relativedepths.data),
    { label: 'not reported', value: '' },
  ]
  const visibilityOptions = [...getOptions(visibilities.data), { label: 'not reported', value: '' }]
  const currentOptions = [...getOptions(currents.data), { label: 'not reported', value: '' }]
  const tideOptions = [...getOptions(tides.data), { label: 'not reported', value: '' }]
  const fishbelt_transect = validationsApiData?.fishbelt_transect
  // account for empty starter row
  const hasFishBeltObservations =
    !!observationsState.length > 0 && observationsState[0]?.fish_attribute

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
  const relativeDepthValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.relative_depth,
    areValidationsShowing,
  )
  const visibilityValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.visibility,
    areValidationsShowing,
  )
  const currentValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.current,
    areValidationsShowing,
  )
  const tideValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.tide,
    areValidationsShowing,
  )

  const notesValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.notes,
    areValidationsShowing,
  )

  const sampleTimeValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.sample_time,
    areValidationsShowing,
  )

  const depthValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.depth,
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

  const handleLengthSurveyedChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'len_surveyed',
      validationPath: LENGHT_SURVEYED_VALIDATION_PATH,
    })
  }
  const handleWidthChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'width',
      validationPath: WIDTH_VALIDATION_PATH,
    })
  }
  const handleSizeBinChange = (event) => {
    onSizeBinChange(event)
    resetNonObservationFieldValidations({
      inputName: 'size_bin',
      validationPath: SIZE_BIN_VALIDATION_PATH,
    })
  }
  const handleReefSlopeChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'reef_slope',
      validationPath: REEF_SLOPE_VALIDATION_PATH,
    })
  }
  const handleRelativeDepthChange = (event) => {
    formik.handleChange(event)
    resetNonObservationFieldValidations({
      inputName: 'relative_depth',
      validationPath: RELATIVE_DEPTH_VALIDATION_PATH,
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
          unit="m"
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
          unit="m"
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
        />
        <InputRadioWithLabelAndValidation
          label="Width"
          required={true}
          id="width"
          testId="width"
          options={transectWidthSelectOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: WIDTH_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: WIDTH_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(widthValidationProperties, 'width')}
          onBlur={formik.handleBlur}
          value={formik.values.width}
          name="width"
          onChange={handleWidthChange}
        />
        <InputRadioWithLabelAndValidation
          disabled={hasFishBeltObservations}
          label="Fish Size Bin (cm)"
          required={true}
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
          {...validationPropertiesWithDirtyResetOnInputChange(
            sizeBinValidationProperties,
            'size_bin',
          )}
          additionalText={
            hasFishBeltObservations ? <>{language.error.disabledFishSizeBinSelect}</> : null
          }
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
        <InputRadioWithLabelAndValidation
          label="Visibility"
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
          onBlur={formik.handleBlur}
          value={formik.values.visibility}
          name="visibility"
          onChange={handleVisibilityChange}
        />
        <InputRadioWithLabelAndValidation
          label="Current"
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
          onBlur={formik.handleBlur}
          value={formik.values.current}
          name="current"
          onChange={handleCurrentChange}
        />
        <InputRadioWithLabelAndValidation
          label="Relative Depth"
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
          onBlur={formik.handleBlur}
          value={formik.values.relative_depth}
          name="relative_depth"
          onChange={handleRelativeDepthChange}
        />
        <InputRadioWithLabelAndValidation
          label="Tide"
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
          onBlur={formik.handleBlur}
          value={formik.values.tide}
          name="tide"
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

FishBeltTransectInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  onSizeBinChange: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: PropTypes.shape({ fishbelt_transect: fishbeltValidationPropType }).isRequired,
  validationPropertiesWithDirtyResetOnInputChange: PropTypes.func.isRequired,
}

FishBeltTransectInputs.defaultProps = {
  observationsReducer: [],
}

export default FishBeltTransectInputs
