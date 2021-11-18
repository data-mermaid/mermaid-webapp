import React from 'react'
import PropTypes from 'prop-types'

import {
  choicesPropType,
  fishBeltPropType,
  managementRegimePropType,
  observationPropTypeShape,
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
import RecordLevelInputValidationInfo from '../RecordLevelValidationInfo/RecordLevelValidationInfo'
import TextareaWithLabelAndValidation from '../../../mermaidInputs/TextareaWithLabelAndValidation'

const FishbeltForm = ({
  areObservationsInputsDirty,
  areValidationsShowing,
  choices,
  collectRecord,
  fishNameConstants,
  fishNameOptions,
  formik,
  ignoreNonObservationFieldValidations,
  ignoreObservationValidations,
  ignoreRecordLevelValidation,
  managementRegimes,
  observationsReducer,
  observationValidationsCloneWithUuids,
  observers,
  onObserversChange,
  onSizeBinChange,
  openNewFishNameModal,
  persistUnsavedObservationsUtilities,
  resetObservationValidations,
  resetRecordLevelValidation,
  resetNonObservationFieldValidations,
  setAreObservationsInputsDirty,
  sites,
}) => {
  const { belttransectwidths, fishsizebins, reefslopes } = choices
  const transectWidthSelectOptions = getOptions(belttransectwidths)
  const fishSizeBinSelectOptions = getOptions(fishsizebins)
  const reefSlopeSelectOptions = getOptions(reefslopes)
  const hasData = false
  const managementSelectOptions = getOptions(managementRegimes, hasData)
  const siteSelectOptions = getOptions(sites, hasData)
  const validationsApiData = collectRecord?.validations?.results?.data
  const recordLevelValidations = collectRecord?.validations?.results?.$record ?? []
  const fishbelt_transect = validationsApiData?.fishbelt_transect
  const sample_event = validationsApiData?.sample_event

  const handleChangeForDirtyIgnoredInput = ({
    validationProperties,
    validationPath,
    inputName,
  }) => {
    const isInputDirty = formik.initialValues[inputName] === formik.values[inputName]
    const doesFieldHaveIgnoredValidation = validationProperties.validationType === 'ignore'

    if (doesFieldHaveIgnoredValidation && isInputDirty) {
      resetNonObservationFieldValidations({ validationPath })
    }
  }
  const siteValidationProperties = getValidationPropertiesForInput(
    sample_event?.site,
    areValidationsShowing,
  )
  const managementValidationProperties = getValidationPropertiesForInput(
    sample_event?.management,
    areValidationsShowing,
  )
  const depthValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.depth,
    areValidationsShowing,
  )
  const sampleDateValidationProperties = getValidationPropertiesForInput(
    sample_event?.sample_date,
    areValidationsShowing,
  )
  const sampleTimeValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.sample_time,
    areValidationsShowing,
  )

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

  const observersValidationProperties = getValidationPropertiesForInput(
    collectRecord?.validations?.results?.data?.observers,
    areValidationsShowing,
  )

  const siteValidationPath = 'data.sample_event.site'
  const managementValidationPath = 'data.sample_event.management'
  const depthValidationPath = 'data.fishbelt_transect.depth'
  const sampleDateValidationPath = 'data.sample_event.sample_date'
  const sampleTimeValidationPath = 'data.fishbelt_transect.sample_time'
  const transectNumberValidationPath = 'data.fishbelt_transect.number'
  const labelValidationPath = 'data.fishbelt_transect.label'
  const lengthSurveyedValidationPath = 'data.fishbelt_transect.len_surveyed'
  const widthValidationPath = 'data.fishbelt_transect.width'
  const sizeBinValidationPath = 'data.fishbelt_transect.size_bin'
  const reefSlopeValidationPath = 'data.fishbelt_transect.reef_slope'
  const notesValidationPath = 'data.sample_event.notes'
  const observersValidationPath = 'data.observers'

  const handleSiteChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'site',
      validationProperties: siteValidationProperties,
      validationPath: siteValidationPath,
    })
  }

  const handleManagementChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'management',
      validationProperties: managementValidationProperties,
      validationPath: managementValidationPath,
    })
  }

  const handleDepthChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'depth',
      validationProperties: depthValidationProperties,
      validationPath: depthValidationPath,
    })
  }

  const handleSampleDateChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'sample_date',
      validationProperties: sampleDateValidationProperties,
      validationPath: sampleDateValidationPath,
    })
  }

  const handleSampleTimeChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'sample_time',
      validationProperties: sampleTimeValidationProperties,
      validationPath: sampleTimeValidationPath,
    })
  }

  const handleTransectNumberChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'number',
      validationProperties: transectNumberValidationProperties,
      validationPath: transectNumberValidationPath,
    })
  }

  const handleLabelChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'label',
      validationProperties: labelValidationProperties,
      validationPath: labelValidationPath,
    })
  }

  const handleLengthSurveyedChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'len_surveyed',
      validationProperties: lengthSurveyedValidationProperties,
      validationPath: lengthSurveyedValidationPath,
    })
  }
  const handleWidthChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'width',
      validationProperties: widthValidationProperties,
      validationPath: widthValidationPath,
    })
  }
  const handleSizeBinChange = (event) => {
    onSizeBinChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'size_bin',
      validationProperties: sizeBinValidationProperties,
      validationPath: sizeBinValidationPath,
    })
  }
  const handleReefSlopeChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'reef_slope',
      validationProperties: reefSlopeValidationProperties,
      validationPath: reefSlopeValidationPath,
    })
  }
  const handleNotesChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'notes',
      validationProperties: notesValidationProperties,
      validationPath: notesValidationPath,
    })
  }

  const handleObserversChange = ({ selectedObservers }) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'observers',
      validationProperties: observersValidationProperties,
      validationPath: observersValidationPath,
    })
    onObserversChange({
      inputValidationPropertyName: 'observers',
      selectedObservers,
    })
  }

  return (
    <>
      <RecordLevelInputValidationInfo
        validations={recordLevelValidations}
        areValidationsShowing={areValidationsShowing}
        resetRecordLevelValidation={resetRecordLevelValidation}
        ignoreRecordLevelValidation={ignoreRecordLevelValidation}
      />
      <form id="fishbelt-form" aria-labelledby="fishbelt-form-title" onSubmit={formik.handleSubmit}>
        <InputWrapper>
          <H2>Sample Info</H2>
          <InputSelectWithLabelAndValidation
            label="Site"
            id="site"
            testId="site"
            options={siteSelectOptions}
            ignoreNonObservationFieldValidations={() => {
              ignoreNonObservationFieldValidations({ validationPath: siteValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: siteValidationPath })
            }}
            {...siteValidationProperties}
            onBlur={formik.handleBlur}
            value={formik.values.site}
            onChange={handleSiteChange}
          />
          <InputSelectWithLabelAndValidation
            label="Management"
            id="management"
            testId="management"
            options={managementSelectOptions}
            ignoreNonObservationFieldValidations={() => {
              ignoreNonObservationFieldValidations({ validationPath: managementValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: managementValidationPath })
            }}
            {...managementValidationProperties}
            onBlur={formik.handleBlur}
            value={formik.values.management}
            onChange={handleManagementChange}
          />
          <InputWithLabelAndValidation
            label="Depth"
            id="depth"
            ignoreNonObservationFieldValidations={() => {
              ignoreNonObservationFieldValidations({ validationPath: depthValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: depthValidationPath })
            }}
            testId="depth"
            type="number"
            {...depthValidationProperties}
            onBlur={formik.handleBlur}
            value={formik.values.depth}
            onChange={handleDepthChange}
          />
          <InputWithLabelAndValidation
            label="Sample Date"
            id="sample_date"
            testId="sample_date"
            type="date"
            ignoreNonObservationFieldValidations={() => {
              ignoreNonObservationFieldValidations({ validationPath: sampleDateValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: sampleDateValidationPath })
            }}
            {...sampleDateValidationProperties}
            onBlur={formik.handleBlur}
            value={formik.values.sample_date}
            onChange={handleSampleDateChange}
          />
          <InputWithLabelAndValidation
            label="Sample Time"
            id="sample_time"
            testId="sample_time"
            type="time"
            ignoreNonObservationFieldValidations={() => {
              ignoreNonObservationFieldValidations({ validationPath: sampleTimeValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: sampleTimeValidationPath })
            }}
            {...sampleTimeValidationProperties}
            onBlur={formik.handleBlur}
            value={formik.values.sample_time}
            onChange={handleSampleTimeChange}
          />
        </InputWrapper>
        <InputWrapper>
          <H2>Transect</H2>
          <InputWithLabelAndValidation
            label="Transect Number"
            id="number"
            testId="transect_number"
            type="number"
            ignoreNonObservationFieldValidations={() => {
              ignoreNonObservationFieldValidations({ validationPath: transectNumberValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: transectNumberValidationPath })
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
              ignoreNonObservationFieldValidations({ validationPath: labelValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: labelValidationPath })
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
              ignoreNonObservationFieldValidations({ validationPath: lengthSurveyedValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: lengthSurveyedValidationPath })
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
              ignoreNonObservationFieldValidations({ validationPath: widthValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: widthValidationPath })
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
              ignoreNonObservationFieldValidations({ validationPath: sizeBinValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: sizeBinValidationPath })
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
              ignoreNonObservationFieldValidations({ validationPath: reefSlopeValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: reefSlopeValidationPath })
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
              ignoreNonObservationFieldValidations({ validationPath: notesValidationPath })
            }}
            resetNonObservationFieldValidations={() => {
              resetNonObservationFieldValidations({ validationPath: notesValidationPath })
            }}
            {...notesValidationProperties}
            onBlur={formik.handleBlur}
            value={formik.values.notes}
            onChange={handleNotesChange}
          />
        </InputWrapper>
        <ObserversInput
          data-testid="observers"
          formik={formik}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          observers={observers}
          onObserversChange={handleObserversChange}
          resetNonObservationFieldValidations={resetNonObservationFieldValidations}
          validationPath={observersValidationPath}
          validationProperties={observersValidationProperties}
        />

        <FishBeltObservationTable
          areObservationsInputsDirty={areObservationsInputsDirty}
          areValidationsShowing={areValidationsShowing}
          choices={choices}
          collectRecord={collectRecord}
          fishBinSelected={formik.values.size_bin}
          fishNameConstants={fishNameConstants}
          fishNameOptions={fishNameOptions}
          ignoreObservationValidations={ignoreObservationValidations}
          observationsReducer={observationsReducer}
          observationValidationsCloneWithUuids={observationValidationsCloneWithUuids}
          openNewFishNameModal={openNewFishNameModal}
          persistUnsavedObservationsUtilities={persistUnsavedObservationsUtilities}
          resetObservationValidations={resetObservationValidations}
          setAreObservationsInputsDirty={setAreObservationsInputsDirty}
          transectLengthSurveyed={formik.values.len_surveyed}
          widthId={formik.values.width}
        />
      </form>
    </>
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
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  ignoreObservationValidations: PropTypes.func.isRequired,
  ignoreRecordLevelValidation: PropTypes.func.isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  observationValidationsCloneWithUuids: PropTypes.arrayOf(
    PropTypes.shape({ ...observationPropTypeShape, observationId: PropTypes.string }),
  ).isRequired,
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
  resetObservationValidations: PropTypes.func.isRequired,
  resetRecordLevelValidation: PropTypes.func.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

FishbeltForm.defaultProps = {
  collectRecord: undefined,
}

export default FishbeltForm
