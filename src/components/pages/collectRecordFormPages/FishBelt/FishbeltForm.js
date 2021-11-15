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
  ignoreRecordLevelValidation,
  ignoreValidations,
  managementRegimes,
  observationsReducer,
  observers,
  onObserversChange,
  onSizeBinChange,
  openNewFishNameModal,
  persistUnsavedObservationsUtilities,
  resetRecordLevelValidation,
  resetValidations,
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
      resetValidations({ validationPath })
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
            ignoreValidations={() => {
              ignoreValidations({ validationPath: siteValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: siteValidationPath })
            }}
            {...siteValidationProperties}
            {...formik.getFieldProps('site')}
            onChange={handleSiteChange}
          />
          <InputSelectWithLabelAndValidation
            label="Management"
            id="management"
            testId="management"
            options={managementSelectOptions}
            ignoreValidations={() => {
              ignoreValidations({ validationPath: managementValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: managementValidationPath })
            }}
            {...managementValidationProperties}
            {...formik.getFieldProps('management')}
            onChange={handleManagementChange}
          />
          <InputWithLabelAndValidation
            label="Depth"
            id="depth"
            ignoreValidations={() => {
              ignoreValidations({ validationPath: depthValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: depthValidationPath })
            }}
            testId="depth"
            type="number"
            {...formik.getFieldProps('depth')}
            {...depthValidationProperties}
            onChange={handleDepthChange}
          />
          <InputWithLabelAndValidation
            label="Sample Date"
            id="sample_date"
            testId="sample_date"
            type="date"
            ignoreValidations={() => {
              ignoreValidations({ validationPath: sampleDateValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: sampleDateValidationPath })
            }}
            {...sampleDateValidationProperties}
            {...formik.getFieldProps('sample_date')}
            onChange={handleSampleDateChange}
          />
          <InputWithLabelAndValidation
            label="Sample Time"
            id="sample_time"
            testId="sample_time"
            type="time"
            ignoreValidations={() => {
              ignoreValidations({ validationPath: sampleTimeValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: sampleTimeValidationPath })
            }}
            {...formik.getFieldProps('sample_time')}
            {...sampleTimeValidationProperties}
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
            ignoreValidations={() => {
              ignoreValidations({ validationPath: transectNumberValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: transectNumberValidationPath })
            }}
            {...transectNumberValidationProperties}
            {...formik.getFieldProps('number')}
            onChange={handleTransectNumberChange}
          />
          <InputWithLabelAndValidation
            label="Label"
            id="label"
            testId="label"
            type="text"
            ignoreValidations={() => {
              ignoreValidations({ validationPath: labelValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: labelValidationPath })
            }}
            {...labelValidationProperties}
            {...formik.getFieldProps('label')}
            onChange={handleLabelChange}
          />
          <InputWithLabelAndValidation
            label="Transect Length Surveyed"
            id="len_surveyed"
            testId="len_surveyed"
            type="number"
            ignoreValidations={() => {
              ignoreValidations({ validationPath: lengthSurveyedValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: lengthSurveyedValidationPath })
            }}
            {...lengthSurveyedValidationProperties}
            {...formik.getFieldProps('len_surveyed')}
            onChange={handleLengthSurveyedChange}
          />
          <InputRadioWithLabelAndValidation
            label="Width"
            id="width"
            testId="width"
            options={transectWidthSelectOptions}
            ignoreValidations={() => {
              ignoreValidations({ validationPath: widthValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: widthValidationPath })
            }}
            {...widthValidationProperties}
            {...formik.getFieldProps('width')}
            onChange={handleWidthChange}
          />
          <InputRadioWithLabelAndValidation
            label="Fish Size Bin"
            id="size_bin"
            testId="size_bin"
            name="fish-size-bin"
            options={fishSizeBinSelectOptions}
            ignoreValidations={() => {
              ignoreValidations({ validationPath: sizeBinValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: sizeBinValidationPath })
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
            ignoreValidations={() => {
              ignoreValidations({ validationPath: reefSlopeValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: reefSlopeValidationPath })
            }}
            {...reefSlopeValidationProperties}
            {...formik.getFieldProps('reef_slope')}
            onChange={handleReefSlopeChange}
          />
          <TextareaWithLabelAndValidation
            label="Notes"
            id="notes"
            testId="notes"
            ignoreValidations={() => {
              ignoreValidations({ validationPath: notesValidationPath })
            }}
            resetValidations={() => {
              resetValidations({ validationPath: notesValidationPath })
            }}
            {...notesValidationProperties}
            {...formik.getFieldProps('notes')}
            onChange={handleNotesChange}
          />
        </InputWrapper>
        <ObserversInput
          data-testid="observers"
          formik={formik}
          ignoreValidations={ignoreValidations}
          observers={observers}
          onObserversChange={handleObserversChange}
          resetValidations={resetValidations}
          validationPath={observersValidationPath}
          validationProperties={observersValidationProperties}
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
  ignoreRecordLevelValidation: PropTypes.func.isRequired,
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
  resetRecordLevelValidation: PropTypes.func.isRequired,
  resetValidations: PropTypes.func.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

FishbeltForm.defaultProps = {
  collectRecord: undefined,
}

export default FishbeltForm
