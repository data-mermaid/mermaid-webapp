import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useHistory, useParams } from 'react-router-dom'
import { H2 } from '../../../generic/text'
import {
  managementRegimePropType,
  sitePropType,
  choicesPropType,
  subNavNodePropTypes,
  observationsReducerPropType,
  observersPropType,
  fishBeltPropType,
  benthicPhotoQuadratPropType,
  fishNameConstantsPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
  getBenthicPhotoQuadratAdditionalValues,
} from '../collectRecordFormInitialValues'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import {
  reformatFormValuesIntoFishBeltRecord,
  reformatFormValuesIntoBenthicPQTRecord,
} from './reformatFormValuesIntoRecord'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { getFishBinLabel } from '../FishBeltForm/fishBeltBins'
import { getToastArguments } from '../../../../library/getToastArguments'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import NewAttributeModal from '../../../NewAttributeModal'
import ObserversInput from '../ObserversInput'
import DeleteRecordButton from '../DeleteRecordButton'
import SampleEventInputs from '../SampleEventInputs'
import BenthicAttributeTransectInputs from '../BenthicPhotoQuadratForm/BenthicAttributeTransectInputs'
import BenthicPhotoQuadratObservationTable from '../BenthicPhotoQuadratForm/BenthicPhotoQuadratObservationTable'
import LoadingModal from '../../../LoadingModal/LoadingModal'
import RecordFormTitle from '../../../RecordFormTitle'
import RecordLevelInputValidationInfo from '../RecordLevelValidationInfo/RecordLevelValidationInfo'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import FishBeltObservationTable from '../FishBeltForm/FishBeltObservationTable'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import FishBeltTransectInputs from '../FishBeltForm/FishBeltTransectInputs'

import language from '../../../../language'

const CollectRecordFormPage = ({
  isNewRecord,
  sampleUnitName,
  collectRecordBeingEdited,
  handleCollectRecordChange,
  handleNewObservationAdd,
  handleSubmitNewObservation,
  observationsReducer,
  sites,
  managementRegimes,
  choices,
  idsNotAssociatedWithData,
  isLoading,
  subNavNode,
  observerProfiles,
  observationOptions,
  modalAttributeOptions,
  fishNameConstants,
}) => {
  const observationTableRef = useRef(null)
  const currentProjectPath = useCurrentProjectPath()

  const { recordId, projectId } = useParams()
  const history = useHistory()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [observationsState, observationsDispatch] = observationsReducer

  const [isFormDirty, setIsFormDirty] = useState(false)
  const [areValidationsShowing, setAreValidationsShowing] = useState(false)
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [submitButtonState, setSubmitButtonState] = useState(buttonGroupStates.submittable)
  const [validateButtonState, setValidateButtonState] = useState(buttonGroupStates.validatable)
  const [isNewObservationModalOpen, setIsNewObservationModalOpen] = useState(false)

  const isFishBeltSampleUnit = sampleUnitName === 'fishbelt'
  const recordLevelValidations = collectRecordBeingEdited?.validations?.results?.$record ?? []
  const validationsApiData = collectRecordBeingEdited?.validations?.results?.data ?? {}
  const displayLoadingModal =
    saveButtonState === buttonGroupStates.saving ||
    validateButtonState === buttonGroupStates.validating ||
    submitButtonState === buttonGroupStates.submitting

  const getValidationButtonStatus = (collectRecord) => {
    return collectRecord?.validations?.status === 'ok'
      ? buttonGroupStates.validated
      : buttonGroupStates.validatable
  }

  const openNewObservationModal = useCallback(
    (observationId) => {
      handleNewObservationAdd(observationId)
      setIsNewObservationModalOpen(true)
    },
    [handleNewObservationAdd],
  )

  const closeNewObservationModal = () => {
    setIsNewObservationModalOpen(false)
  }

  const _checkValidateButton = useEffect(() => {
    if (!isLoading) {
      setValidateButtonState(getValidationButtonStatus(collectRecordBeingEdited))
    }
  }, [isLoading, collectRecordBeingEdited])

  const handleScrollToObservation = () => {
    observationTableRef.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const {
    persistUnsavedFormData: persistUnsavedFormikData,
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedSampleInfoInputs`)

  const persistUnsavedObservationsUtilities = useUnsavedDirtyFormDataUtilities(
    `${currentUser.id}-unsavedObservations`,
  )

  const {
    clearPersistedUnsavedFormData: clearPersistedUnsavedObservationsData,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsData,
  } = persistUnsavedObservationsUtilities

  const initialFormikFormValues = useMemo(() => {
    const collectRecordInitialValues = getPersistedUnsavedFormikData() ?? {
      ...getCollectRecordDataInitialValues(collectRecordBeingEdited),
      ...getSampleInfoInitialValues(collectRecordBeingEdited),
    }

    return sampleUnitName === 'benthicpqt'
      ? {
          ...collectRecordInitialValues,
          ...getTransectInitialValues(collectRecordBeingEdited, 'quadrat_transect'),
          ...getBenthicPhotoQuadratAdditionalValues(collectRecordBeingEdited),
        }
      : {
          ...collectRecordInitialValues,
          ...getTransectInitialValues(collectRecordBeingEdited, 'fishbelt_transect'),
        }
  }, [collectRecordBeingEdited, getPersistedUnsavedFormikData, sampleUnitName])

  const formik = useFormik({
    initialValues: initialFormikFormValues,
    enableReinitialize: true,
    validate: persistUnsavedFormikData,
  })

  const handleSave = () => {
    const recordToSubmit =
      sampleUnitName === 'benthicpqt'
        ? reformatFormValuesIntoBenthicPQTRecord(
            formik.values,
            observationsState,
            collectRecordBeingEdited,
          )
        : reformatFormValuesIntoFishBeltRecord(
            formik.values,
            observationsState,
            collectRecordBeingEdited,
          )

    setSaveButtonState(buttonGroupStates.saving)
    setAreValidationsShowing(false)

    databaseSwitchboardInstance
      .saveSampleUnit({
        record: recordToSubmit,
        profileId: currentUser.id,
        projectId,
        protocol: sampleUnitName,
      })
      .then((response) => {
        toast.success(...getToastArguments(language.success.collectRecordSave))
        clearPersistedUnsavedFormikData()
        clearPersistedUnsavedObservationsData()
        setAreObservationsInputsDirty(false)
        setSaveButtonState(buttonGroupStates.saved)
        setValidateButtonState(buttonGroupStates.validatable)
        setIsFormDirty(false)
        formik.resetForm({ values: formik.values }) // this resets formik's dirty state

        if (isNewRecord) {
          history.push(`${ensureTrailingSlash(history.location.pathname)}${response.id}`)
        }
      })
      .catch((error) => {
        setSaveButtonState(buttonGroupStates.unsaved)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.collectRecordSave))
          },
        })
      })
  }

  const handleValidate = () => {
    setValidateButtonState(buttonGroupStates.validating)

    databaseSwitchboardInstance
      .validateSampleUnit({ recordId, projectId })
      .then((validatedRecordResponse) => {
        setAreValidationsShowing(true)
        handleCollectRecordChange(validatedRecordResponse)
        setValidateButtonState(getValidationButtonStatus(validatedRecordResponse))
      })
      .catch((error) => {
        setValidateButtonState(buttonGroupStates.validatable)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.collectRecordValidation))
          },
        })
      })
  }

  const handleSubmit = () => {
    setSubmitButtonState(buttonGroupStates.submitting)

    databaseSwitchboardInstance
      .submitSampleUnit({ recordId, projectId })
      .then(() => {
        toast.success(...getToastArguments(language.success.collectRecordSubmit))
        history.push(`${ensureTrailingSlash(currentProjectPath)}collecting/`)
      })
      .catch((error) => {
        setSubmitButtonState(buttonGroupStates.submittable)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.collectRecordSubmit))
          },
        })
      })
  }

  const ignoreRecordLevelValidation = useCallback(
    ({ validationId }) => {
      databaseSwitchboardInstance
        .ignoreRecordLevelValidation({
          record: collectRecordBeingEdited,
          validationId,
        })
        .then((recordWithIgnoredValidations) => {
          handleCollectRecordChange(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordSubmit))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const ignoreObservationValidations = useCallback(
    ({ observationId }) => {
      databaseSwitchboardInstance
        .ignoreObservationValidations({
          recordId: collectRecordBeingEdited.id,
          observationId,
        })
        .then((recordWithIgnoredValidations) => {
          handleCollectRecordChange(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationIgnore))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const ignoreNonObservationFieldValidations = useCallback(
    ({ validationPath }) => {
      databaseSwitchboardInstance
        .ignoreNonObservationFieldValidations({
          record: collectRecordBeingEdited,
          validationPath,
        })
        .then((recordWithIgnoredValidations) => {
          handleCollectRecordChange(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationIgnore))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const resetObservationValidations = useCallback(
    ({ observationId }) => {
      databaseSwitchboardInstance
        .resetObservationValidations({ recordId: collectRecordBeingEdited.id, observationId })
        .then((recordWithResetValidations) => {
          handleCollectRecordChange(recordWithResetValidations)

          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationReset))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const resetRecordLevelValidation = useCallback(
    ({ validationId }) => {
      databaseSwitchboardInstance
        .resetRecordLevelValidation({
          record: collectRecordBeingEdited,
          validationId,
        })
        .then((recordWithResetValidations) => {
          handleCollectRecordChange(recordWithResetValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationReset))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const resetNonObservationFieldValidations = useCallback(
    ({ validationPath }) => {
      databaseSwitchboardInstance
        .resetNonObservationFieldValidations({
          record: collectRecordBeingEdited,
          validationPath,
        })
        .then((recordWithResetValidations) => {
          handleCollectRecordChange(recordWithResetValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationReset))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const _setIsFormDirty = useEffect(() => {
    setIsFormDirty(
      areObservationsInputsDirty ||
        !!formik.dirty ||
        !!getPersistedUnsavedFormikData() ||
        !!getPersistedUnsavedObservationsData(),
    )
  }, [
    areObservationsInputsDirty,
    formik.dirty,
    getPersistedUnsavedFormikData,
    getPersistedUnsavedObservationsData,
  ])

  const _setCollectButtonsUnsaved = useEffect(() => {
    if (isFormDirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [isFormDirty, setSaveButtonState])

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

  const validationPropertiesWithDirtyResetOnInputChange = (validationProperties, property) => {
    // for UX purpose only, validation is cleared when input is on change after page is validated
    const validationDirtyCheck =
      formik.values[property] !== formik.initialValues[property]
        ? null
        : validationProperties.validationType

    return {
      ...validationProperties,
      validationType: validationDirtyCheck,
    }
  }

  const deleteRecord = () => {
    if (!isNewRecord) {
      databaseSwitchboardInstance
        .deleteSampleUnit({
          record: collectRecordBeingEdited,
          profileId: currentUser.id,
          projectId,
        })
        .then(() => {
          clearPersistedUnsavedFormikData()
          clearPersistedUnsavedObservationsData()
          toast.success(...getToastArguments(language.success.collectRecordDelete))
          history.push(`${ensureTrailingSlash(currentProjectPath)}collecting/`)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordDelete))
            },
          })
        })
    }

    return Promise.resolve()
  }

  const handleSizeBinChange = (event) => {
    const sizeBinId = event.target.value

    formik.setFieldValue('size_bin', sizeBinId)

    const fishBinSelectedLabel = getFishBinLabel(choices, sizeBinId)

    const isSizeBinATypeThatRequiresSizeResetting = fishBinSelectedLabel !== '1'

    if (isSizeBinATypeThatRequiresSizeResetting) {
      observationsDispatch({ type: 'resetFishSizes' })
    }
  }

  const sampleUnitTransectInputs =
    sampleUnitName === 'benthicpqt' ? (
      <BenthicAttributeTransectInputs
        areValidationsShowing={areValidationsShowing}
        choices={choices}
        formik={formik}
        handleChangeForDirtyIgnoredInput={handleChangeForDirtyIgnoredInput}
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        validationsApiData={validationsApiData}
        validationPropertiesWithDirtyResetOnInputChange={
          validationPropertiesWithDirtyResetOnInputChange
        }
      />
    ) : (
      <FishBeltTransectInputs
        areValidationsShowing={areValidationsShowing}
        choices={choices}
        formik={formik}
        handleChangeForDirtyIgnoredInput={handleChangeForDirtyIgnoredInput}
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        onSizeBinChange={handleSizeBinChange}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        validationsApiData={validationsApiData}
        validationPropertiesWithDirtyResetOnInputChange={
          validationPropertiesWithDirtyResetOnInputChange
        }
      />
    )

  const observationTable =
    sampleUnitName === 'benthicpqt' ? (
      <BenthicPhotoQuadratObservationTable
        areObservationsInputsDirty={areObservationsInputsDirty}
        areValidationsShowing={areValidationsShowing}
        benthicAttributeOptions={observationOptions}
        choices={choices}
        collectRecord={collectRecordBeingEdited}
        observationsReducer={observationsReducer}
        openNewObservationModal={openNewObservationModal}
        persistUnsavedObservationsUtilities={persistUnsavedObservationsUtilities}
        ignoreObservationValidations={ignoreObservationValidations}
        resetObservationValidations={resetObservationValidations}
        setAreObservationsInputsDirty={setAreObservationsInputsDirty}
      />
    ) : (
      <FishBeltObservationTable
        areObservationsInputsDirty={areObservationsInputsDirty}
        areValidationsShowing={areValidationsShowing}
        formik={formik}
        choices={choices}
        collectRecord={collectRecordBeingEdited}
        fishNameConstants={fishNameConstants}
        fishNameOptions={observationOptions}
        ignoreObservationValidations={ignoreObservationValidations}
        observationsReducer={observationsReducer}
        openNewObservationModal={openNewObservationModal}
        persistUnsavedObservationsUtilities={persistUnsavedObservationsUtilities}
        resetObservationValidations={resetObservationValidations}
        setAreObservationsInputsDirty={setAreObservationsInputsDirty}
      />
    )

  const recordTitle =
    sampleUnitName === 'benthicpqt' ? (
      <RecordFormTitle
        submittedRecordOrCollectRecordDataProperty={collectRecordBeingEdited?.data}
        sites={sites}
        primaryTitle={`${language.pages.collectRecord.title} - ${language.pages.benthicPhotoQuadratForm.title}`}
        sampleUnit="quadrat_transect"
      />
    ) : (
      <RecordFormTitle
        submittedRecordOrCollectRecordDataProperty={collectRecordBeingEdited?.data}
        sites={sites}
        primaryTitle={`${language.pages.collectRecord.title} - ${language.pages.fishBeltForm.title}`}
        sampleUnit="fishbelt_transect"
      />
    )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <>
      <ContentPageLayout
        isPageContentLoading={isLoading}
        isToolbarSticky={true}
        subNavNode={subNavNode}
        content={
          <>
            <RecordLevelInputValidationInfo
              validations={recordLevelValidations}
              areValidationsShowing={areValidationsShowing}
              resetRecordLevelValidation={resetRecordLevelValidation}
              ignoreRecordLevelValidation={ignoreRecordLevelValidation}
              handleScrollToObservation={handleScrollToObservation}
            />
            <form
              id="collect-record-form"
              aria-labelledby="collect-record-form"
              onSubmit={formik.handleSubmit}
            >
              <SampleEventInputs
                areValidationsShowing={areValidationsShowing}
                collectRecord={collectRecordBeingEdited}
                formik={formik}
                managementRegimes={managementRegimes}
                sites={sites}
                handleChangeForDirtyIgnoredInput={handleChangeForDirtyIgnoredInput}
                ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
                resetNonObservationFieldValidations={resetNonObservationFieldValidations}
                validationPropertiesWithDirtyResetOnInputChange={
                  validationPropertiesWithDirtyResetOnInputChange
                }
              />
              {sampleUnitTransectInputs}
              <ObserversInput
                data-testid="observers"
                areValidationsShowing={areValidationsShowing}
                formik={formik}
                ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
                observers={observerProfiles}
                handleChangeForDirtyIgnoredInput={handleChangeForDirtyIgnoredInput}
                resetNonObservationFieldValidations={resetNonObservationFieldValidations}
                validationsApiData={validationsApiData}
                validationPropertiesWithDirtyResetOnInputChange={
                  validationPropertiesWithDirtyResetOnInputChange
                }
              />
              <div ref={observationTableRef}>{observationTable}</div>
            </form>
            <DeleteRecordButton isNewRecord={isNewRecord} deleteRecord={deleteRecord} />
          </>
        }
        toolbar={
          <ContentPageToolbarWrapper>
            {isNewRecord && (
              <H2>
                {sampleUnitName === 'benthicpqt'
                  ? language.pages.benthicPhotoQuadratForm.title
                  : language.pages.fishBeltForm.title}
              </H2>
            )}
            {collectRecordBeingEdited && !isNewRecord && recordTitle}
            <SaveValidateSubmitButtonGroup
              isNewRecord={isNewRecord}
              saveButtonState={saveButtonState}
              validateButtonState={validateButtonState}
              submitButtonState={submitButtonState}
              onValidate={handleValidate}
              onSave={handleSave}
              onSubmit={handleSubmit}
            />
          </ContentPageToolbarWrapper>
        }
      />

      {!!projectId && !!currentUser && (
        <NewAttributeModal
          isFishBeltSampleUnit={isFishBeltSampleUnit}
          isOpen={isNewObservationModalOpen}
          onDismiss={closeNewObservationModal}
          onSubmit={handleSubmitNewObservation}
          modalAttributeOptions={modalAttributeOptions}
        />
      )}
      {displayLoadingModal && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={formik.dirty} />
    </>
  )
}

CollectRecordFormPage.propTypes = {
  isNewRecord: PropTypes.bool.isRequired,
  sampleUnitName: PropTypes.string.isRequired,
  collectRecordBeingEdited: PropTypes.oneOfType([fishBeltPropType, benthicPhotoQuadratPropType]),
  handleCollectRecordChange: PropTypes.func.isRequired,
  handleNewObservationAdd: PropTypes.func.isRequired,
  handleSubmitNewObservation: PropTypes.func.isRequired,
  observationsReducer: observationsReducerPropType,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  choices: choicesPropType.isRequired,
  idsNotAssociatedWithData: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool.isRequired,
  subNavNode: subNavNodePropTypes,
  observerProfiles: observersPropType.isRequired,
  observationOptions: inputOptionsPropTypes.isRequired,
  fishNameConstants: fishNameConstantsPropType,
  modalAttributeOptions: inputOptionsPropTypes.isRequired,
}

CollectRecordFormPage.defaultProps = {
  collectRecordBeingEdited: undefined,
  subNavNode: null,
  observationsReducer: [],
  fishNameConstants: [],
}

export default CollectRecordFormPage
