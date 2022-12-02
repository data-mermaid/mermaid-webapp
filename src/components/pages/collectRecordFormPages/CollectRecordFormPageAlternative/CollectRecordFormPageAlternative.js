import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'

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
import { ErrorBox, ErrorText } from '../CollectingFormPage.Styles'
import { getIsReadOnlyUserRole } from '../../../../App/currentUserProfileHelpers'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getToastArguments } from '../../../../library/getToastArguments'
import { H2 } from '../../../generic/text'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
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
import language from '../../../../language'
import LoadingModal from '../../../LoadingModal/LoadingModal'
import ObserversInput from '../ObserversInput'
import PageUnavailable from '../../PageUnavailable'
import RecordFormTitle from '../../../RecordFormTitle'
import RecordLevelInputValidationInfo from '../RecordLevelValidationInfo/RecordLevelValidationInfo'
import SampleEventInputs from '../SampleEventInputs'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import useCollectRecordValidation from './useCollectRecordValidation'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import useIsMounted from '../../../../library/useIsMounted'

const CollectRecordFormPageAlternative = ({
  areObservationsInputsDirty,
  benthicAttributeSelectOptions,
  collectRecordBeingEdited,
  handleCollectRecordChange,
  idsNotAssociatedWithData,
  initialFormikFormValues,
  isNewRecord,
  isParentDataLoading,
  observationsTable1Reducer,
  ObservationTable1,
  sampleUnitFormatSaveFunction,
  sampleUnitName,
  SampleUnitTransectInputs,
  setAreObservationsInputsDirty,
  setIdsNotAssociatedWithData,
  setIsNewBenthicAttributeModalOpen,
  setObservationIdToAddNewBenthicAttributeTo,
  subNavNode,
}) => {
  // This component is a more flexible abstraction for collect records.
  // We are makign a new abstraction for the existing for the sake of timelines.
  // tech debt ticket to refactor away old abstraction:
  // https://trello.com/c/IBEfA5bn/799-tech-debt-refactor-fishbelt-and-benthic-photo-quadrat-to-use-same-collect-record-abstraction-as-other-protocols

  const [areValidationsShowing, setAreValidationsShowing] = useState(false)
  const [choices, setChoices] = useState({})
  const [isCommonProtocolDataLoading, setIsCommonProtocolDataLoading] = useState(true)
  const [isDeleteRecordModalOpen, setIsDeleteRecordModalOpen] = useState(false)
  const [isDeletingRecord, setIsDeletingRecord] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [apiObservationsTable1Loaded, setApiObservationsTable1Loaded] = useState(false)
  const [observationsTable1State, observationsTable1Dispatch] = observationsTable1Reducer // eslint-disable-line no-unused-vars
  const [observerProfiles, setObserverProfiles] = useState([])
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
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

  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const history = useHistory()
  const isMounted = useIsMounted()
  const isReadOnlyUser = getIsReadOnlyUserRole(currentUser, projectId)
  const observationTableRef = useRef(null)

  const {
    persistUnsavedFormData: persistUnsavedObservationsData,
    clearPersistedUnsavedFormData: clearPersistedUnsavedObservationsData,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsData,
  } = useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedObservations`)

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
                  ? language.error.collectRecordChoicesUnavailable
                  : language.error.collectRecordUnavailable

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
    ],
  )

  useEffect(
    function ensureUnsavedObservationsArePersisted() {
      if (areObservationsInputsDirty) {
        persistUnsavedObservationsData(observationsTable1State)
      }
    },
    [areObservationsInputsDirty, observationsTable1State, persistUnsavedObservationsData],
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

  const {
    persistUnsavedFormData: persistUnsavedFormikData,
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedSampleInfoInputs`)

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
        !!getPersistedUnsavedObservationsData(),
    )
  }, [
    areObservationsInputsDirty,
    formik.dirty,
    getPersistedUnsavedFormikData,
    getPersistedUnsavedObservationsData,
  ])

  useEffect(
    function loadObservationsFromCollectRecordIntoState() {
      if (!apiObservationsTable1Loaded && collectRecordBeingEdited) {
        const observationsFromApiTable1 =
          collectRecordBeingEdited.data[
            getObservationsPropertyNames(collectRecordBeingEdited)[0]
          ] ?? []

        const persistedUnsavedObservations = getPersistedUnsavedObservationsData()
        const initialObservationsToLoad = persistedUnsavedObservations ?? observationsFromApiTable1

        observationsTable1Dispatch({
          type: 'loadObservationsFromApi',
          payload: initialObservationsToLoad,
        })

        setApiObservationsTable1Loaded(true)
      }
    },
    [
      apiObservationsTable1Loaded,
      collectRecordBeingEdited,
      getPersistedUnsavedObservationsData,
      observationsTable1Dispatch,
    ],
  )

  const {
    handleChangeForDirtyIgnoredInput,
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
  })

  const handleSave = () => {
    const recordToSubmit = sampleUnitFormatSaveFunction({
      formikValues: formik.values,
      observationTable1State: observationsTable1State,
      collectRecordBeingEdited,
    })

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
        clearPersistedUnsavedObservationsData()
        closeDeleteRecordModal()
        setIsDeletingRecord(false)
        toast.success(...getToastArguments(language.success.collectRecordDelete))
        history.push(`${ensureTrailingSlash(currentProjectPath)}collecting/`)
      })
      .catch((error) => {
        setIsDeletingRecord(false)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.collectRecordDelete))
          },
        })
      })
  }

  const errorBoxContent = (
    <ErrorBox>
      {<ErrorText isErrorShown={isErrorAbove}>{language.error.onPageWarningAbove}</ErrorText>}
      {<ErrorText isErrorShown={isErrorBelow}>{language.error.onPageWarningBelow}</ErrorText>}
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
        <SampleUnitTransectInputs
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
        <div ref={observationTableRef}>
          <ObservationTable1
            testId="observations-section"
            areValidationsShowing={areValidationsShowing}
            benthicAttributeSelectOptions={benthicAttributeSelectOptions}
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
      </form>
      <DeleteRecordButton
        isLoading={isDeletingRecord}
        isNewRecord={isNewRecord}
        isOpen={isDeleteRecordModalOpen}
        modalText={language.deleteRecord('Record')}
        deleteRecord={deleteRecord}
        onDismiss={closeDeleteRecordModal}
        openModal={openDeleteRecordModal}
      />
      {errorBoxContent}
    </>
  ) : (
    <PageUnavailable mainText={language.error.pageReadOnly} />
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
            {isNewRecord && <H2>{language.protocolTitles[sampleUnitName]}</H2>}
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
          </ContentPageToolbarWrapper>
        }
      />

      {displayLoadingModal && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={formik.dirty} />
    </>
  )
}

CollectRecordFormPageAlternative.propTypes = {
  areObservationsInputsDirty: PropTypes.bool.isRequired,
  benthicAttributeSelectOptions: inputOptionsPropTypes.isRequired,
  collectRecordBeingEdited: PropTypes.oneOfType([fishBeltPropType, benthicPhotoQuadratPropType]),
  handleCollectRecordChange: PropTypes.func.isRequired,
  idsNotAssociatedWithData: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialFormikFormValues: PropTypes.shape({}).isRequired,
  isNewRecord: PropTypes.bool.isRequired,
  isParentDataLoading: PropTypes.bool.isRequired,
  observationsTable1Reducer: observationsReducerPropType,
  ObservationTable1: PropTypes.elementType.isRequired,
  sampleUnitFormatSaveFunction: PropTypes.func.isRequired,
  sampleUnitName: PropTypes.string.isRequired,
  SampleUnitTransectInputs: PropTypes.elementType.isRequired,
  setAreObservationsInputsDirty: PropTypes.func.isRequired,
  setIdsNotAssociatedWithData: PropTypes.func.isRequired,
  setIsNewBenthicAttributeModalOpen: PropTypes.func.isRequired,
  setObservationIdToAddNewBenthicAttributeTo: PropTypes.func.isRequired,
  subNavNode: subNavNodePropTypes,
}

CollectRecordFormPageAlternative.defaultProps = {
  collectRecordBeingEdited: undefined,
  subNavNode: null,
  observationsTable1Reducer: [],
}

export default CollectRecordFormPageAlternative
