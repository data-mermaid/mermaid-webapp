import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation, Trans } from 'react-i18next'

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
import { links } from '../../../../link_constants'

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

const BenthicLitTransectInputs = ({
  areValidationsShowing,
  choices,
  formik,
  ignoreNonObservationFieldValidations,
  markFieldValidationsStale,
  unignoreNonObservationFieldValidations,
  validationsApiData,
}) => {
  const { t } = useTranslation()
  const { reefslopes, relativedepths, visibilities, currents, tides } = choices

  const reefSlopeOptions = getOptions(reefslopes.data)
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

  const handleTransectNumberChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: TRANSECT_NUMBER_VALIDATION_PATH,
    })
  }

  const handleLabelChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: LABEL_VALIDATION_PATH,
    })
  }

  const handleLengthSurveyedChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: LENGHT_SURVEYED_VALIDATION_PATH,
    })
  }

  const handleReefSlopeChange = (event) => {
    formik.handleChange(event)
    markFieldValidationsStale({
      validationPath: REEF_SLOPE_VALIDATION_PATH,
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
        <H2>{t('transect')}</H2>
        <InputWithLabelAndValidation
          label={t('transect_number')}
          required={true}
          id="number"
          testId="transect-number"
          type="number"
          validationPath={TRANSECT_NUMBER_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...transectNumberValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.number}
          onChange={handleTransectNumberChange}
          helperText={t('transect_number_info')}
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
          label={t('sample_units.transect_length_surveyed')}
          required={true}
          id="len_surveyed"
          testId="len-surveyed"
          type="number"
          validationPath={LENGHT_SURVEYED_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...lengthSurveyedValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.len_surveyed}
          onChange={handleLengthSurveyedChange}
          unit="m"
          helperText={t('sample_units.transect_length_surveyed_info')}
        />
        <InputSelectWithLabelAndValidation
          label={t('reef_slope')}
          required={false}
          id="reef_slope"
          testId="reef-slope"
          options={reefSlopeOptions}
          validationPath={REEF_SLOPE_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...reefSlopeValidationProperties}
          {...reefSlopeValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.reef_slope}
          onChange={handleReefSlopeChange}
          helperText={
            <Trans
              i18nKey="reef_slope_info"
              components={{
                a: (
                  <HelperTextLink
                    href={links.reefCoverClassDefinitions}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            />
          }
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
                    href={links.tideIntroduction}
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

BenthicLitTransectInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  markFieldValidationsStale: PropTypes.func.isRequired,
  unignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: benthicPitValidationPropType.isRequired,
}

export { BenthicLitTransectInputs }
