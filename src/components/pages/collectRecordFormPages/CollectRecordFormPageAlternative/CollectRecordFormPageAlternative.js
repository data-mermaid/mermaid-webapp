import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useHistory, useParams } from 'react-router-dom'
import { H2 } from '../../../generic/text'
import {
  managementRegimePropType,
  sitePropType,
  subNavNodePropTypes,
  observationsReducerPropType,
  observersPropType,
  fishBeltPropType,
  benthicPhotoQuadratPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'

import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { getToastArguments } from '../../../../library/getToastArguments'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import NewAttributeModal from '../../../NewAttributeModal'
import ObserversInput from '../ObserversInput'
import DeleteRecordButton from '../DeleteRecordButton'
import SampleEventInputs from '../SampleEventInputs'

import LoadingModal from '../../../LoadingModal/LoadingModal'
import RecordFormTitle from '../../../RecordFormTitle'
import RecordLevelInputValidationInfo from '../RecordLevelValidationInfo/RecordLevelValidationInfo'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import language from '../../../../language'
import { getIsReadOnlyUserRole } from '../../../../App/currentUserProfileHelpers'
import PageUnavailable from '../../PageUnavailable'
import {
  getRecordSampleUnitMethod,
  getRecordSampleUnit,
  getIsFishBelt,
} from '../../../../App/mermaidData/recordProtocolHelpers'
import { useScrollCheckError } from '../../../../library/useScrollCheckError'
import { ErrorBox, ErrorText } from '../CollectingFormPage.Styles'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'

const CollectRecordFormPageAlternative = ({
  collectRecordBeingEdited,
  handleCollectRecordChange,
  handleNewObservationAdd,
  // handleSubmitNewObservation, call it handle submit new attribute?? bake it into abstraction?

  idsNotAssociatedWithData,
  initialFormikFormValues,
  isNewRecord,
  isParentDataLoading,
  // managementRegimes,
  // modalAttributeOptions,
  observationsReducer,
  ObservationTable,
  // observerProfiles,
  sampleUnitFormatSaveFunction,
  sampleUnitName,
  SampleUnitTransectInputs,
  // sites,
  subNavNode,
}) => {
  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const { isSyncInProgress } = useSyncStatus()
  const [observerProfiles, setObserverProfiles] = useState([])
  const [newBenthicAttributeGeneraOptions, setNewBenthicAttributeGeneraOptions] = useState([])

  const observationTableRef = useRef(null)
  const currentProjectPath = useCurrentProjectPath()
  const { recordId, projectId } = useParams()
  const history = useHistory()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [observationsState] = observationsReducer

  const [isFormDirty, setIsFormDirty] = useState(false)
  const [areValidationsShowing, setAreValidationsShowing] = useState(false)
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [submitButtonState, setSubmitButtonState] = useState(buttonGroupStates.submittable)
  const [validateButtonState, setValidateButtonState] = useState(buttonGroupStates.validatable)
  const [isNewObservationModalOpen, setIsNewObservationModalOpen] = useState(false)

  const isReadOnlyUser = getIsReadOnlyUserRole(currentUser, projectId)
  const isFishBeltSampleUnit = getIsFishBelt(sampleUnitName)
  const recordLevelValidations = collectRecordBeingEdited?.validations?.results?.$record ?? []
  const validationsApiData = collectRecordBeingEdited?.validations?.results?.data ?? {}
  const displayLoadingModal =
    saveButtonState === buttonGroupStates.saving ||
    validateButtonState === buttonGroupStates.validating ||
    submitButtonState === buttonGroupStates.submitting

  useEffect(
    function loadDataCommonToCertainProtocols() {
      // this is created speculatively for benthic pit, benthic lit, bleaching, habitat complexity
      // it ignores fishbelt and benthic photo quadrat which use an older abstraction
      if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
        const promises = [
          databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
          databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
          databaseSwitchboardInstance.getProjectProfiles(projectId),
          databaseSwitchboardInstance.getFishGenera(),
        ]

        Promise.all(promises).then(
          ([sitesResponse, managementRegimesResponse, projectProfilesResponse, generaResponse]) => {
            const benthicAttributeGeneraOptions = generaResponse.map((genus) => ({
              label: genus.name,
              value: genus.id,
            }))

            setSites(sortArrayByObjectKey(sitesResponse, 'name'))
            setManagementRegimes(sortArrayByObjectKey(managementRegimesResponse, 'name'))
            setObserverProfiles(sortArrayByObjectKey(projectProfilesResponse, 'profile_name'))
            setNewBenthicAttributeGeneraOptions(benthicAttributeGeneraOptions)
          },
        )
      }
    },
    [databaseSwitchboardInstance, isSyncInProgress, projectId],
  )

  const { isErrorAbove, isErrorBelow } = useScrollCheckError()

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
    if (!isParentDataLoading) {
      setValidateButtonState(getValidationButtonStatus(collectRecordBeingEdited))
    }
  }, [isParentDataLoading, collectRecordBeingEdited])

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

  const formik = useFormik({
    initialValues: initialFormikFormValues,
    enableReinitialize: true,
    validate: persistUnsavedFormikData,
  })

  const handleSave = () => {
    const recordToSubmit = sampleUnitFormatSaveFunction(
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

  const deleteRecord = async () => {
    if (!isNewRecord) {
      return databaseSwitchboardInstance
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

    return undefined

    // return Promise.resolve()
  }

  const onSubmitNewBenthicAttribute = ({
    benthicAttributeParentId,
    benthicAttributeParentName,
    newBenthicAttributeName,
  }) => {
    return databaseSwitchboardInstance
      .addBenthicAttribute({
        benthicAttributeParentId,
        benthicAttributeParentName,
        newBenthicAttributeName,
      })
      .then((newBenthicAttribute) => {
        observationsDispatch({
          type: 'updateBenthicAttribute',
          payload: {
            observationId: newObservationToAdd,
            newBenthicAttribute: newBenthicAttribute.id,
          },
        })
        updateBenthicAttributeOptionsStateWithOfflineStorageData()
        toast.success(...getToastArguments(language.success.attributeSave('benthic attribute')))
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            if (error.message === 'Benthic attribute already exists') {
              toast.error(
                ...getToastArguments(language.error.attributeAlreadyExists('benthic attribute')),
              )

              observationsDispatch({
                type: 'updateBenthicAttribute',
                payload: {
                  observationId: newObservationToAdd,
                  newBenthicAttribute: error.existingBenthicAttribute.id,
                },
              })
            } else {
              toast.error(...getToastArguments(language.error.attributeSave('benthic attribute')))
            }
          },
        })
      })

    // return Promise.resolve()
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
          openNewObservationModal={openNewObservationModal}
          ignoreObservationValidations={ignoreObservationValidations}
          resetObservationValidations={resetObservationValidations}
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
          <ObservationTable
            openNewObservationModal={openNewObservationModal}
            ignoreObservationValidations={ignoreObservationValidations}
            resetObservationValidations={resetObservationValidations}
          />
        </div>
      </form>
      <DeleteRecordButton isNewRecord={isNewRecord} deleteRecord={deleteRecord} />
      {errorBoxContent}
    </>
  ) : (
    <PageUnavailable mainText={language.error.pageReadOnly} />
  )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isParentDataLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <>
      <ContentPageLayout
        isPageContentLoading={isParentDataLoading}
        isToolbarSticky={true}
        subNavNode={subNavNode}
        content={contentViewByRole}
        toolbar={
          <ContentPageToolbarWrapper>
            {isNewRecord && <H2>{getRecordSampleUnitMethod(sampleUnitName)}</H2>}
            {collectRecordBeingEdited && !isNewRecord && (
              <RecordFormTitle
                submittedRecordOrCollectRecordDataProperty={collectRecordBeingEdited?.data}
                sites={sites}
                sampleUnit={getRecordSampleUnit(sampleUnitName)}
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

      {/* this feature is new to me, but I would think to move it to a prop as well because the isFishBeltSampleUnit */}
      {!!projectId && !!currentUser && (
        <NewAttributeModal
          isFishBeltSampleUnit={isFishBeltSampleUnit}
          isOpen={isNewObservationModalOpen}
          onDismiss={closeNewObservationModal}
          onSubmit={onSubmitNewBenthicAttribute}
          modalAttributeOptions={newBenthicAttributeGeneraOptions}
        />
      )}
      {displayLoadingModal && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={formik.dirty} />
    </>
  )
}

CollectRecordFormPageAlternative.propTypes = {
  isNewRecord: PropTypes.bool.isRequired,
  collectRecordBeingEdited: PropTypes.oneOfType([fishBeltPropType, benthicPhotoQuadratPropType]),
  handleCollectRecordChange: PropTypes.func.isRequired,
  handleNewObservationAdd: PropTypes.func.isRequired,
  handleSubmitNewObservation: PropTypes.func.isRequired,
  idsNotAssociatedWithData: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialFormikFormValues: PropTypes.shape({}).isRequired,
  isParentDataLoading: PropTypes.bool.isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  modalAttributeOptions: inputOptionsPropTypes.isRequired,
  observationsReducer: observationsReducerPropType,
  ObservationTable: PropTypes.node.isRequired,
  observerProfiles: observersPropType.isRequired,
  sampleUnitFormatSaveFunction: PropTypes.func.isRequired,
  sampleUnitName: PropTypes.string.isRequired,
  SampleUnitTransectInputs: PropTypes.node.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  subNavNode: subNavNodePropTypes,
}

CollectRecordFormPageAlternative.defaultProps = {
  collectRecordBeingEdited: undefined,
  subNavNode: null,
  observationsReducer: [],
}

export default CollectRecordFormPageAlternative
