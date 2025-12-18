import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import {
  subNavNodePropTypes,
  fishBeltPropType,
  benthicPhotoQuadratPropType,
  observationsReducerPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import {
  ErrorBox,
  ErrorText,
  ErrorTextButton,
  ErrorTextSubmit,
  ErrorBoxSubmit,
} from '../CollectingFormPage.Styles'
import { getIsUserReadOnlyForProject } from '../../../../App/currentUserProfileHelpers'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getToastArguments } from '../../../../library/getToastArguments'
import { getDeleteModalText } from '../../../../library/getDeleteModalText'
import { H2 } from '../../../generic/text'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useScrollCheckError } from '../../../../library/useScrollCheckError'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import DeleteRecordButton from '../../../DeleteRecordButton'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import LoadingModal from '../../../LoadingModal/LoadingModal'
import ObserversInput from '../ObserversInput'
import PageUnavailable from '../../PageUnavailable'
import RecordFormTitle from '../../../RecordFormTitle'
import RecordLevelInputValidationInfo from '../RecordLevelValidationInfo'
import SampleEventInputs from '../SampleEventInputs'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import useCollectRecordValidation from './useCollectRecordValidation'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import useIsMounted from '../../../../library/useIsMounted'

function loadObservationsFromCollectRecordIntoTableState({
  collectRecordBeingEdited,
  formik,
  getPersistedUnsavedObservationsTableData,
  isNewRecord,
  observationsPropertyName,
  observationsTableDispatch,
  setObservationsTableReducerInitialized,
}) {
  const handleAddEmptyInitialObservation = () => {
    const { interval_size: intervalSize, interval_start: intervalStart } = formik.values

    observationsTableDispatch({
      type: 'addObservation',
      payload: { intervalSize, intervalStart },
    })
  }

  const persistedUnsavedObservationsTable = getPersistedUnsavedObservationsTableData()

  if (collectRecordBeingEdited && !isNewRecord) {
    const observationsFromApiTable = collectRecordBeingEdited.data[observationsPropertyName] ?? []

    const initialObservationsToLoadTable =
      persistedUnsavedObservationsTable ?? observationsFromApiTable

    if (initialObservationsToLoadTable.length) {
      observationsTableDispatch({
        type: 'loadObservationsFromApi',
        payload: initialObservationsToLoadTable,
      })
    }

    if (isNewRecord && !initialObservationsToLoadTable.length) {
      handleAddEmptyInitialObservation()
    }

    setObservationsTableReducerInitialized(true)
  }

  if (isNewRecord) {
    handleAddEmptyInitialObservation()

    if (persistedUnsavedObservationsTable?.length) {
      observationsTableDispatch({
        type: 'loadObservationsFromApi',
        payload: persistedUnsavedObservationsTable,
      })
    }

    setObservationsTableReducerInitialized(true)
  }
}

const CollectRecordFormPage = ({
  areObservationsInputsDirty,
  collectRecordBeingEdited = undefined,
  handleCollectRecordChange,
  idsNotAssociatedWithData,
  initialFormikFormValues,
  isNewRecord,
  isParentDataLoading,
  observationsTable1Reducer = [],
  observationsTable2Reducer = [],
  ObservationTable1,
  ObservationTable2 = undefined,
  isImageClassificationSelected = null,
  sampleUnitFormatSaveFunction,
  sampleUnitName,
  SampleUnitTransectInputs,
  setAreObservationsInputsDirty,
  setIdsNotAssociatedWithData,
  setIsNewBenthicAttributeModalOpen = () => {},
  setObservationIdToAddNewBenthicAttributeTo = () => {},
  subNavNode = null,
  isImageClassificationEnabledForUser = false,
}) => {
  const [areValidationsShowing, setAreValidationsShowing] = useState(false)
  const [choices, setChoices] = useState({})
  const [isCommonProtocolDataLoading, setIsCommonProtocolDataLoading] = useState(true)
  const [isDeleteRecordModalOpen, setIsDeleteRecordModalOpen] = useState(false)
  const [isDeletingRecord, setIsDeletingRecord] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [isObservationsTable1ReducerInitialized, setObservationsTable1ReducerInitialized] =
    useState(false)
  const [isObservationsTable2ReducerInitialized, setObservationsTable2ReducerInitialized] =
    useState(false)
  const [observationsTable1State, observationsTable1Dispatch] = observationsTable1Reducer
  const [observationsTable2State, observationsTable2Dispatch = () => {}] = observationsTable2Reducer
  const [observerProfiles, setObserverProfiles] = useState([])
  const [saveButtonState, setSaveButtonState] = useState(
    isNewRecord ? buttonGroupStates.untouchedEmptyForm : buttonGroupStates.saved,
  )
  const [sites, setSites] = useState([])
  const [submitButtonState, setSubmitButtonState] = useState(buttonGroupStates.submittable)
  const [validateButtonState, setValidateButtonState] = useState(buttonGroupStates.validatable)
  const displayLoadingModal =
    saveButtonState === buttonGroupStates.saving ||
    validateButtonState === buttonGroupStates.validating ||
    submitButtonState === buttonGroupStates.submitting
  const isLoading = isParentDataLoading || isCommonProtocolDataLoading
  const recordLevelValidations = collectRecordBeingEdited?.validations?.results?.$record ?? []
  const validationsApiData = collectRecordBeingEdited?.validations?.results?.data ?? {}
  const [isSubmitWarningVisible, setIsSubmitWarningVisible] = useState(false)

  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const navigate = useNavigate()
  const location = useLocation()
  const isMounted = useIsMounted()
  const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, projectId)
  const observationTableRef = useRef(null)
  const shouldPromptTrigger = isFormDirty && saveButtonState !== buttonGroupStates.saving // we need to prevent the user from seeing the dirty form prompt when a new record is saved (and that triggers a navigation to its new page)
  const isBenthicPQTNewRecordWithImageClassificationEnabled =
    isImageClassificationEnabledForUser && isNewRecord && sampleUnitName === 'benthicpqt'

  const { t } = useTranslation()

  const supportingDataUnavailableText = t('sample_units.errors.supporting_data_unavailable')
  const dataUnavailableText = t('sample_units.errors.data_unavailable')
  const deleteModalText = getDeleteModalText(t('sample_units.record'))

  const handleSitesChange = (updatedSiteRecords) => setSites(updatedSiteRecords)
  const handleManagementRegimesChange = (updatedManagementRegimeRecords) =>
    setManagementRegimes(updatedManagementRegimeRecords)

  const {
    persistUnsavedFormData: persistUnsavedFormikData,
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedSampleInfoInputs`)

  const {
    persistUnsavedFormData: persistUnsavedObservationsTable1Data,
    clearPersistedUnsavedFormData: clearPersistedUnsavedObservationsTable1Data,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsTable1Data,
  } = useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedObservationsTable1`)

  const {
    persistUnsavedFormData: persistUnsavedObservationsTable2Data,
    clearPersistedUnsavedFormData: clearPersistedUnsavedObservationsTable2Data,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsTable2Data,
  } = useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedObservationsTable2`)

  useEffect(
    function loadDataCommonToCertainProtocols() {
      if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
        const promises = [
          databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
          databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
          databaseSwitchboardInstance.getProjectProfiles(projectId),
          databaseSwitchboardInstance.getChoices(),
          databaseSwitchboardInstance.getProject(projectId),
        ]

        Promise.all(promises)
          .then(
            ([
              sitesResponse,
              managementRegimesResponse,
              projectProfilesResponse,
              choicesResponse,
              projectResponse,
            ]) => {
              if (isMounted.current) {
                if (!projectResponse && projectId) {
                  setIdsNotAssociatedWithData((previousState) => [...previousState, projectId])
                }

                setSites(sortArrayByObjectKey(sitesResponse, 'name'))
                setManagementRegimes(sortArrayByObjectKey(managementRegimesResponse, 'name'))
                setObserverProfiles(sortArrayByObjectKey(projectProfilesResponse, 'profile_name'))
                setChoices(choicesResponse)

                setIsCommonProtocolDataLoading(false)
              }
            },
          )
          .catch((error) => {
            handleHttpResponseError({
              error,
              callback: () => {
                const errorMessage = isNewRecord
                  ? supportingDataUnavailableText
                  : dataUnavailableText

                toast.error(...getToastArguments(errorMessage))
              },
            })
          })
      }
    },
    [
      databaseSwitchboardInstance,
      isSyncInProgress,
      projectId,
      handleHttpResponseError,
      isNewRecord,
      isMounted,
      setIdsNotAssociatedWithData,
      supportingDataUnavailableText,
      dataUnavailableText,
    ],
  )

  useEffect(
    function ensureUnsavedObservationsArePersisted() {
      if (areObservationsInputsDirty) {
        persistUnsavedObservationsTable1Data(observationsTable1State)
        persistUnsavedObservationsTable2Data(observationsTable2State)
      }
    },
    [
      areObservationsInputsDirty,
      observationsTable1State,
      observationsTable2State,
      persistUnsavedObservationsTable1Data,
      persistUnsavedObservationsTable2Data,
    ],
  )

  useEffect(
    function setCollectButtonsUnsavedIfFormDirty() {
      if (isFormDirty) {
        setSaveButtonState(buttonGroupStates.unsaved)
      }
    },
    [isFormDirty, setSaveButtonState],
  )

  const { isErrorAbove, isErrorBelow } = useScrollCheckError()

  const formik = useFormik({
    initialValues: initialFormikFormValues,
    enableReinitialize: true,
    validate: persistUnsavedFormikData,
  })

  const _setIsFormDirty = useEffect(() => {
    setIsFormDirty(
      areObservationsInputsDirty ||
        !!formik.dirty ||
        !!getPersistedUnsavedFormikData() ||
        !!getPersistedUnsavedObservationsTable1Data() ||
        !!getPersistedUnsavedObservationsTable2Data(),
    )
  }, [
    areObservationsInputsDirty,
    formik.dirty,
    getPersistedUnsavedFormikData,
    getPersistedUnsavedObservationsTable1Data,
    getPersistedUnsavedObservationsTable2Data,
  ])

  useEffect(
    function initializeObservationReducerTable1() {
      if (!isObservationsTable1ReducerInitialized) {
        loadObservationsFromCollectRecordIntoTableState({
          collectRecordBeingEdited,
          formik,
          getPersistedUnsavedObservationsTableData: getPersistedUnsavedObservationsTable1Data,
          isNewRecord,
          observationsPropertyName: getObservationsPropertyNames(collectRecordBeingEdited)[0],
          observationsTableDispatch: observationsTable1Dispatch,
          setObservationsTableReducerInitialized: setObservationsTable1ReducerInitialized,
        })
      }
    },

    [
      collectRecordBeingEdited,
      formik,
      getPersistedUnsavedObservationsTable1Data,
      isNewRecord,
      isObservationsTable1ReducerInitialized,
      observationsTable1Dispatch,
    ],
  )

  useEffect(
    function initializeObservationReducerTable2() {
      if (!isObservationsTable2ReducerInitialized) {
        loadObservationsFromCollectRecordIntoTableState({
          collectRecordBeingEdited,
          formik,
          getPersistedUnsavedObservationsTableData: getPersistedUnsavedObservationsTable2Data,
          isNewRecord,
          observationsPropertyName: getObservationsPropertyNames(collectRecordBeingEdited)[1],
          observationsTableDispatch: observationsTable2Dispatch,
          setObservationsTableReducerInitialized: setObservationsTable2ReducerInitialized,
        })
      }
    },

    [
      collectRecordBeingEdited,
      formik,
      getPersistedUnsavedObservationsTable2Data,
      isNewRecord,
      isObservationsTable2ReducerInitialized,
      observationsTable2Dispatch,
    ],
  )

  const {
    handleScrollToObservation,
    handleValidate,
    ignoreNonObservationFieldValidations,
    ignoreObservationValidations,
    ignoreRecordLevelValidation,
    resetNonObservationFieldValidations,
    resetObservationValidations,
    resetRecordLevelValidation,
    validationPropertiesWithDirtyResetOnInputChange,
  } = useCollectRecordValidation({
    collectRecordBeingEdited,
    databaseSwitchboardInstance,
    formikInstance: formik,
    handleCollectRecordChange,
    isParentDataLoading,
    observationTableRef,
    projectId,
    recordId,
    setAreValidationsShowing,
    setIsFormDirty,
    setValidateButtonState,
    setIsSubmitWarningVisible,
  })

  const handleSave = () => {
    const originalImageClassification = collectRecordBeingEdited?.data?.image_classification

    // ensure image_classification is not overwritten after it has been saved the first time.
    const imageClassificationToSave =
      originalImageClassification === undefined || originalImageClassification === null
        ? isImageClassificationSelected
        : originalImageClassification

    const recordToSubmit = sampleUnitFormatSaveFunction({
      collectRecordBeingEdited,
      formikValues: formik.values,
      observationsTable1State,
      observationsTable2State,
      image_classification: imageClassificationToSave,
    })

    setSaveButtonState(buttonGroupStates.saving)
    setAreValidationsShowing(false)
    setIsSubmitWarningVisible(false)

    databaseSwitchboardInstance
      .saveSampleUnit({
        record: recordToSubmit,
        profileId: currentUser.id,
        projectId,
        protocol: sampleUnitName,
        image_classification: isImageClassificationSelected,
      })
      .then((collectRecordResponse) => {
        setIsFormDirty(false)
        formik.resetForm({ values: formik.values }) // this resets formik's dirty state
        toast.success(...getToastArguments(t('sample_units.success.record_saved')))
        clearPersistedUnsavedFormikData()
        clearPersistedUnsavedObservationsTable1Data()
        clearPersistedUnsavedObservationsTable2Data()
        setAreObservationsInputsDirty(false)
        setSaveButtonState(buttonGroupStates.saved)
        setValidateButtonState(buttonGroupStates.validatable)
        handleCollectRecordChange(collectRecordResponse)

        if (isNewRecord) {
          navigate(`${ensureTrailingSlash(location.pathname)}${collectRecordResponse.id}`)
        }
      })
      .catch((error) => {
        setSaveButtonState(buttonGroupStates.unsaved)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(t('sample_units.errors.save_failed')))
          },
        })
      })
  }

  const handleSubmit = () => {
    setSubmitButtonState(buttonGroupStates.submitting)

    databaseSwitchboardInstance
      .submitSampleUnit({ recordId, projectId })
      .then(() => {
        toast.success(...getToastArguments(t('sample_units.success.record_submitted')))
        navigate(`${ensureTrailingSlash(currentProjectPath)}collecting/`)
      })
      .catch((error) => {
        setSubmitButtonState(buttonGroupStates.submittable)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(t('sample_units.errors.submit_failed')))
          },
        })
      })
  }

  const _handleSaveObservationTableType = useEffect(() => {
    if (isImageClassificationSelected !== null) {
      handleSave()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImageClassificationSelected])

  const openDeleteRecordModal = () => {
    setIsDeleteRecordModalOpen(true)
  }
  const closeDeleteRecordModal = () => {
    setIsDeleteRecordModalOpen(false)
  }

  const deleteRecord = () => {
    setIsDeletingRecord(true)

    databaseSwitchboardInstance
      .deleteSampleUnit({
        record: collectRecordBeingEdited,
        profileId: currentUser.id,
        projectId,
      })
      .then(() => {
        clearPersistedUnsavedFormikData()
        clearPersistedUnsavedObservationsTable1Data()
        clearPersistedUnsavedObservationsTable2Data()
        closeDeleteRecordModal()
        setIsDeletingRecord(false)
        toast.success(...getToastArguments(t('sample_units.success.record_deleted')))
        navigate(`${ensureTrailingSlash(currentProjectPath)}collecting/`)
      })
      .catch((error) => {
        setIsDeletingRecord(false)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(t('sample_units.errors.delete_failed')))
          },
        })
      })
  }

  const handleDismissSubmitWarning = () => {
    setIsSubmitWarningVisible(false)
  }

  const errorBoxContent = (
    <ErrorBox>
      {
        <ErrorText isErrorShown={isErrorAbove}>
          {t('sample_units.validation.warning_or_error')}
        </ErrorText>
      }
      {
        <ErrorText isErrorShown={isErrorBelow}>
          {t('sample_units.validation.warning_or_error')}
        </ErrorText>
      }
    </ErrorBox>
  )

  const contentViewByRole = !isReadOnlyUser ? (
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
        {!isBenthicPQTNewRecordWithImageClassificationEnabled && (
          <SampleEventInputs
            areValidationsShowing={areValidationsShowing}
            collectRecord={collectRecordBeingEdited}
            formik={formik}
            managementRegimes={managementRegimes}
            handleManagementRegimesChange={handleManagementRegimesChange}
            sites={sites}
            handleSitesChange={handleSitesChange}
            ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
            resetNonObservationFieldValidations={resetNonObservationFieldValidations}
            validationPropertiesWithDirtyResetOnInputChange={
              validationPropertiesWithDirtyResetOnInputChange
            }
          />
        )}
        {!isBenthicPQTNewRecordWithImageClassificationEnabled && (
          <SampleUnitTransectInputs
            areValidationsShowing={areValidationsShowing}
            choices={choices}
            formik={formik}
            ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
            resetNonObservationFieldValidations={resetNonObservationFieldValidations}
            validationsApiData={validationsApiData}
            validationPropertiesWithDirtyResetOnInputChange={
              validationPropertiesWithDirtyResetOnInputChange
            }
            isImageClassificationSelected={collectRecordBeingEdited?.data?.image_classification}
          />
        )}
        {!isBenthicPQTNewRecordWithImageClassificationEnabled && (
          <ObserversInput
            data-testid="observers"
            areValidationsShowing={areValidationsShowing}
            formik={formik}
            ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
            usersBelongingToProject={observerProfiles}
            resetNonObservationFieldValidations={resetNonObservationFieldValidations}
            validationsApiData={validationsApiData}
            validationPropertiesWithDirtyResetOnInputChange={
              validationPropertiesWithDirtyResetOnInputChange
            }
          />
        )}
        <div ref={observationTableRef}>
          <ObservationTable1
            testId="observations-section"
            areValidationsShowing={areValidationsShowing}
            choices={choices}
            collectRecord={collectRecordBeingEdited}
            formik={formik}
            ignoreObservationValidations={ignoreObservationValidations}
            observationsReducer={observationsTable1Reducer}
            resetObservationValidations={resetObservationValidations}
            setAreObservationsInputsDirty={setAreObservationsInputsDirty}
            setIsNewBenthicAttributeModalOpen={setIsNewBenthicAttributeModalOpen}
            setObservationIdToAddNewBenthicAttributeTo={setObservationIdToAddNewBenthicAttributeTo}
          />
        </div>
        {ObservationTable2 ? (
          <ObservationTable2
            testId="observations2-section"
            areValidationsShowing={areValidationsShowing}
            choices={choices}
            collectRecord={collectRecordBeingEdited}
            formik={formik}
            ignoreObservationValidations={ignoreObservationValidations}
            observationsReducer={observationsTable2Reducer}
            resetObservationValidations={resetObservationValidations}
            setAreObservationsInputsDirty={setAreObservationsInputsDirty}
            setIsNewBenthicAttributeModalOpen={setIsNewBenthicAttributeModalOpen}
            setObservationIdToAddNewBenthicAttributeTo={setObservationIdToAddNewBenthicAttributeTo}
          />
        ) : null}
      </form>
      {!isBenthicPQTNewRecordWithImageClassificationEnabled && (
        <DeleteRecordButton
          isLoading={isDeletingRecord}
          isNewRecord={isNewRecord}
          isOpen={isDeleteRecordModalOpen}
          modalText={deleteModalText}
          deleteRecord={deleteRecord}
          onDismiss={closeDeleteRecordModal}
          openModal={openDeleteRecordModal}
        />
      )}
      {!isSubmitWarningVisible ? errorBoxContent : null}
    </>
  ) : (
    <PageUnavailable mainText={t('page.read_only')} />
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
        content={contentViewByRole}
        toolbar={
          <ContentPageToolbarWrapper>
            {isNewRecord && (
              <H2 data-testid={`${sampleUnitName}-page-title`}>
                {t(`protocol_titles.${sampleUnitName}`)}
              </H2>
            )}
            {collectRecordBeingEdited && !isNewRecord && (
              <RecordFormTitle
                submittedRecordOrCollectRecordDataProperty={collectRecordBeingEdited?.data}
                sites={sites}
                protocol={sampleUnitName}
              />
            )}
            {!isReadOnlyUser && (
              <SaveValidateSubmitButtonGroup
                isNewRecord={isNewRecord}
                saveButtonState={saveButtonState}
                validateButtonState={validateButtonState}
                submitButtonState={submitButtonState}
                onValidate={handleValidate}
                onSave={handleSave}
                onSubmit={handleSubmit}
              />
            )}
            <ErrorBoxSubmit>
              <ErrorTextSubmit isErrorShown={isSubmitWarningVisible}>
                {t('sample_units.errors.submit_disabled')}
                <ErrorTextButton type="submit" onClick={handleDismissSubmitWarning}>
                  x
                </ErrorTextButton>
              </ErrorTextSubmit>
            </ErrorBoxSubmit>
          </ContentPageToolbarWrapper>
        }
      />

      {displayLoadingModal && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={shouldPromptTrigger} />
    </>
  )
}

CollectRecordFormPage.propTypes = {
  areObservationsInputsDirty: PropTypes.bool.isRequired,
  collectRecordBeingEdited: PropTypes.oneOfType([fishBeltPropType, benthicPhotoQuadratPropType]),
  handleCollectRecordChange: PropTypes.func.isRequired,
  idsNotAssociatedWithData: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialFormikFormValues: PropTypes.shape({}).isRequired,
  isNewRecord: PropTypes.bool.isRequired,
  isParentDataLoading: PropTypes.bool.isRequired,
  observationsTable1Reducer: observationsReducerPropType,
  observationsTable2Reducer: PropTypes.array,
  ObservationTable1: PropTypes.elementType.isRequired,
  ObservationTable2: PropTypes.elementType,
  sampleUnitFormatSaveFunction: PropTypes.func.isRequired,
  sampleUnitName: PropTypes.string.isRequired,
  SampleUnitTransectInputs: PropTypes.elementType.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  setIdsNotAssociatedWithData: PropTypes.func.isRequired,
  setIsNewBenthicAttributeModalOpen: PropTypes.func,
  setObservationIdToAddNewBenthicAttributeTo: PropTypes.func,
  subNavNode: subNavNodePropTypes,
  isImageClassificationSelected: PropTypes.bool,
  isImageClassificationEnabledForUser: PropTypes.bool,
}

export default CollectRecordFormPage
