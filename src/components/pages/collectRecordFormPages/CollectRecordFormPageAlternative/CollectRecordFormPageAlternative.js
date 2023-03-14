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
import {
  ErrorBox,
  ErrorText,
  ErrorTextButton,
  ErrorTextSubmit,
  ErrorBoxSubmit,
} from '../CollectingFormPage.Styles'
import { getIsReadOnlyUserRole } from '../../../../App/currentUserProfileHelpers'
import { getObservationsPropertyNames } from '../../../../App/mermaidData/recordProtocolHelpers'
import { getToastArguments } from '../../../../library/getToastArguments'
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
  collectRecordBeingEdited,
  handleCollectRecordChange,
  idsNotAssociatedWithData,
  initialFormikFormValues,
  isNewRecord,
  isParentDataLoading,
  observationsTable1Reducer,
  observationsTable2Reducer,
  ObservationTable1,
  ObservationTable2,
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
  const [apiObservationsLoaded, setApiObservationsLoaded] = useState(false)
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
  const history = useHistory()
  const isMounted = useIsMounted()
  const isReadOnlyUser = getIsReadOnlyUserRole(currentUser, projectId)
  const observationTableRef = useRef(null)

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
                  ? language.error.collectRecordSupportingDataUnavailable
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
    function loadObservationsFromCollectRecordIntoState() {
      if (!apiObservationsLoaded && collectRecordBeingEdited) {
        const observationsFromApiTable1 =
          collectRecordBeingEdited.data[
            getObservationsPropertyNames(collectRecordBeingEdited)[0]
          ] ?? []
        const observationsFromApiTable2 =
          collectRecordBeingEdited.data[
            getObservationsPropertyNames(collectRecordBeingEdited)[1]
          ] ?? []

        const persistedUnsavedObservationsTable1 = getPersistedUnsavedObservationsTable1Data()
        const persistedUnsavedObservationsTable2 = getPersistedUnsavedObservationsTable2Data()
        const initialObservationsToLoadTable1 =
          persistedUnsavedObservationsTable1 ?? observationsFromApiTable1
        const initialObservationsToLoadTable2 =
          persistedUnsavedObservationsTable2 ?? observationsFromApiTable2

        observationsTable1Dispatch({
          type: 'loadObservationsFromApi',
          payload: initialObservationsToLoadTable1,
        })

        observationsTable2Dispatch({
          type: 'loadObservationsFromApi',
          payload: initialObservationsToLoadTable2,
        })

        setApiObservationsLoaded(true)
      }
    },
    [
      apiObservationsLoaded,
      collectRecordBeingEdited,
      getPersistedUnsavedObservationsTable1Data,
      getPersistedUnsavedObservationsTable2Data,
      observationsTable1Dispatch,
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
    const recordToSubmit = sampleUnitFormatSaveFunction({
      collectRecordBeingEdited,
      formikValues: formik.values,
      observationsTable1State,
      observationsTable2State,
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
      })
      .then((responseCollectRecord) => {
        toast.success(...getToastArguments(language.success.collectRecordSave))
        clearPersistedUnsavedFormikData()
        clearPersistedUnsavedObservationsTable1Data()
        clearPersistedUnsavedObservationsTable2Data()
        setAreObservationsInputsDirty(false)
        setSaveButtonState(buttonGroupStates.saved)
        setValidateButtonState(buttonGroupStates.validatable)
        setIsFormDirty(false)
        formik.resetForm({ values: formik.values }) // this resets formik's dirty state
        handleCollectRecordChange(responseCollectRecord)

        if (isNewRecord) {
          history.push(
            `${ensureTrailingSlash(history.location.pathname)}${responseCollectRecord.id}`,
          )
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
        clearPersistedUnsavedObservationsTable1Data()
        clearPersistedUnsavedObservationsTable2Data()
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

  const handleDismissSubmitWarning = () => {
    setIsSubmitWarningVisible(false)
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
          handleManagementRegimesChange={handleManagementRegimesChange}
          sites={sites}
          handleSitesChange={handleSitesChange}
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
      <DeleteRecordButton
        isLoading={isDeletingRecord}
        isNewRecord={isNewRecord}
        isOpen={isDeleteRecordModalOpen}
        modalText={language.deleteRecord('Record')}
        deleteRecord={deleteRecord}
        onDismiss={closeDeleteRecordModal}
        openModal={openDeleteRecordModal}
      />
      {!isSubmitWarningVisible ? errorBoxContent : null}
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
            <ErrorBoxSubmit>
              <ErrorTextSubmit isErrorShown={isSubmitWarningVisible}>
                {language.error.collectRecordSubmitDisabled}
                <ErrorTextButton type="submit" onClick={handleDismissSubmitWarning}>
                  x
                </ErrorTextButton>
              </ErrorTextSubmit>
            </ErrorBoxSubmit>
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
  collectRecordBeingEdited: PropTypes.oneOfType([fishBeltPropType, benthicPhotoQuadratPropType]),
  handleCollectRecordChange: PropTypes.func.isRequired,
  idsNotAssociatedWithData: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialFormikFormValues: PropTypes.shape({}).isRequired,
  isNewRecord: PropTypes.bool.isRequired,
  isParentDataLoading: PropTypes.bool.isRequired,
  observationsTable1Reducer: observationsReducerPropType,
  observationsTable2Reducer: observationsReducerPropType,
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
}

CollectRecordFormPageAlternative.defaultProps = {
  collectRecordBeingEdited: undefined,
  observationsTable1Reducer: [],
  observationsTable2Reducer: [[], () => {}],
  ObservationTable2: undefined,
  setIsNewBenthicAttributeModalOpen: () => {},
  setObservationIdToAddNewBenthicAttributeTo: () => {},
  subNavNode: null,
}

export default CollectRecordFormPageAlternative
