import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import styled, { css } from 'styled-components/macro'
import { mediaQueryTabletLandscapeOnly } from '../../../../library/styling/mediaQueries'
import theme from '../../../../theme'
import {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
} from '../collectRecordFormInitialValues'
import { ButtonCaution } from '../../../generic/buttons'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import { getFishBinLabel } from './fishBeltBins'
import { getFishNameConstants } from '../../../../App/mermaidData/getFishNameConstants'
import { getFishNameOptions } from '../../../../App/mermaidData/getFishNameOptions'
import { H2 } from '../../../generic/text'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { reformatFormValuesIntoFishBeltRecord } from './reformatFormValuesIntoFishbeltRecord'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../useUnsavedDirtyFormUtilities'
import DeleteRecordConfirm from '../DeleteRecordConfirm/DeleteRecordConfirm'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import SampleInfoInputs from './SampleInfoInputs'
import fishbeltObservationReducer from './fishbeltObservationReducer'
import FishBeltObservationTable from './FishBeltObservationTable'
import FishbeltTransectInputs from './FishbeltTransectInputs'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import language from '../../../../language'
import { getToastArguments } from '../../../../library/getToastArguments'
import NewFishSpeciesModal from '../../../NewFishSpeciesModal/NewFishSpeciesModal'
import LoadingModal from '../../../LoadingModal/LoadingModal'
import ObserversInput from '../../../ObserversInput'
import RecordFormTitle from '../../../RecordFormTitle'
import RecordLevelInputValidationInfo from '../RecordLevelValidationInfo/RecordLevelValidationInfo'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import useIsMounted from '../../../../library/useIsMounted'
import { getRecordName } from '../../../../library/getRecordName'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'

/*
  Fishbelt component lets a user edit and delete a record as well as create a new record.
*/
const DeleteRecordButtonCautionWrapper = styled('div')`
  padding: 0 ${theme.spacing.medium};
  text-align: right;
  ${mediaQueryTabletLandscapeOnly(css`
    text-align: left;
  `)}
`

const FishBelt = ({ isNewRecord }) => {
  const OBSERVERS_VALIDATION_PATH = 'data.observers'

  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [areValidationsShowing, setAreValidationsShowing] = useState(false)
  const [choices, setChoices] = useState({})
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [fishNameConstants, setFishNameConstants] = useState([])
  const [fishNameOptions, setFishNameOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewFishNameModalOpen, setIsNewFishNameModalOpen] = useState(false)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [observationToAddSpeciesTo, setObservationToAddSpeciesTo] = useState()
  const [subNavNode, setSubNavNode] = useState(null)

  const [observerProfiles, setObserverProfiles] = useState([])
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sites, setSites] = useState([])
  const [submitButtonState, setSubmitButtonState] = useState(buttonGroupStates.submittable)
  const [validateButtonState, setValidateButtonState] = useState(buttonGroupStates.validatable)

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const currentUser = useCurrentUser()
  const history = useHistory()
  const isMounted = useIsMounted()

  const observationsReducer = useReducer(fishbeltObservationReducer, [])
  const [observationsState, observationsDispatch] = observationsReducer

  const recordLevelValidations = collectRecordBeingEdited?.validations?.results?.$record ?? []

  const displayLoadingModal =
    saveButtonState === buttonGroupStates.saving ||
    validateButtonState === buttonGroupStates.validating ||
    submitButtonState === buttonGroupStates.submitting

  const openNewFishNameModal = useCallback((observationId) => {
    setObservationToAddSpeciesTo(observationId)
    setIsNewFishNameModalOpen(true)
  }, [])
  const closeNewFishNameModal = () => {
    setIsNewFishNameModalOpen(false)
  }
  const showDeleteConfirmPrompt = () => {
    setShowDeleteModal(true)
  }
  const closeDeleteConfirmPrompt = () => {
    setShowDeleteModal(false)
  }

  const updateFishNameOptionsStateWithOfflineStorageData = useCallback(() => {
    if (databaseSwitchboardInstance) {
      Promise.all([
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
      ]).then(([species, genera, families]) => {
        const updateFishNameOptions = getFishNameOptions({
          species,
          genera,
          families,
        })

        setFishNameOptions(updateFishNameOptions)
      })
    }
  }, [databaseSwitchboardInstance])

  const getValidationButtonStatus = (collectRecord) => {
    return collectRecord?.validations?.status === 'ok'
      ? buttonGroupStates.validated
      : buttonGroupStates.validatable
  }

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
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
            species,
            genera,
            families,
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
              const updateFishNameConstants = getFishNameConstants({
                species,
                genera,
                families,
              })

              const updateFishNameOptions = getFishNameOptions({
                species,
                genera,
                families,
              })

              const recordNameForSubNode =
                !isNewRecord && collectRecordResponse
                  ? getRecordName(collectRecordResponse.data, sitesResponse, 'fishbelt_transect')
                  : { name: 'Fish Belt' }

              setSites(sortArrayByObjectKey(sitesResponse, "name"))
              setManagementRegimes(sortArrayByObjectKey(managementRegimesResponse, "name"))
              setChoices(choicesResponse)
              setObserverProfiles(sortArrayByObjectKey(projectProfilesResponse, "profile_name"))
              setCollectRecordBeingEdited(collectRecordResponse)
              setFishNameConstants(updateFishNameConstants)
              setFishNameOptions(updateFishNameOptions)
              setSubNavNode(recordNameForSubNode)
              setIsLoading(false)
              setValidateButtonState(getValidationButtonStatus(collectRecordResponse))
            }
          },
        )
        .catch(() => {
          const error = isNewRecord
            ? language.error.collectRecordChoicesUnavailable
            : language.error.collectRecordUnavailable

          toast.error(...getToastArguments(error))
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isNewRecord, recordId, projectId, isSyncInProgress])

  const {
    persistUnsavedFormData: persistUnsavedFormikData,
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities('unsavedSampleInfoInputsik')

  const persistUnsavedObservationsUtilities = useUnsavedDirtyFormDataUtilities(
    'unsavedFishbeltObservations',
  )

  const {
    clearPersistedUnsavedFormData: clearPersistedUnsavedObservationsData,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsData,
  } = persistUnsavedObservationsUtilities

  const deleteRecord = () => {
    if (!isNewRecord) {
      databaseSwitchboardInstance
        .deleteFishBelt({
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
        .catch(() => {
          toast.error(...getToastArguments(language.error.collectRecordDelete))
          closeDeleteConfirmPrompt()
        })
    }
  }
  const handleSubmit = () => {
    setSubmitButtonState(buttonGroupStates.submitting)

    databaseSwitchboardInstance
      .submitFishBelt({ recordId, projectId })
      .then(() => {
        toast.success(...getToastArguments(language.success.collectRecordSubmit))
        history.push(`${ensureTrailingSlash(currentProjectPath)}collecting/`)
      })
      .catch(() => {
        toast.error(...getToastArguments(language.error.collectRecordSubmit))
        setSubmitButtonState(buttonGroupStates.submittable)
      })
  }
  const handleValidate = () => {
    setValidateButtonState(buttonGroupStates.validating)

    databaseSwitchboardInstance
      .validateFishBelt({ recordId, projectId })
      .then((validatedRecordResponse) => {
        setAreValidationsShowing(true)
        setCollectRecordBeingEdited(validatedRecordResponse)
        setValidateButtonState(getValidationButtonStatus(validatedRecordResponse))
      })
      .catch(() => {
        toast.error(...getToastArguments(language.error.collectRecordValidation))
        setValidateButtonState(buttonGroupStates.validatable)
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
        .catch(() => {
          toast.warn(...getToastArguments(language.error.collectRecordValidationIgnore))
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance],
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
        .catch(() => {
          toast.warn(...getToastArguments(language.error.collectRecordValidationIgnore))
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance],
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
        .catch(() => {
          toast.warn(...getToastArguments(language.error.collectRecordValidationIgnore))
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance],
  )

  const resetObservationValidations = useCallback(
    ({ observationId }) => {
      databaseSwitchboardInstance
        .resetObservationValidations({ recordId: collectRecordBeingEdited.id, observationId })
        .then((recordWithResetValidations) => {
          setCollectRecordBeingEdited(recordWithResetValidations)

          setIsFormDirty(true)
        })
        .catch(() => {
          toast.warn(...getToastArguments(language.error.collectRecordValidationReset))
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance],
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
        .catch(() => {
          toast.warn(...getToastArguments(language.error.collectRecordValidationReset))
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance],
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
        .catch(() => {
          toast.warn(...getToastArguments(language.error.collectRecordValidationReset))
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance],
  )

  const handleNewFishSpeciesOnSubmit = ({ genusId, genusName, speciesName }) => {
    databaseSwitchboardInstance
      .addFishSpecies({
        genusId,
        genusName,
        speciesName,
      })
      .then((newFishSpecies) => {
        observationsDispatch({
          type: 'updateFishName',
          payload: {
            observationId: observationToAddSpeciesTo,
            newFishName: newFishSpecies.id,
          },
        })
        updateFishNameOptionsStateWithOfflineStorageData()
        toast.success(...getToastArguments(language.success.fishSpeciesSave))
      })
      .catch((error) => {
        if (error.message === 'Species already exists') {
          toast.warning(...getToastArguments(language.error.fishSpeciesAlreadyExists))

          observationsDispatch({
            type: 'updateFishName',
            payload: {
              observationId: observationToAddSpeciesTo,
              newFishName: error.existingSpecies.id,
            },
          })
        } else {
          toast.error(...getToastArguments(language.error.fishSpeciesSave))
        }
      })

    return Promise.resolve()
  }
  // note: observations doesn't use formik, maybe it could have.
  // Better yet, future iterations should avoid formik which isnt
  // growing well with the complexity of the app
  const initialFormikFormValues = useMemo(() => {
    return (
      getPersistedUnsavedFormikData() ?? {
        ...getCollectRecordDataInitialValues(collectRecordBeingEdited),
        ...getSampleInfoInitialValues(collectRecordBeingEdited, 'fishbelt_transect'),
        ...getTransectInitialValues(collectRecordBeingEdited, 'fishbelt_transect'),
      }
    )
  }, [collectRecordBeingEdited, getPersistedUnsavedFormikData])

  const formik = useFormik({
    initialValues: initialFormikFormValues,
    enableReinitialize: true,
    validate: persistUnsavedFormikData,
  })

  const handleSave = () => {
    const recordToSubmit = reformatFormValuesIntoFishBeltRecord(
      formik.values,
      observationsState,
      collectRecordBeingEdited,
    )

    setSaveButtonState(buttonGroupStates.saving)
    setAreValidationsShowing(false)

    databaseSwitchboardInstance
      .saveFishBelt({
        record: recordToSubmit,
        profileId: currentUser.id,
        projectId,
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
      .catch(() => {
        setSaveButtonState(buttonGroupStates.unsaved)
        toast.error(...getToastArguments(language.error.collectRecordSave))
      })
  }

  const _setIsFormDirty = useEffect(() => {
    setIsFormDirty(
      !!formik.dirty ||
        areObservationsInputsDirty ||
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

  const handleSizeBinChange = (event) => {
    const sizeBinId = event.target.value

    formik.setFieldValue('size_bin', sizeBinId)

    const fishBinSelectedLabel = getFishBinLabel(choices, sizeBinId)

    const isSizeBinATypeThatRequiresSizeResetting = fishBinSelectedLabel !== '1'

    if (isSizeBinATypeThatRequiresSizeResetting) {
      observationsDispatch({ type: 'resetFishSizes' })
    }
  }

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
            />
            <form
              id="fishbelt-form"
              aria-labelledby="fishbelt-form-title"
              onSubmit={formik.handleSubmit}
            >
              <SampleInfoInputs
                areValidationsShowing={areValidationsShowing}
                collectRecord={collectRecordBeingEdited}
                formik={formik}
                handleChangeForDirtyIgnoredInput={handleChangeForDirtyIgnoredInput}
                ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
                managementRegimes={managementRegimes}
                resetNonObservationFieldValidations={resetNonObservationFieldValidations}
                sites={sites}
                validationPropertiesWithDirtyResetOnInputChange={
                  validationPropertiesWithDirtyResetOnInputChange
                }
              />

              <FishbeltTransectInputs
                areValidationsShowing={areValidationsShowing}
                choices={choices}
                collectRecord={collectRecordBeingEdited}
                formik={formik}
                handleChangeForDirtyIgnoredInput={handleChangeForDirtyIgnoredInput}
                ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
                onSizeBinChange={handleSizeBinChange}
                resetNonObservationFieldValidations={resetNonObservationFieldValidations}
                validationPropertiesWithDirtyResetOnInputChange={
                  validationPropertiesWithDirtyResetOnInputChange
                }
              />
              <ObserversInput
                data-testid="observers"
                formik={formik}
                ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
                observers={observerProfiles}
                onObserversChange={handleObserversChange}
                resetNonObservationFieldValidations={resetNonObservationFieldValidations}
                validationPath={OBSERVERS_VALIDATION_PATH}
                validationProperties={observersValidationProperties}
                validationPropertiesWithDirtyResetOnInputChange={
                  validationPropertiesWithDirtyResetOnInputChange
                }
              />
              <FishBeltObservationTable
                areObservationsInputsDirty={areObservationsInputsDirty}
                areValidationsShowing={areValidationsShowing}
                choices={choices}
                collectRecord={collectRecordBeingEdited}
                fishBinSelected={formik.values.size_bin}
                fishNameConstants={fishNameConstants}
                fishNameOptions={fishNameOptions}
                ignoreObservationValidations={ignoreObservationValidations}
                observationsReducer={observationsReducer}
                openNewFishNameModal={openNewFishNameModal}
                persistUnsavedObservationsUtilities={persistUnsavedObservationsUtilities}
                resetObservationValidations={resetObservationValidations}
                setAreObservationsInputsDirty={setAreObservationsInputsDirty}
                transectLengthSurveyed={formik.values.len_surveyed}
                widthId={formik.values.width}
              />
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
            {isNewRecord && <H2>{language.pages.fishBeltForm.title}</H2>}
            {collectRecordBeingEdited && !isNewRecord && (
              <RecordFormTitle
                submittedRecordOrCollectRecordDataProperty={collectRecordBeingEdited.data}
                sites={sites}
                primaryTitle={`${language.pages.collectRecord.title} - ${language.pages.fishBeltForm.title}`}
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
        <NewFishSpeciesModal
          isOpen={isNewFishNameModalOpen}
          onDismiss={closeNewFishNameModal}
          onSubmit={handleNewFishSpeciesOnSubmit}
          currentUser={currentUser}
          projectId={projectId}
        />
      )}
      {displayLoadingModal && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={formik.dirty} />
    </>
  )
}

FishBelt.propTypes = {
  isNewRecord: PropTypes.bool,
}

FishBelt.defaultProps = {
  isNewRecord: true,
}

export default FishBelt
