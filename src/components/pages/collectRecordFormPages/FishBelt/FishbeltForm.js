import React from 'react'
import PropTypes from 'prop-types'

import {
  choicesPropType,
  fishBeltPropType,
  managementRegimePropType,
  observersPropType,
  sitePropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { InputWrapper } from '../../../generic/form'
import FishBeltObservationTable from './FishBeltObservationTable'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputRadioWithLabelAndValidation from '../../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputSelectWithLabelAndValidation from '../../../mermaidInputs/InputSelectWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import ObserversInput from '../../../ObserversInput'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'

const FishbeltForm = ({
  areObservationsInputsDirty,

  areValidationsShowing,
  choices,
  collectRecord,
  formik,
  ignoreValidations,
  managementRegimes,
  onSizeBinChange,
  resetValidations,
  sites,
  observers,
  onObserversChange,

  fishNameConstants,
  fishNameOptions,
  observationsReducer,
  openNewFishNameModal,
  persistUnsavedObservationsUtilities,
  setAreObservationsInputsDirty,
}) => {
  const { belttransectwidths, fishsizebins, reefslopes } = choices
  const transectWidthSelectOptions = getOptions(belttransectwidths)
  const fishSizeBinSelectOptions = getOptions(fishsizebins)
  const reefSlopeSelectOptions = getOptions(reefslopes)
  const hasData = false
  const managementSelectOptions = getOptions(managementRegimes, hasData)
  const siteSelectOptions = getOptions(sites, hasData)
  const validationsApiData = collectRecord?.validations?.results?.data
  const fishbelt_transect = validationsApiData?.fishbelt_transect
  const sample_event = validationsApiData?.sample_event

  return (
    <form id="fishbelt-form" aria-labelledby="fishbelt-form-title" onSubmit={formik.handleSubmit}>
      <InputWrapper>
        <H2>Sample Info</H2>
        <InputSelectWithLabelAndValidation
          label="Site"
          id="site"
          testId="site"
          options={siteSelectOptions}
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.sample_event.site' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.sample_event.site' })
          }}
          {...getValidationPropertiesForInput(sample_event?.site, areValidationsShowing)}
          {...formik.getFieldProps('site')}
        />
        <InputSelectWithLabelAndValidation
          label="Management"
          id="management"
          testId="management"
          options={managementSelectOptions}
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.sample_event.management' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.sample_event.management' })
          }}
          {...getValidationPropertiesForInput(sample_event?.management, areValidationsShowing)}
          {...formik.getFieldProps('management')}
        />
        <InputWithLabelAndValidation
          label="Depth"
          id="depth"
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.fishbelt_transect.depth' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.fishbelt_transect.depth' })
          }}
          testId="depth"
          type="number"
          {...formik.getFieldProps('depth')}
          {...getValidationPropertiesForInput(fishbelt_transect?.depth, areValidationsShowing)}
        />
        <InputWithLabelAndValidation
          label="Sample Date"
          id="sample_date"
          testId="sample_date"
          type="date"
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.sample_event.sample_date' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.sample_event.sample_date' })
          }}
          {...getValidationPropertiesForInput(sample_event?.sample_date, areValidationsShowing)}
          {...formik.getFieldProps('sample_date')}
        />
        <InputWithLabelAndValidation
          label="Sample Time"
          id="sample_time"
          testId="sample_time"
          type="time"
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.fishbelt_transect.sample_time' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.fishbelt_transect.sample_time' })
          }}
          {...formik.getFieldProps('sample_time')}
          {...getValidationPropertiesForInput(
            fishbelt_transect?.sample_time,
            areValidationsShowing,
          )}
        />
      </InputWrapper>
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
      <ObserversInput
        areValidationsShowing={areValidationsShowing}
        collectRecord={collectRecord}
        data-testid="observers"
        formik={formik}
        observers={observers}
        onObserversChange={onObserversChange}
        ignoreValidations={ignoreValidations}
        resetValidations={resetValidations}
      />

      <FishBeltObservationTable
        choices={choices}
        collectRecord={collectRecord}
        fishBinSelected={formik.values.size_bin}
        fishNameConstants={fishNameConstants}
        fishNameOptions={fishNameOptions}
        observationsReducer={observationsReducer}
        openNewFishNameModal={openNewFishNameModal}
        transectLengthSurveyed={formik.values.len_surveyed}
        widthId={formik.values.width}
        persistUnsavedObservationsUtilities={persistUnsavedObservationsUtilities}
        areObservationsInputsDirty={areObservationsInputsDirty}
        setAreObservationsInputsDirty={setAreObservationsInputsDirty}
      />
    </form>
  )
}

FishbeltForm.propTypes = {
  areObservationsInputsDirty: PropTypes.bool.isRequired,
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: fishBeltPropType,
  fishNameConstants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      biomass_constant_a: PropTypes.number,
      biomass_constant_b: PropTypes.number,
      biomass_constant_c: PropTypes.number,
    }),
  ).isRequired,
  fishNameOptions: inputOptionsPropTypes.isRequired,
  formik: formikPropType.isRequired,
  ignoreValidations: PropTypes.func.isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  observationsReducer: PropTypes.arrayOf(PropTypes.any).isRequired,
  observers: PropTypes.arrayOf(observersPropType).isRequired,
  onObserversChange: PropTypes.func.isRequired,
  onSizeBinChange: PropTypes.func.isRequired,
  openNewFishNameModal: PropTypes.func.isRequired,
  persistUnsavedObservationsUtilities: PropTypes.shape({
    persistUnsavedFormData: PropTypes.func,
    clearPersistedUnsavedFormData: PropTypes.func,
    getPersistedUnsavedFormData: PropTypes.func,
  }).isRequired,
  resetValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

FishbeltForm.defaultProps = {
  collectRecord: undefined,
}

export default FishbeltForm
