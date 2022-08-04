import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useReducer, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useHistory, useParams } from 'react-router-dom'

import BenthicAttributeTransectInputs from './BenthicAttributeTransectInputs'
import BenthicPhotoQuadratObservationTable from './BenthicPhotoQuadratObservationTable'
import benthicpqtObservationReducer from './benthicpqtObservationReducer'
import { ButtonCaution } from '../../../generic/buttons'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { DeleteRecordButtonCautionWrapper } from '../CollectingFormPage.Styles'
import DeleteRecordConfirm from '../DeleteRecordConfirm/DeleteRecordConfirm'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
  getBenthicPhotoQuadratAdditionalValues,
} from '../collectRecordFormInitialValues'
import { getBenthicOptions } from '../../../../library/getOptions'
import { getRecordName } from '../../../../library/getRecordName'
import { getToastArguments } from '../../../../library/getToastArguments'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import { H2 } from '../../../generic/text'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import language from '../../../../language'
import LoadingModal from '../../../LoadingModal/LoadingModal'
import NewBenthicAttributeModal from '../../../NewBenthicAttributeModal'
import ObserversInput from '../ObserversInput'
import { reformatFormValuesIntoBenthicPQTRecord } from './reformatFormValuesIntoBenthicPQTRecord'
import RecordFormTitle from '../../../RecordFormTitle'
import RecordLevelInputValidationInfo from '../RecordLevelValidationInfo/RecordLevelValidationInfo'
import SampleEventInputs from '../SampleEventInputs'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../../library/useIsMounted'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../useUnsavedDirtyFormUtilities'
import { useLogout } from '../../../../App/LogoutContext'
import handleGenericApiErrors from '../../../../library/handleGenericApiErrors'

const BenthicPhotoQuadrat = ({ isNewRecord }) => {
  const OBSERVERS_VALIDATION_PATH = 'data.observers'
  const observationTableRef = useRef(null)

  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const history = useHistory()
  const isMounted = useIsMounted()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const logoutMermaid = useLogout()
  const observationsReducer = useReducer(benthicpqtObservationReducer, [])
  const [observationsState, observationsDispatch] = observationsReducer

  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [areValidationsShowing, setAreValidationsShowing] = useState(false)
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [choices, setChoices] = useState({})
  const [benthicAttributeOptions, setBenthicAttributeOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewBenthicAttributeModalOpen, setIsNewBenthicAttributeModalOpen] = useState(false)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [observerProfiles, setObserverProfiles] = useState([])
  const [observationToAddAttributesTo, setObservationToAddAttributesTo] = useState()
  const [projectName, setProjectName] = useState('')
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sites, setSites] = useState([])
  const [submitButtonState, setSubmitButtonState] = useState(buttonGroupStates.submittable)
  const [subNavNode, setSubNavNode] = useState(null)
  const [validateButtonState, setValidateButtonState] = useState(buttonGroupStates.validatable)

  const recordLevelValidations = collectRecordBeingEdited?.validations?.results?.$record ?? []
  const displayLoadingModal =
    saveButtonState === buttonGroupStates.saving ||
    validateButtonState === buttonGroupStates.validating ||
    submitButtonState === buttonGroupStates.submitting

  const getValidationButtonStatus = (collectRecord) => {
    return collectRecord?.validations?.status === 'ok'
      ? buttonGroupStates.validated
      : buttonGroupStates.validatable
  }

  const openNewBenthicAttributeModal = useCallback((observationId) => {
    setObservationToAddAttributesTo(observationId)
    setIsNewBenthicAttributeModalOpen(true)
  }, [])

  const closeNewBenthicAttributeModal = () => {
    setIsNewBenthicAttributeModalOpen(false)
  }
  const showDeleteConfirmPrompt = () => {
    setShowDeleteModal(true)
  }
  const closeDeleteConfirmPrompt = () => {
    setShowDeleteModal(false)
  }
  const handleScrollToObservation = () => {
    observationTableRef.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const updateBenthicAttributeOptionsStateWithOfflineStorageData = useCallback(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getBenthicAttributes().then((benthicAttributes) => {
        const updatedBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

        setBenthicAttributeOptions(updatedBenthicAttributeOptions)
      })
    }
  }, [databaseSwitchboardInstance])

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
        databaseSwitchboardInstance.getBenthicAttributes(),
        databaseSwitchboardInstance.getProject(projectId),
      ]

      if (recordId && !isNewRecord) {
        promises.push(databaseSwitchboardInstance.getCollectRecord(recordId))
      }
      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            projectProfilesResponse,
            benthicAttributes,
            projectResponse,

            // collectRecord needs to be last in array because its pushed to the promise array conditionally
            collectRecordResponse,
          ]) => {
            if (isMounted.current) {
              if (!isNewRecord && !collectRecordResponse && recordId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, recordId])
              }
              if (!isNewRecord && !projectResponse && projectId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, projectId])
              }

              const recordNameForSubNode =
                !isNewRecord && collectRecordResponse
                  ? getRecordName(collectRecordResponse.data, sitesResponse, 'quadrat_transect')
                  : { name: 'Benthic Photo Quadrat' }

              const updateBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

              setSites(sortArrayByObjectKey(sitesResponse, 'name'))
              setManagementRegimes(sortArrayByObjectKey(managementRegimesResponse, 'name'))
              setChoices(choicesResponse)
              setObserverProfiles(sortArrayByObjectKey(projectProfilesResponse, 'profile_name'))
              setBenthicAttributeOptions(updateBenthicAttributeOptions)
              setProjectName(projectResponse.name)
              setCollectRecordBeingEdited(collectRecordResponse)
              setSubNavNode(recordNameForSubNode)
              setIsLoading(false)
              setValidateButtonState(getValidationButtonStatus(collectRecordResponse))
            }
          },
        )
        .catch((error) => {
          handleGenericApiErrors({
            error,
            callback: () => {
              const errorMessage = isNewRecord
                ? language.error.collectRecordChoicesUnavailable
                : language.error.collectRecordUnavailable

              toast.error(...getToastArguments(errorMessage))
            },
            logoutMermaid,
          })

        })
    }
  }, [databaseSwitchboardInstance, isMounted, isNewRecord, recordId, projectId, isSyncInProgress, logoutMermaid])

  const {
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities('unsavedSampleInfoInputs')

  const persistUnsavedObservationsUtilities =
    useUnsavedDirtyFormDataUtilities('unsavedObservations')

  const {
    clearPersistedUnsavedFormData: clearPersistedUnsavedObservationsData,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsData,
  } = persistUnsavedObservationsUtilities

  const onSubmitNewBenthicAttribute = ({
    benthicAttributeParentId,
    benthicAttributeParentName,
    newBenthicAttributeName,
  }) => {
    databaseSwitchboardInstance
      .addBenthicAttribute({
        benthicAttributeParentId,
        benthicAttributeParentName,
        newBenthicAttributeName,
      })
      .then((newBenthicAttribute) => {
        observationsDispatch({
          type: 'updateBenthicAttribute',
          payload: {
            observationId: observationToAddAttributesTo,
            newBenthicAttribute: newBenthicAttribute.id,
          },
        })
        updateBenthicAttributeOptionsStateWithOfflineStorageData()
        toast.success(...getToastArguments(language.success.attributeSave('benthic attribute')))
      })
      .catch((error) => {
        handleGenericApiErrors({
          error,
          callback: () => {
            if (error.message === 'Benthic attribute already exists') {
              toast.error(
                ...getToastArguments(language.error.attributeAlreadyExists('benthic attribute')),
              )

              observationsDispatch({
                type: 'updateBenthicAttribute',
                payload: {
                  observationId: observationToAddAttributesTo,
                  newBenthicAttribute: error.existingBenthicAttribute.id,
                },
              })
            } else {
              toast.error(...getToastArguments(language.error.attributeSave('benthic attribute')))
            }
          },
          logoutMermaid,
        })
      })

    return Promise.resolve()
  }

  const initialFormikFormValues = useMemo(() => {
    return (
      getPersistedUnsavedFormikData() ?? {
        ...getCollectRecordDataInitialValues(collectRecordBeingEdited),
        ...getSampleInfoInitialValues(collectRecordBeingEdited),
        ...getTransectInitialValues(collectRecordBeingEdited, 'quadrat_transect'),
        ...getBenthicPhotoQuadratAdditionalValues(collectRecordBeingEdited),
      }
    )
  }, [collectRecordBeingEdited, getPersistedUnsavedFormikData])

  const formik = useFormik({
    initialValues: initialFormikFormValues,
    enableReinitialize: true,
  })

  const handleSave = () => {
    const recordToSubmit = reformatFormValuesIntoBenthicPQTRecord(
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
        protocol: 'benthicpqt',
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
        handleGenericApiErrors({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.collectRecordSave))
          },
          logoutMermaid,
        })
      })
  }

  const handleValidate = () => {
    setValidateButtonState(buttonGroupStates.validating)

    databaseSwitchboardInstance
      .validateSampleUnit({ recordId, projectId })
      .then((validatedRecordResponse) => {
        setAreValidationsShowing(true)
        setCollectRecordBeingEdited(validatedRecordResponse)
        setValidateButtonState(getValidationButtonStatus(validatedRecordResponse))
      })
      .catch((error) => {
        setValidateButtonState(buttonGroupStates.validatable)
        handleGenericApiErrors({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.collectRecordValidation))
          },
          logoutMermaid,
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
        handleGenericApiErrors({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.collectRecordSubmit))
          },
          logoutMermaid,
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
          setCollectRecordBeingEdited(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleGenericApiErrors({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordSubmit))
            },
            logoutMermaid,
          })
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance, logoutMermaid],
  )

  const ignoreNonObservationFieldValidations = useCallback(
    ({ validationPath }) => {
      databaseSwitchboardInstance
        .ignoreNonObservationFieldValidations({
          record: collectRecordBeingEdited,
          validationPath,
        })
        .then((recordWithIgnoredValidations) => {
          setCollectRecordBeingEdited(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleGenericApiErrors({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationIgnore))
            },
            logoutMermaid,
          })
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance, logoutMermaid],
  )

  const ignoreObservationValidations = useCallback(
    ({ observationId }) => {
      databaseSwitchboardInstance
        .ignoreObservationValidations({
          recordId: collectRecordBeingEdited.id,
          observationId,
        })
        .then((recordWithIgnoredValidations) => {
          setCollectRecordBeingEdited(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleGenericApiErrors({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationIgnore))
            },
            logoutMermaid,
          })
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance, logoutMermaid],
  )

  const resetObservationValidations = useCallback(
    ({ observationId }) => {
      databaseSwitchboardInstance
        .resetObservationValidations({ recordId: collectRecordBeingEdited.id, observationId })
        .then((recordWithResetValidations) => {
          setCollectRecordBeingEdited(recordWithResetValidations)

          setIsFormDirty(true)
        })
        .catch((error) => {
          handleGenericApiErrors({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationReset))
            },
            logoutMermaid,
          })
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance, logoutMermaid],
  )

  const resetRecordLevelValidation = useCallback(
    ({ validationId }) => {
      databaseSwitchboardInstance
        .resetRecordLevelValidation({
          record: collectRecordBeingEdited,
          validationId,
        })
        .then((recordWithResetValidations) => {
          setCollectRecordBeingEdited(recordWithResetValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleGenericApiErrors({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationReset))
            },
            logoutMermaid,
          })
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance, logoutMermaid],
  )

  const resetNonObservationFieldValidations = useCallback(
    ({ validationPath }) => {
      databaseSwitchboardInstance
        .resetNonObservationFieldValidations({
          record: collectRecordBeingEdited,
          validationPath,
        })
        .then((recordWithResetValidations) => {
          setCollectRecordBeingEdited(recordWithResetValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleGenericApiErrors({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationReset))
            },
            logoutMermaid,
          })
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance, logoutMermaid],
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
  }, [isFormDirty])

  const observersValidationProperties = getValidationPropertiesForInput(
    collectRecordBeingEdited?.validations?.results?.data?.observers,
    areValidationsShowing,
  )

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

  const handleObserversChange = ({ selectedObservers }) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'observers',
      validationProperties: observersValidationProperties,
      validationPath: OBSERVERS_VALIDATION_PATH,
    })
    formik.setFieldValue('observers', selectedObservers)
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
          closeDeleteConfirmPrompt()
          handleGenericApiErrors({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordDelete))
            },
            logoutMermaid,
          })
        })
    }
  }

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
              id="benthicpqt-form"
              aria-labelledby="benthicpqt-form-title"
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
              <BenthicAttributeTransectInputs
                areValidationsShowing={areValidationsShowing}
                collectRecord={collectRecordBeingEdited}
                choices={choices}
                formik={formik}
                handleChangeForDirtyIgnoredInput={handleChangeForDirtyIgnoredInput}
                ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
                resetNonObservationFieldValidations={resetNonObservationFieldValidations}
                validationPropertiesWithDirtyResetOnInputChange={
                  validationPropertiesWithDirtyResetOnInputChange
                }
              />
              <ObserversInput
                data-testid="observers"
                formik={formik}
                observers={observerProfiles}
                onObserversChange={handleObserversChange}
                resetNonObservationFieldValidations={resetNonObservationFieldValidations}
                ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
                validationPath={OBSERVERS_VALIDATION_PATH}
                validationProperties={observersValidationProperties}
                validationPropertiesWithDirtyResetOnInputChange={
                  validationPropertiesWithDirtyResetOnInputChange
                }
              />
              <div ref={observationTableRef}>
                <BenthicPhotoQuadratObservationTable
                  areObservationsInputsDirty={areObservationsInputsDirty}
                  areValidationsShowing={areValidationsShowing}
                  benthicAttributeOptions={benthicAttributeOptions}
                  choices={choices}
                  collectRecord={collectRecordBeingEdited}
                  observationsReducer={observationsReducer}
                  openNewBenthicAttributeModal={openNewBenthicAttributeModal}
                  persistUnsavedObservationsUtilities={persistUnsavedObservationsUtilities}
                  ignoreObservationValidations={ignoreObservationValidations}
                  resetObservationValidations={resetObservationValidations}
                  setAreObservationsInputsDirty={setAreObservationsInputsDirty}
                />
              </div>
            </form>

            <DeleteRecordButtonCautionWrapper>
              <ButtonCaution onClick={showDeleteConfirmPrompt} disabled={isNewRecord}>
                Delete Record
              </ButtonCaution>
            </DeleteRecordButtonCautionWrapper>
            <DeleteRecordConfirm
              isOpen={showDeleteModal}
              onDismiss={closeDeleteConfirmPrompt}
              onConfirm={deleteRecord}
            />
          </>
        }
        toolbar={
          <ContentPageToolbarWrapper>
            {isNewRecord && <H2>{language.pages.benthicPhotoQuadratForm.title}</H2>}
            {collectRecordBeingEdited && !isNewRecord && (
              <RecordFormTitle
                submittedRecordOrCollectRecordDataProperty={collectRecordBeingEdited.data}
                sites={sites}
                primaryTitle={`${language.pages.collectRecord.title} - ${language.pages.benthicPhotoQuadratForm.title}`}
                sampleUnit="quadrat_transect"
              />
            )}

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
        <NewBenthicAttributeModal
          isOpen={isNewBenthicAttributeModalOpen}
          onDismiss={closeNewBenthicAttributeModal}
          onSubmit={onSubmitNewBenthicAttribute}
          currentUser={currentUser}
          projectName={projectName}
          benthicAttributeOptions={benthicAttributeOptions}
        />
      )}
      {displayLoadingModal && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={formik.dirty} />
    </>
  )
}

BenthicPhotoQuadrat.propTypes = {
  isNewRecord: PropTypes.bool,
}

BenthicPhotoQuadrat.defaultProps = {
  isNewRecord: true,
}
export default BenthicPhotoQuadrat
