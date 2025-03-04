import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react'

import {
  getFishNameConstants,
  getFishNameOptions,
} from '../../../../App/mermaidData/fishNameHelpers'
import {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
} from '../collectRecordFormInitialValues'
import { getDataForSubNavNode } from '../../../../library/getDataForSubNavNode'
import { getToastArguments } from '../../../../library/getToastArguments'
import { reformatFormValuesIntoFishBeltRecord } from '../reformatFormValuesIntoRecord'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import CollectRecordFormPage from '../CollectRecordFormPage'
import ErrorBoundary from '../../../ErrorBoundary'
import fishbeltObservationReducer from './fishbeltObservationReducer'
import FishBeltObservationTable from './FishBeltObservationTable'
import FishBeltTransectInputs from './FishBeltTransectInputs'
import language from '../../../../language'
import NewAttributeModal from '../../../NewAttributeModal'
import useIsMounted from '../../../../library/useIsMounted'

const FishBeltForm = ({ isNewRecord = true }) => {
  const { recordId, projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const observationsReducer = useReducer(fishbeltObservationReducer, [])
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [fishNameConstants, setFishNameConstants] = useState([])
  const [fishNameOptions, setFishNameOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewFishNameModalOpen, setIsNewFishNameModalOpen] = useState(false)
  const [modalAttributeOptions, setModalAttributeOptions] = useState([])
  const [observationIdToAddNewBenthicAttributeTo, setObservationIdToAddNewBenthicAttributeTo] =
    useState()
  const [observationsState, observationsDispatch] = observationsReducer
  const [sites, setSites] = useState([])
  const [subNavNode, setSubNavNode] = useState(null)
  const { currentUser } = useCurrentUser()
  const [fishSpecies, setFishSpecies] = useState([])
  const [fishGenera, setFishGenera] = useState([])
  const [fishFamilies, setFishFamilies] = useState([])
  const [fishGroupings, setFishGroupings] = useState([])

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
        databaseSwitchboardInstance.getFishGroupings(),
        databaseSwitchboardInstance.getProject(projectId),
      ]

      if (recordId && !isNewRecord) {
        promises.push(databaseSwitchboardInstance.getCollectRecord(recordId))
      }
      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            fishSpeciesResponse,
            fishGeneraResponse,
            fishFamiliesResponse,
            fishGroupingsResponse,
            projectResponse,
            // collectRecord needs to be last in array because its pushed to the promise array conditionally
            collectRecordResponse,
          ]) => {
            if (isMounted.current) {
              if (!isNewRecord && !collectRecordResponse && recordId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, recordId])
              }
              if (!projectResponse && projectId) {
                setIdsNotAssociatedWithData((previousState) =>
                  Array.from(new Set([...previousState, projectId])),
                )
              }
              const updateFishNameConstants = getFishNameConstants({
                species: fishSpeciesResponse,
                genera: fishGeneraResponse,
                families: fishFamiliesResponse,
                groupings: fishGroupingsResponse,
              })

              const updateFishNameOptions = getFishNameOptions({
                species: fishSpeciesResponse,
                genera: fishGeneraResponse,
                families: fishFamiliesResponse,
                groupings: fishGroupingsResponse,
              })

              const generaOptions = fishGeneraResponse.map((genus) => ({
                label: genus.name,
                value: genus.id,
              }))

              setSubNavNode(
                getDataForSubNavNode({
                  isNewRecord,
                  collectRecord: collectRecordResponse,
                  sites: sitesResponse,
                  protocol: collectRecordResponse?.data.protocol,
                }),
              )

              setSites(sortArrayByObjectKey(sitesResponse, 'name'))
              setCollectRecordBeingEdited(collectRecordResponse)
              setFishNameConstants(updateFishNameConstants)
              setFishNameOptions(updateFishNameOptions)
              setModalAttributeOptions(generaOptions)
              setFishSpecies(fishSpeciesResponse)
              setFishGenera(fishGeneraResponse)
              setFishFamilies(fishFamiliesResponse)
              setFishGroupings(fishGroupingsResponse)
              setIsLoading(false)
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
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isNewRecord,
    recordId,
    projectId,
    handleHttpResponseError,
    isSyncInProgress,
  ])

  const closeNewObservationModal = () => {
    setIsNewFishNameModalOpen(false)
  }
  const { getPersistedUnsavedFormData: getPersistedUnsavedFormikData } =
    useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedSampleInfoInputs`)

  const initialFormikFormValues = useMemo(() => {
    const collectRecordInitialValues = getPersistedUnsavedFormikData() ?? {
      ...getCollectRecordDataInitialValues(collectRecordBeingEdited),
      ...getSampleInfoInitialValues(collectRecordBeingEdited),
    }

    return (
      getPersistedUnsavedFormikData() ?? {
        ...collectRecordInitialValues,
        ...getTransectInitialValues(collectRecordBeingEdited, 'fishbelt_transect'),
      }
    )
  }, [collectRecordBeingEdited, getPersistedUnsavedFormikData])

  const handleCollectRecordChange = (collectRecordResponse) => {
    setCollectRecordBeingEdited(collectRecordResponse)
    setSubNavNode(
      getDataForSubNavNode({
        isNewRecord,
        collectRecord: collectRecordResponse,
        sites,
        protocol: collectRecordResponse.data.protocol,
      }),
    )
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

  const onSubmitNewFishSpecies = ({ genusId, genusName, speciesName }) => {
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
            observationId: observationIdToAddNewBenthicAttributeTo,
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
              observationId: observationIdToAddNewBenthicAttributeTo,
              newFishName: error.existingSpecies.id,
            },
          })
        } else {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.fishSpeciesSave))
            },
          })
        }
      })

    return Promise.resolve()
  }

  const PartiallyAppliedFishBeltObservationsTable = useCallback(
    (props) => {
      // the conditional here makes tests happy
      if (fishNameConstants.length && fishNameOptions.length) {
        return (
          <FishBeltObservationTable
            fishNameConstants={fishNameConstants}
            fishNameOptions={fishNameOptions}
            fishFamilies={fishFamilies}
            fishGroupings={fishGroupings}
            fishGenera={fishGenera}
            fishSpecies={fishSpecies}
            {...props}
          />
        )
      }

      return null
    },

    [fishFamilies, fishGenera, fishNameConstants, fishNameOptions, fishSpecies, fishGroupings],
  )

  const PartiallyAppliedFishBeltTransectInputs = useCallback(
    (props) => {
      return (
        <FishBeltTransectInputs
          observationsState={observationsState}
          observationsDispatch={observationsDispatch}
          {...props}
        />
      )
    },
    [observationsDispatch, observationsState],
  )

  return (
    <ErrorBoundary>
      <CollectRecordFormPage
        areObservationsInputsDirty={areObservationsInputsDirty}
        collectRecordBeingEdited={collectRecordBeingEdited}
        handleCollectRecordChange={handleCollectRecordChange}
        idsNotAssociatedWithData={idsNotAssociatedWithData}
        initialFormikFormValues={initialFormikFormValues}
        isNewRecord={isNewRecord}
        isParentDataLoading={isLoading}
        observationsTable1Reducer={observationsReducer}
        ObservationTable1={PartiallyAppliedFishBeltObservationsTable}
        sampleUnitFormatSaveFunction={reformatFormValuesIntoFishBeltRecord}
        sampleUnitName="fishbelt"
        SampleUnitTransectInputs={PartiallyAppliedFishBeltTransectInputs}
        setAreObservationsInputsDirty={setAreObservationsInputsDirty}
        setIdsNotAssociatedWithData={setIdsNotAssociatedWithData}
        setIsNewBenthicAttributeModalOpen={setIsNewFishNameModalOpen}
        setObservationIdToAddNewBenthicAttributeTo={setObservationIdToAddNewBenthicAttributeTo}
        subNavNode={subNavNode}
      />
      {!!projectId && !!currentUser && (
        <NewAttributeModal
          isFishBeltSampleUnit={true}
          isOpen={isNewFishNameModalOpen}
          onDismiss={closeNewObservationModal}
          onSubmit={onSubmitNewFishSpecies}
          modalAttributeOptions={modalAttributeOptions}
        />
      )}
    </ErrorBoundary>
  )
}

FishBeltForm.propTypes = {
  isNewRecord: PropTypes.bool,
}

export default FishBeltForm
