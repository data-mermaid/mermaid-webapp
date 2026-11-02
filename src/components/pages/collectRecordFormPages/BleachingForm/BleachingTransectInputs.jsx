import React from 'react'
import PropTypes from 'prop-types'
import { Trans, useTranslation } from 'react-i18next'

import {
  benthicPitValidationPropType,
  choicesPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formik/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'
import InputSelectWithLabelAndValidation from '../../../mermaidInputs/InputSelectWithLabelAndValidation'
import { HelperTextLink } from '../../../generic/links'

const CURRENT_VALIDATION_PATH = 'data.quadrat_collection.current'
const DEPTH_VALIDATION_PATH = 'data.quadrat_collection.depth'
const LABEL_VALIDATION_PATH = 'data.quadrat_collection.label'
const QUADRAT_SIZE_VALIDATION_PATH = 'data.quadrat_collection.quadrat_size'
const NOTES_VALIDATION_PATH = 'data.quadrat_collection.notes'
const RELATIVE_DEPTH_VALIDATION_PATH = 'data.quadrat_collection.relative_depth'
const SAMPLE_TIME_VALIDATION_PATH = 'data.quadrat_collection.sample_time'
const TIDE_VALIDATION_PATH = 'data.quadrat_collection.tide'
const VISIBILITY_VALIDATION_PATH = 'data.quadrat_collection.visibility'

const BleachingTransectInputs = ({
  areValidationsShowing,
  choices,
  formik,
  ignoreNonObservationFieldValidations,
  markFieldValidationsStale,
  unignoreNonObservationFieldValidations,
  validationsApiData,
}) => {
  const { t } = useTranslation()
  const { relativedepths, visibilities, currents, tides } = choices

  const visibilityOptions = getOptions(visibilities.data)
  const currentOptions = getOptions(currents.data)
  const relativeDepthOptions = getOptions(relativedepths.data)
  const tideOptions = getOptions(tides.data)
  const quadratCollection = validationsApiData?.quadrat_collection

  const labelValidationProperties = getValidationPropertiesForInput(
    quadratCollection?.label,
    areValidationsShowing,
  )
  const quadratSizeValidationProperties = getValidationPropertiesForInput(
    quadratCollection?.quadrat_size,
    areValidationsShowing,
  )
  const relativeDepthValidationProperties = getValidationPropertiesForInput(
    quadratCollection?.relative_depth,
    areValidationsShowing,
  )
  const visibilityValidationProperties = getValidationPropertiesForInput(
    quadratCollection?.visibility,
    areValidationsShowing,
  )
  const currentValidationProperties = getValidationPropertiesForInput(
    quadratCollection?.current,
    areValidationsShowing,
  )
  const tideValidationProperties = getValidationPropertiesForInput(
    quadratCollection?.tide,
    areValidationsShowing,
  )

  const notesValidationProperties = getValidationPropertiesForInput(
    quadratCollection?.notes,
    areValidationsShowing,
  )

  const sampleTimeValidationProperties = getValidationPropertiesForInput(
    quadratCollection?.sample_time,
    areValidationsShowing,
  )

  const depthValidationProperties = getValidationPropertiesForInput(
    quadratCollection?.depth,
    areValidationsShowing,
  )

  const handleLabelChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: LABEL_VALIDATION_PATH,
    })
  }

  const handleQuadratSizeChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: QUADRAT_SIZE_VALIDATION_PATH,
    })
  }

  const handleRelativeDepthChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: RELATIVE_DEPTH_VALIDATION_PATH,
    })
  }
  const handleVisibilityChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: VISIBILITY_VALIDATION_PATH,
    })
  }
  const handleCurrentChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: CURRENT_VALIDATION_PATH,
    })
  }

  const handleNotesChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: NOTES_VALIDATION_PATH,
    })
  }
  const handleTideChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: TIDE_VALIDATION_PATH,
    })
  }

  const handleSampleTimeChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: SAMPLE_TIME_VALIDATION_PATH,
    })
  }

  const handleDepthChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: DEPTH_VALIDATION_PATH,
    })
  }

  return (
    <>
      <InputWrapper>
        <H2>{t('quadrat_collection')}</H2>

        <InputWithLabelAndValidation
          disabled
          label={t('number')}
          id="number"
          testId="number"
          type="number"
          value={formik.values.number}
          helperText={t('number_info')}
        />
        <InputWithLabelAndValidation
          label={t('label')}
          id="label"
          testId="label"
          type="text"
          validationPath={LABEL_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...labelValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.label}
          onChange={handleLabelChange}
          helperText={t('label_info')}
        />
        <InputWithLabelAndValidation
          label={t('sample_units.sample_time')}
          id="sample_time"
          testId="sample-time"
          type="time"
          validationPath={SAMPLE_TIME_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...sampleTimeValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.sample_time}
          onChange={handleSampleTimeChange}
          helperText={t('sample_units.sample_time_info')}
        />
        <InputWithLabelAndValidation
          label={t('sample_units.depth')}
          required={true}
          id="depth"
          validationPath={DEPTH_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          testId="depth"
          type="number"
          {...depthValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.depth}
          onChange={handleDepthChange}
          unit="m"
          helperText={t('sample_units.depth_info')}
        />
        <InputWithLabelAndValidation
          label={t('quadrat_size')}
          required={true}
          id="quadrat_size"
          testId="quadrat-size"
          type="number"
          validationPath={QUADRAT_SIZE_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...quadratSizeValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.quadrat_size}
          onChange={handleQuadratSizeChange}
          unit="m²"
          helperText={t('quadrat_size_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('visibility')}
          required={false}
          id="visibility"
          testId="visibility"
          options={visibilityOptions}
          validationPath={VISIBILITY_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...visibilityValidationProperties}
          {...visibilityValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.visibility}
          onChange={handleVisibilityChange}
          helperText={t('visibility_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('current')}
          required={false}
          id="current"
          testId="current"
          options={currentOptions}
          validationPath={CURRENT_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...currentValidationProperties}
          {...currentValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.current}
          onChange={handleCurrentChange}
          helperText={t('current_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('relative_depth')}
          required={false}
          id="relative_depth"
          testId="relative-depth"
          options={relativeDepthOptions}
          validationPath={RELATIVE_DEPTH_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...relativeDepthValidationProperties}
          {...relativeDepthValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.relative_depth}
          onChange={handleRelativeDepthChange}
          helperText={t('relative_depth_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('tide')}
          required={false}
          id="tide"
          testId="tide"
          options={tideOptions}
          validationPath={TIDE_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...tideValidationProperties}
          {...tideValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.tide}
          onChange={handleTideChange}
          helperText={
            <Trans
              i18nKey="tide_info"
              components={{
                a: (
                  <HelperTextLink
                    href="https://oceanservice.noaa.gov/education/tutorial_tides/tides01_intro.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            />
          }
        />
        <TextareaWithLabelAndValidation
          label={t('notes')}
          id="notes"
          testId="notes"
          validationPath={NOTES_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...notesValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.notes}
          onChange={handleNotesChange}
        />
      </InputWrapper>
    </>
  )
}

BleachingTransectInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  markFieldValidationsStale: PropTypes.func.isRequired,
  unignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: benthicPitValidationPropType.isRequired,
}

export default BleachingTransectInputs
