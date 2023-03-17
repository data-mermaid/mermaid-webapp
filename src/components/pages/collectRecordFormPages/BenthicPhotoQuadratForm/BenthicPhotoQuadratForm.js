import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

import benthicpqtObservationReducer from './benthicpqtObservationReducer'
import { getBenthicOptions } from '../../../../library/getOptions'
import { getDataForSubNavNode } from '../../../../library/getDataForSubNavNode'
import { getToastArguments } from '../../../../library/getToastArguments'
import language from '../../../../language'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../../library/useIsMounted'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import CollectRecordFormPage from '../CollectRecordFormPage'
import ErrorBoundary from '../../../ErrorBoundary'

const BenthicPhotoQuadratForm = ({ isNewRecord }) => {
  const { recordId, projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const observationsReducer = useReducer(benthicpqtObservationReducer, [])
  const [observationsState, observationsDispatch] = observationsReducer // eslint-disable-line no-unused-vars

  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [benthicAttributeOptions, setBenthicAttributeOptions] = useState([])
  const [observerProfiles, setObserverProfiles] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [subNavNode, setSubNavNode] = useState(null)
  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const [choices, setChoices] = useState({})
  const [newObservationToAdd, setNewObservationToAdd] = useState()

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
              if (!projectResponse && projectId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, projectId])
              }

              setSubNavNode(
                getDataForSubNavNode({
                  isNewRecord,
                  collectRecord: collectRecordResponse,
                  sites: sitesResponse,
                  protocol: 'benthicpqt',
                }),
              )

              const updateBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

              setSites(sortArrayByObjectKey(sitesResponse, 'name'))
              setManagementRegimes(sortArrayByObjectKey(managementRegimesResponse, 'name'))
              setChoices(choicesResponse)
              setObserverProfiles(sortArrayByObjectKey(projectProfilesResponse, 'profile_name'))
              setBenthicAttributeOptions(updateBenthicAttributeOptions)
              setCollectRecordBeingEdited(collectRecordResponse)
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
    isSyncInProgress,
    handleHttpResponseError,
  ])

  const handleCollectRecordChange = (updatedCollectRecord) => {
    // eslint-disable-next-line no-console
    console.log('updated: ', updatedCollectRecord)
    setCollectRecordBeingEdited(updatedCollectRecord)

    setSubNavNode(
      getDataForSubNavNode({
        isNewRecord,
        collectRecord: updatedCollectRecord,
        sites,
        protocol: 'benthicpqt',
      }),
    )
  }

  const handleNewObservationAdd = (observationAttributeId) =>
    setNewObservationToAdd(observationAttributeId)

  const handleSitesChange = (updatedSiteRecords) => setSites(updatedSiteRecords)

  const handleManagementRegimesChange = (updatedManagementRegimeRecords) =>
    setManagementRegimes(updatedManagementRegimeRecords)

  const updateBenthicAttributeOptionsStateWithOfflineStorageData = useCallback(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getBenthicAttributes().then((benthicAttributes) => {
        const updatedBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

        setBenthicAttributeOptions(updatedBenthicAttributeOptions)
      })
    }
  }, [databaseSwitchboardInstance])

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

    return Promise.resolve()
  }

  return (
    <ErrorBoundary>
      <CollectRecordFormPage
        isNewRecord={isNewRecord}
        sampleUnitName="benthicpqt"
        collectRecordBeingEdited={collectRecordBeingEdited}
        handleCollectRecordChange={handleCollectRecordChange}
        handleNewObservationAdd={handleNewObservationAdd}
        handleSubmitNewObservation={onSubmitNewBenthicAttribute}
        observationsReducer={observationsReducer}
        sites={sites}
        handleSitesChange={handleSitesChange}
        managementRegimes={managementRegimes}
        handleManagementRegimesChange={handleManagementRegimesChange}
        choices={choices}
        idsNotAssociatedWithData={idsNotAssociatedWithData}
        isLoading={isLoading}
        subNavNode={subNavNode}
        observerProfiles={observerProfiles}
        observationOptions={benthicAttributeOptions}
        modalAttributeOptions={benthicAttributeOptions}
      />
    </ErrorBoundary>
  )
}

BenthicPhotoQuadratForm.propTypes = {
  isNewRecord: PropTypes.bool,
}

BenthicPhotoQuadratForm.defaultProps = {
  isNewRecord: true,
}

export default BenthicPhotoQuadratForm
