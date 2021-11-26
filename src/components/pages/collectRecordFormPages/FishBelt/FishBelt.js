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
import { currentUserPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import { getFishBinLabel } from './fishBeltBins'
import { getFishNameConstants } from '../../../../App/mermaidData/getFishNameConstants'
import { getFishNameOptions } from '../../../../App/mermaidData/getFishNameOptions'
import { H2 } from '../../../generic/text'
import { possibleCollectButtonGroupStates } from '../possibleCollectButtonGroupStates'
import { reformatFormValuesIntoFishBeltRecord } from './reformatFormValuesIntoFishbeltRecord'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../useUnsavedDirtyFormUtilities'
import DeleteRecordConfirm from '../DeleteRecordConfirm/DeleteRecordConfirm'
import FishbeltForm from './FishbeltForm'
import fishbeltObservationReducer from './fishbeltObservationReducer'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import language from '../../../../language'
import NewFishSpeciesModal from '../../../NewFishSpeciesModal/NewFishSpeciesModal'
import RecordFormTitle from '../../../RecordFormTitle'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import useIsMounted from '../../../../library/useIsMounted'
import getObservationValidationsCloneWithIds from './getObservationsValidationsCloneWithIds'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'

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

const FishBelt = ({ isNewRecord, currentUser }) => {
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [areValidationsShowing, setAreValidationsShowing] = useState(false)
  const [choices, setChoices] = useState({})
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [saveButtonState, setSaveButtonState] = useState(possibleCollectButtonGroupStates.saved)
  const [validateButtonState, setValidateButtonState] = useState(
    possibleCollectButtonGroupStates.validatable,
  )
  const [fishNameConstants, setFishNameConstants] = useState([])
  const [fishNameOptions, setFishNameOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewFishNameModalOpen, setIsNewFishNameModalOpen] = useState(false)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [observationToAddSpeciesTo, setObservationToAddSpeciesTo] = useState()
  const [observationValidationsCloneWithUuids, setObservationValidationsCloneWithUuids] = useState(
    [],
  )
  const [observerProfiles, setObserverProfiles] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sites, setSites] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const history = useHistory()
  const isMounted = useIsMounted()

  const observationsReducer = useReducer(fishbeltObservationReducer, [])
  const [observationsState, observationsDispatch] = observationsReducer

  const openNewFishNameModal = (observationId) => {
    setObservationToAddSpeciesTo(observationId)
    setIsNewFishNameModalOpen(true)
  }
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

              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              setObserverProfiles(projectProfilesResponse)
              setCollectRecordBeingEdited(collectRecordResponse)
              setFishNameConstants(updateFishNameConstants)
              setFishNameOptions(updateFishNameOptions)
              setIsLoading(false)
            }
          },
        )
        .catch(() => {
          const error = isNewRecord
            ? language.error.collectRecordChoicesUnavailable
            : language.error.collectRecordUnavailable

          toast.error(error)
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isNewRecord, recordId, projectId, isSyncInProgress])

  const {
    persistUnsavedFormData: persistUnsavedFormikData,
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities('unsavedFishbeltFormik')

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
          toast.success(language.success.collectRecordDelete)
          history.push(`${ensureTrailingSlash(currentProjectPath)}collecting`)
        })
        .catch(() => {
          toast.error(language.error.collectRecordDelete)
          closeDeleteConfirmPrompt()
        })
    }
  }

  const handleValidate = () => {
    setValidateButtonState(possibleCollectButtonGroupStates.validating)

    databaseSwitchboardInstance
      .validateFishBelt({ recordId, projectId })
      .then((validatedRecordResponse) => {
        setAreValidationsShowing(true)
        setCollectRecordBeingEdited(validatedRecordResponse)
        setValidateButtonState(
          validatedRecordResponse?.validations?.status === 'ok'
            ? possibleCollectButtonGroupStates.validated
            : possibleCollectButtonGroupStates.validatable,
        )

        /* Observations is loaded initially before a user can hit the validate button,
         and its kept up to date through user actions.
         So it _should_ be reliable to use here without race conditions
         This observationsValidationsCloneWithIds thing is because we dont have api ids
         to link the observations to its validations, so its a bit of a hack
         to get the ids created for the ui for observations onto the
         validations object for observations.
         In the future the api might supply unique ids for
         observations and observations validations,
         and this extraneous code can be removed then.
         This tech debt is tracked in ticket M453
        */
        setObservationValidationsCloneWithUuids(
          getObservationValidationsCloneWithIds({
            observationsFromApiWithIds: observationsState,
            collectRecord: validatedRecordResponse,
          }),
        )
      })
      .catch(() => {
        toast.error(language.error.collectRecordFailedValidation)
        setValidateButtonState(possibleCollectButtonGroupStates.validatable)
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
          toast.warn(language.error.collectRecordIgnore)
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
          toast.warn(language.error.collectRecordIgnore)
        })
    },
    [collectRecordBeingEdited, databaseSwitchboardInstance],
  )

  const ignoreObservationValidations = useCallback(
    ({ observationUiId }) => {
      databaseSwitchboardInstance
        .ignoreObservationValidations({
          record: collectRecordBeingEdited,
          observationUiId,
          observationValidationsCloneWithUuids,
        })
        .then((recordWithIgnoredValidations) => {
          setCollectRecordBeingEdited(recordWithIgnoredValidations)
          /* This observationsValidationsCloneWithIds thing is because we dont have api ids
          to link the observations to its validations, so its a bit of a hack
          to get the ids created for the ui for observations onto the
          validations object for observations.
          In the future the api might supply unique ids for
          observations and observations validations,
          and this extraneous code can be removed then.
          This tech debt is tracked in ticket M453
          */
          setObservationValidationsCloneWithUuids(
            getObservationValidationsCloneWithIds({
              observationsFromApiWithIds: observationsState,
              collectRecord: recordWithIgnoredValidations,
            }),
          )
          setIsFormDirty(true)
        })
        .catch(() => {
          toast.warn(language.error.collectRecordIgnore)
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      observationValidationsCloneWithUuids,
      observationsState,
    ],
  )

  const resetObservationValidations = useCallback(
    ({ observationUiId }) => {
      databaseSwitchboardInstance
        .resetObservationValidations({
          record: collectRecordBeingEdited,
          observationUiId,
          observationValidationsCloneWithUuids,
        })
        .then((recordWithResetValidations) => {
          setCollectRecordBeingEdited(recordWithResetValidations)
          /* This observationsValidationsCloneWithIds thing is because we dont have api ids
          to link the observations to its validations, so its a bit of a hack
          to get the ids created for the ui for observations onto the
          validations object for observations.
          In the future the api might supply unique ids for
          observations and observations validations,
          and this extraneous code can be removed then.
          This tech debt is tracked in ticket M453
          */
          setObservationValidationsCloneWithUuids(
            getObservationValidationsCloneWithIds({
              observationsFromApiWithIds: observationsState,
              collectRecord: recordWithResetValidations,
            }),
          )
          setIsFormDirty(true)
        })
        .catch(() => {
          toast.warn(language.error.collectRecordReset)
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      observationValidationsCloneWithUuids,
      observationsState,
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
          setCollectRecordBeingEdited(recordWithResetValidations)
          setIsFormDirty(true)
        })
        .catch(() => {
          toast.warn(language.error.collectRecordReset)
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
          toast.warn(language.error.collectRecordReset)
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
        toast.success(language.success.fishSpeciesSave)
      })
      .catch((error) => {
        if (error.message === 'Species already exists') {
          toast.warning(language.error.fishSpeciesAlreadyExists)

          observationsDispatch({
            type: 'updateFishName',
            payload: {
              observationId: observationToAddSpeciesTo,
              newFishName: error.existingSpecies.id,
            },
          })
        } else {
          toast.error(language.error.fishSpeciesSave)
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

    setSaveButtonState(possibleCollectButtonGroupStates.saving)
    setAreValidationsShowing(false)

    databaseSwitchboardInstance
      .saveFishBelt({
        record: recordToSubmit,
        profileId: currentUser.id,
        projectId,
      })
      .then((response) => {
        toast.success(language.success.collectRecordSave)
        clearPersistedUnsavedFormikData()
        clearPersistedUnsavedObservationsData()
        setAreObservationsInputsDirty(false)
        setSaveButtonState(possibleCollectButtonGroupStates.saved)
        setValidateButtonState(possibleCollectButtonGroupStates.validatable)
        setIsFormDirty(false)
        formik.resetForm({ values: formik.values }) // this resets formik's dirty state

        if (isNewRecord) {
          history.push(`${ensureTrailingSlash(history.location.pathname)}${response.id}`)
        }
      })
      .catch(() => {
        toast.error(language.error.collectRecordSave)
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
      setSaveButtonState(possibleCollectButtonGroupStates.unsaved)
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

  const handleObserversChange = ({ selectedObservers }) => {
    formik.setFieldValue('observers', selectedObservers)
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
        content={
          <>
            <FishbeltForm
              areObservationsInputsDirty={areObservationsInputsDirty}
              areValidationsShowing={areValidationsShowing}
              choices={choices}
              collectRecord={collectRecordBeingEdited}
              fishNameConstants={fishNameConstants}
              fishNameOptions={fishNameOptions}
              formik={formik}
              ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
              ignoreObservationValidations={ignoreObservationValidations}
              ignoreRecordLevelValidation={ignoreRecordLevelValidation}
              managementRegimes={managementRegimes}
              observationsReducer={observationsReducer}
              observationValidationsCloneWithUuids={observationValidationsCloneWithUuids}
              observers={observerProfiles}
              onObserversChange={handleObserversChange}
              onSizeBinChange={handleSizeBinChange}
              openNewFishNameModal={openNewFishNameModal}
              persistUnsavedObservationsUtilities={persistUnsavedObservationsUtilities}
              resetObservationValidations={resetObservationValidations}
              resetRecordLevelValidation={resetRecordLevelValidation}
              resetNonObservationFieldValidations={resetNonObservationFieldValidations}
              setAreObservationsInputsDirty={setAreObservationsInputsDirty}
              sites={sites}
            />

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
            {isNewRecord && <H2>Fish Belt</H2>}
            {collectRecordBeingEdited && !isNewRecord && (
              <RecordFormTitle
                submittedRecordOrCollectRecordDataProperty={collectRecordBeingEdited.data}
                sites={sites}
              />
            )}

            <SaveValidateSubmitButtonGroup
              isNewRecord={isNewRecord}
              saveButtonState={saveButtonState}
              validateButtonState={validateButtonState}
              onValidate={handleValidate}
              onSave={handleSave}
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
    </>
  )
}

FishBelt.propTypes = {
  currentUser: currentUserPropType.isRequired,
  isNewRecord: PropTypes.bool,
}

FishBelt.defaultProps = {
  isNewRecord: true,
}

export default FishBelt
