import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

import styled, { css } from 'styled-components/macro'
import {
  mediaQueryForDesktopUp,
  mediaQueryTabletLandscapeOnly,
} from '../../../../library/styling/mediaQueries'
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
import { reformatFormValuesIntoFishBeltRecord } from './reformatFormValuesIntoFishbeltRecord'
import { possibleCollectButtonGroupStates } from '../possibleCollectButtonGroupStates'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../useUnsavedDirtyFormUtilities'
import DeleteRecordConfirm from '../DeleteRecordConfirm/DeleteRecordConfirm'
import fishbeltObservationReducer from './fishbeltObservationReducer'
import FishBeltObservationTable from './FishBeltObservationTable'
import FishBeltTransectInputs from './FishBeltTransectInputs'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import language from '../../../../language'
import NewFishSpeciesModal from '../../../NewFishSpeciesModal/NewFishSpeciesModal'
import ObserversInput from '../../../ObserversInput'
import SampleInfoInputs from '../../../SampleInfoInputs'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import useIsMounted from '../../../../library/useIsMounted'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import RecordFormTitle from '../../../RecordFormTitle'

/*
  Fishbelt component lets a user edit and delete a record as well as create a new record.
*/
const CollectRecordToolbarWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: start;
  ${mediaQueryForDesktopUp(css`
    flex-direction: row;
    align-items: center;
  `)}
  ${mediaQueryTabletLandscapeOnly(css`
    &,
    button {
      svg {
        width: ${theme.typography.smallIconSize};
        height: ${theme.typography.smallIconSize};
      }
      font-size: ${theme.typography.smallFontSize};
      padding: ${theme.spacing.small};
    }
  `)}
`

const FishBelt = ({ isNewRecord, currentUser }) => {
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(
    false,
  )
  const [choices, setChoices] = useState({})
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [fishBeltButtonsState, setFishBeltButtonsState] = useState(
    possibleCollectButtonGroupStates.saved,
  )
  const [fishNameConstants, setFishNameConstants] = useState([])
  const [fishNameOptions, setFishNameOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewFishNameModalOpen, setIsNewFishNameModalOpen] = useState(false)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [observationToAddSpeciesTo, setObservationToAddSpeciesTo] = useState()
  const [observerProfiles, setObserverProfiles] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sites, setSites] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const history = useHistory()
  const isMounted = useIsMounted()
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [areValidationsShowing, setAreValidationsShowing] = useState(false)
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
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(
          projectId,
        ),
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
                setIdsNotAssociatedWithData((previousState) => [
                  ...previousState,
                  recordId,
                ])
              }
              if (!isNewRecord && !projectResponse && projectId) {
                setIdsNotAssociatedWithData((previousState) => [
                  ...previousState,
                  projectId,
                ])
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
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isNewRecord,
    recordId,
    projectId,
    isSyncInProgress,
  ])

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

  const validateRecord = () => {
    setFishBeltButtonsState(possibleCollectButtonGroupStates.validating)

    databaseSwitchboardInstance
      .validateFishBelt({ recordId, projectId })
      .then((validatedRecordResponse) => {
        if (validatedRecordResponse?.validations?.status === 'ok') {
          setFishBeltButtonsState(possibleCollectButtonGroupStates.validated)
        }
        setFishBeltButtonsState(possibleCollectButtonGroupStates.saved)
        setAreValidationsShowing(true)
        setCollectRecordBeingEdited(validatedRecordResponse)
      })
      .catch(() => {
        toast.error(language.error.collectRecordFailedValidation)
        setFishBeltButtonsState(possibleCollectButtonGroupStates.saved)
      })
  }

  const handleNewFishSpeciesOnSubmit = ({
    genusId,
    genusName,
    speciesName,
  }) => {
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
        ...getSampleInfoInitialValues(
          collectRecordBeingEdited,
          'fishbelt_transect',
        ),
        ...getTransectInitialValues(
          collectRecordBeingEdited,
          'fishbelt_transect',
        ),
      }
    )
  }, [collectRecordBeingEdited, getPersistedUnsavedFormikData])

  const formikOptions = useMemo(() => {
    const saveRecord = (formikValues, formikActions) => {
      const recordToSubmit = reformatFormValuesIntoFishBeltRecord(
        formikValues,
        observationsState,
        collectRecordBeingEdited,
      )

      setFishBeltButtonsState(possibleCollectButtonGroupStates.saving)
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
          setFishBeltButtonsState(possibleCollectButtonGroupStates.saved)
          formikActions.resetForm({ values: formikValues }) // this resets formik's dirty state

          if (isNewRecord) {
            history.push(
              `${ensureTrailingSlash(history.location.pathname)}${response.id}`,
            )
          }
        })
        .catch(() => {
          toast.error(language.error.collectRecordSave)
        })
    }

    return {
      initialValues: initialFormikFormValues,
      enableReinitialize: true,
      onSubmit: saveRecord,
      validate: persistUnsavedFormikData,
    }
  }, [
    clearPersistedUnsavedFormikData,
    clearPersistedUnsavedObservationsData,
    collectRecordBeingEdited,
    currentUser.id,
    databaseSwitchboardInstance,
    history,
    initialFormikFormValues,
    isNewRecord,
    observationsState,
    persistUnsavedFormikData,
    projectId,
    setAreObservationsInputsDirty,
    setFishBeltButtonsState,
  ])

  const formik = useFormik(formikOptions)

  const _setIsFormDirty = useEffect(() => {
    setIsFormDirty(
      formik.dirty ||
        areObservationsInputsDirty ||
        getPersistedUnsavedFormikData() ||
        getPersistedUnsavedObservationsData(),
    )
  }, [
    areObservationsInputsDirty,
    formik.dirty,
    getPersistedUnsavedFormikData,
    getPersistedUnsavedObservationsData,
  ])

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

  const _setCollectButtonsUnsaved = useEffect(() => {
    if (isFormDirty) {
      setFishBeltButtonsState(possibleCollectButtonGroupStates.unsaved)
    }
  }, [isFormDirty])

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <>
      <ContentPageLayout
        isPageContentLoading={isLoading}
        content={
          <>
            <form
              id="fishbelt-form"
              aria-labelledby="fishbelt-form-title"
              onSubmit={formik.handleSubmit}
            >
              <SampleInfoInputs
                collectRecord={collectRecordBeingEdited}
                formik={formik}
                managementRegimes={managementRegimes}
                areValidationsShowing={areValidationsShowing}
                sites={sites}
              />
              <FishBeltTransectInputs
                areValidationsShowing={areValidationsShowing}
                choices={choices}
                collectRecord={collectRecordBeingEdited}
                formik={formik}
                onSizeBinChange={handleSizeBinChange}
              />
              <ObserversInput
                areValidationsShowing={areValidationsShowing}
                collectRecord={collectRecordBeingEdited}
                data-testid="observers"
                formik={formik}
                observers={observerProfiles}
                onObserversChange={handleObserversChange}
              />
              <FishBeltObservationTable
                choices={choices}
                collectRecord={collectRecordBeingEdited}
                fishBinSelected={formik.values.size_bin}
                fishNameConstants={fishNameConstants}
                fishNameOptions={fishNameOptions}
                observationsReducer={observationsReducer}
                openNewFishNameModal={openNewFishNameModal}
                transectLengthSurveyed={formik.values.len_surveyed}
                widthId={formik.values.width}
                persistUnsavedObservationsUtilities={
                  persistUnsavedObservationsUtilities
                }
                areObservationsInputsDirty={areObservationsInputsDirty}
                setAreObservationsInputsDirty={setAreObservationsInputsDirty}
              />
            </form>
            <ButtonCaution
              onClick={showDeleteConfirmPrompt}
              disabled={isNewRecord}
            >
              Delete Record
            </ButtonCaution>
            <DeleteRecordConfirm
              isOpen={showDeleteModal}
              onDismiss={closeDeleteConfirmPrompt}
              onConfirm={deleteRecord}
            />
          </>
        }
        toolbar={
          <CollectRecordToolbarWrapper>
            {isNewRecord && <H2>Fish Belt</H2>}
            {collectRecordBeingEdited && !isNewRecord && (
              <RecordFormTitle
                submittedRecordOrCollectRecordDataProperty={
                  collectRecordBeingEdited.data
                }
                sites={sites}
              />
            )}

            <SaveValidateSubmitButtonGroup
              isNewRecord={isNewRecord}
              fishBeltButtonsState={fishBeltButtonsState}
              validateRecord={validateRecord}
            />
          </CollectRecordToolbarWrapper>
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
