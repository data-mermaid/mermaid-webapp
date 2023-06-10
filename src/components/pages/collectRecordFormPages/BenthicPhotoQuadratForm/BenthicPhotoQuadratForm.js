import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react'
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
import ErrorBoundary from '../../../ErrorBoundary'
import NewAttributeModal from '../../../NewAttributeModal'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import CollectRecordFormPageAlternative from '../CollectRecordFormPageAlternative'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import {
  getCollectRecordDataInitialValues,
  getBenthicPhotoQuadratAdditionalValues,
  getSampleInfoInitialValues,
} from '../collectRecordFormInitialValues'
import BenthicPhotoQuadratObservationTable from './BenthicPhotoQuadratObservationTable'
import { reformatFormValuesIntoBenthicPQTRecord } from '../reformatFormValuesIntoRecord'
import BenthicAttributeTransectInputs from './BenthicAttributeTransectInputs'

const BenthicPhotoQuadratForm = ({ isNewRecord }) => {
  const { recordId, projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const observationsReducer = useReducer(benthicpqtObservationReducer, [])
  const [observationsState, observationsDispatch] = observationsReducer // eslint-disable-line no-unused-vars

  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()

  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [subNavNode, setSubNavNode] = useState(null)
  const [sites, setSites] = useState([])
  const [isNewBenthicAttributeModalOpen, setIsNewBenthicAttributeModalOpen] = useState(false)
  const { currentUser } = useCurrentUser()
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [observationIdToAddNewBenthicAttributeTo, setObservationIdToAddNewBenthicAttributeTo] =
    useState()
  const [benthicAttributeSelectOptions, setBenthicAttributeSelectOptions] = useState([])

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getBenthicAttributes(),
      ]

      if (recordId && !isNewRecord) {
        promises.push(databaseSwitchboardInstance.getCollectRecord(recordId))
      }
      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            benthicAttributesResponse,

            // collectRecord needs to be last in array because its pushed to the promise array conditionally
            collectRecordResponse,
          ]) => {
            if (isMounted.current) {
              if (!isNewRecord && !collectRecordResponse && recordId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, recordId])
              }

              setSubNavNode(
                getDataForSubNavNode({
                  isNewRecord,
                  collectRecord: collectRecordResponse,
                  sites: sitesResponse,
                  protocol: collectRecordResponse?.data.protocol,
                }),
              )

              setCollectRecordBeingEdited(collectRecordResponse)
              setBenthicAttributeSelectOptions(getBenthicOptions(benthicAttributesResponse))
              setSites(sortArrayByObjectKey(sitesResponse, 'name'))

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
  const { getPersistedUnsavedFormData: getPersistedUnsavedFormikData } =
    useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedSampleInfoInputs`)

  const initialFormikFormValues = useMemo(() => {
    return (
      getPersistedUnsavedFormikData() ?? {
        ...getCollectRecordDataInitialValues(collectRecordBeingEdited),
        ...getSampleInfoInitialValues(collectRecordBeingEdited),
        ...getBenthicPhotoQuadratAdditionalValues(collectRecordBeingEdited),
      }
    )
  }, [collectRecordBeingEdited, getPersistedUnsavedFormikData])

  const closeNewBenthicAttributeModal = () => {
    setIsNewBenthicAttributeModalOpen(false)
  }

  const handleCollectRecordChange = (collectRecordResponse) => {
    setCollectRecordBeingEdited(collectRecordResponse)

    setSubNavNode(
      getDataForSubNavNode({
        isNewRecord,
        collectRecord: collectRecordResponse,
        sites,
        protocol: collectRecordResponse?.data.protocol,
      }),
    )
  }

  const updateBenthicAttributeOptionsStateWithOfflineStorageData = useCallback(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getBenthicAttributes().then((benthicAttributes) => {
        const updatedBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

        setBenthicAttributeSelectOptions(updatedBenthicAttributeOptions)
      })
    }
  }, [databaseSwitchboardInstance])

  const onSubmitNewBenthicAttribute = useCallback(
    ({ benthicAttributeParentId, benthicAttributeParentName, newBenthicAttributeName }) => {
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
              observationId: observationIdToAddNewBenthicAttributeTo,
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
                    observationId: observationIdToAddNewBenthicAttributeTo,
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
    },
    [
      databaseSwitchboardInstance,
      handleHttpResponseError,
      observationIdToAddNewBenthicAttributeTo,
      observationsDispatch,
      updateBenthicAttributeOptionsStateWithOfflineStorageData,
    ],
  )
  const PartiallyAppliedBenthicPhotoQuadratObservationsTable = useCallback(
    (props) => {
      // the conditional here makes tests happy
      if (benthicAttributeSelectOptions.length) {
        return (
          <BenthicPhotoQuadratObservationTable
            benthicAttributeSelectOptions={benthicAttributeSelectOptions}
            {...props}
          />
        )
      }

      return null
    },

    [benthicAttributeSelectOptions],
  )

  return (
    <ErrorBoundary>
      <CollectRecordFormPageAlternative
        areObservationsInputsDirty={areObservationsInputsDirty}
        collectRecordBeingEdited={collectRecordBeingEdited}
        handleCollectRecordChange={handleCollectRecordChange}
        idsNotAssociatedWithData={idsNotAssociatedWithData}
        initialFormikFormValues={initialFormikFormValues}
        isNewRecord={isNewRecord}
        isParentDataLoading={isLoading}
        observationsTable1Reducer={observationsReducer}
        ObservationTable1={PartiallyAppliedBenthicPhotoQuadratObservationsTable}
        sampleUnitFormatSaveFunction={reformatFormValuesIntoBenthicPQTRecord}
        sampleUnitName="benthicpqt"
        SampleUnitTransectInputs={BenthicAttributeTransectInputs}
        setAreObservationsInputsDirty={setAreObservationsInputsDirty}
        setIdsNotAssociatedWithData={setIdsNotAssociatedWithData}
        setIsNewBenthicAttributeModalOpen={setIsNewBenthicAttributeModalOpen}
        setObservationIdToAddNewBenthicAttributeTo={setObservationIdToAddNewBenthicAttributeTo}
        subNavNode={subNavNode}
      />
      {!!projectId && !!currentUser && (
        <NewAttributeModal
          isFishBeltSampleUnit={false}
          isOpen={isNewBenthicAttributeModalOpen}
          onDismiss={closeNewBenthicAttributeModal}
          onSubmit={onSubmitNewBenthicAttribute}
          modalAttributeOptions={benthicAttributeSelectOptions}
        />
      )}
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
