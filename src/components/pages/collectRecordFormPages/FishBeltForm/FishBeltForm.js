import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

import fishbeltObservationReducer from './fishbeltObservationReducer'
import { getFishNameConstants } from '../../../../App/mermaidData/getFishNameConstants'
import { getFishNameOptions } from '../../../../App/mermaidData/getFishNameOptions'
import { getRecordName } from '../../../../library/getRecordName'
import { getToastArguments } from '../../../../library/getToastArguments'
import language from '../../../../language'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../../library/useIsMounted'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import CollectRecordFormPage from '../CollectRecordFormPage'

const FishBeltForm = ({ isNewRecord }) => {
  const { recordId, projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const observationsReducer = useReducer(fishbeltObservationReducer, [])
  const [observationsState, observationsDispatch] = observationsReducer // eslint-disable-line no-unused-vars

  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [fishNameOptions, setFishNameOptions] = useState([])
  const [fishNameConstants, setFishNameConstants] = useState([])
  const [observerProfiles, setObserverProfiles] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [subNavNode, setSubNavNode] = useState(null)
  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const [choices, setChoices] = useState({})
  const [newObservationToAdd, setNewObservationToAdd] = useState()
  const [modalAttributeOptions, setModalAttributeOptions] = useState([])

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

              const generaOptions = genera.map((genus) => ({ label: genus.name, value: genus.id }))

              const recordNameForSubNode =
                !isNewRecord && collectRecordResponse
                  ? getRecordName(collectRecordResponse.data, sitesResponse, 'fishbelt_transect')
                  : { name: 'Fish Belt' }

              setSites(sortArrayByObjectKey(sitesResponse, 'name'))
              setManagementRegimes(sortArrayByObjectKey(managementRegimesResponse, 'name'))
              setChoices(choicesResponse)
              setObserverProfiles(sortArrayByObjectKey(projectProfilesResponse, 'profile_name'))
              setCollectRecordBeingEdited(collectRecordResponse)
              setFishNameConstants(updateFishNameConstants)
              setFishNameOptions(updateFishNameOptions)
              setModalAttributeOptions(generaOptions)
              setSubNavNode(recordNameForSubNode)
              setIsLoading(false)
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
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isNewRecord,
    recordId,
    projectId,
    handleHttpResponseError,
    isSyncInProgress,
  ])

  const handleCollectRecordChange = (updatedCollectRecord) =>
    setCollectRecordBeingEdited(updatedCollectRecord)

  const handleNewObservationAdd = (observationAttributeId) =>
    setNewObservationToAdd(observationAttributeId)

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
            observationId: newObservationToAdd,
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
              observationId: newObservationToAdd,
              newFishName: error.existingSpecies.id,
            },
          })
        } else {
          toast.error(...getToastArguments(language.error.fishSpeciesSave))
        }
      })

    return Promise.resolve()
  }

  return (
    <CollectRecordFormPage
      isNewRecord={isNewRecord}
      sampleUnitName="fishbelt"
      collectRecordBeingEdited={collectRecordBeingEdited}
      handleCollectRecordChange={handleCollectRecordChange}
      handleNewObservationAdd={handleNewObservationAdd}
      handleSubmitNewObservation={onSubmitNewFishSpecies}
      observationsReducer={observationsReducer}
      sites={sites}
      managementRegimes={managementRegimes}
      choices={choices}
      idsNotAssociatedWithData={idsNotAssociatedWithData}
      isLoading={isLoading}
      subNavNode={subNavNode}
      observerProfiles={observerProfiles}
      observationOptions={fishNameOptions}
      modalAttributeOptions={modalAttributeOptions}
      fishNameConstants={fishNameConstants}
    />
  )
}

FishBeltForm.propTypes = {
  isNewRecord: PropTypes.bool,
}

FishBeltForm.defaultProps = {
  isNewRecord: true,
}

export default FishBeltForm
