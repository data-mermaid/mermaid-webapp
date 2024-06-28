import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useReducer, useEffect, useMemo, useCallback } from 'react'

import {
  getBenthicPitAdditionalValues,
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
} from '../collectRecordFormInitialValues'

import { getBenthicOptions } from '../../../../library/getOptions'
import { getDataForSubNavNode } from '../../../../library/getDataForSubNavNode'
import { getToastArguments } from '../../../../library/getToastArguments'
import { reformatFormValuesIntoBenthicPitRecord } from '../reformatFormValuesIntoRecord'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import benthicPitObservationReducer from './benthicPitObservationReducer'
import BenthicPitObservationsTable from './BenthicPitObservationTable'
import BenthicPitTransectInputs from './BenthicPitTransectInputs'
import CollectRecordFormPage from '../CollectRecordFormPage'
import language from '../../../../language'
import NewAttributeModal from '../../../NewAttributeModal'
import useIsMounted from '../../../../library/useIsMounted'
import ErrorBoundary from '../../../ErrorBoundary'

const BenthicPitForm = ({ isNewRecord = true }) => {
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [benthicAttributeSelectOptions, setBenthicAttributeSelectOptions] = useState([])
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewBenthicAttributeModalOpen, setIsNewBenthicAttributeModalOpen] = useState(false)
  const [observationIdToAddNewBenthicAttributeTo, setObservationIdToAddNewBenthicAttributeTo] =
    useState()
  const [subNavNode, setSubNavNode] = useState()
  const [sites, setSites] = useState()

  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isMounted = useIsMounted()
  const observationsReducer = useReducer(benthicPitObservationReducer, [])

  const [, observationsDispatch] = observationsReducer

  useEffect(
    function loadSupportingData() {
      if (databaseSwitchboardInstance && !isSyncInProgress) {
        if (isNewRecord) {
          setIsLoading(false)
        }

        const promises = [
          databaseSwitchboardInstance.getBenthicAttributes(),
          databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        ]

        if (recordId && !isNewRecord) {
          promises.push(databaseSwitchboardInstance.getCollectRecord(recordId))
        }

        Promise.all(promises)
          .then(([benthicAttributesResponse, sitesResponse, collectRecordResponse]) => {
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
              setSites(sitesResponse)

              setIsLoading(false)
            }
          })
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
      isMounted,
      isNewRecord,
      recordId,
      projectId,
      handleHttpResponseError,
      isSyncInProgress,
    ],
  )

  const { getPersistedUnsavedFormData: getPersistedUnsavedFormikData } =
    useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedSampleInfoInputs`)

  const initialFormikFormValues = useMemo(() => {
    return (
      getPersistedUnsavedFormikData() ?? {
        ...getCollectRecordDataInitialValues(collectRecordBeingEdited),
        ...getSampleInfoInitialValues(collectRecordBeingEdited),
        ...getTransectInitialValues(collectRecordBeingEdited, 'benthic_transect'),
        ...getBenthicPitAdditionalValues(collectRecordBeingEdited),
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
        protocol: collectRecordResponse?.data.protocol,
      }),
    )
  }

  const updateBenthicAttributeOptionsStateWithOfflineStorageData = useCallback(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getBenthicAttributes().then((benthicAttributes) => {
        setBenthicAttributeSelectOptions(getBenthicOptions(benthicAttributes))
      })
    }
  }, [databaseSwitchboardInstance])

  const closeNewBenthicAttributeModal = () => {
    setIsNewBenthicAttributeModalOpen(false)
  }

  const handleSubmitNewBenthicAttribute = ({
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
  }

  const PartiallyAppliedBenthicPitObservationsTable = useCallback(
    (props) => {
      // the conditional here makes tests happy
      if (benthicAttributeSelectOptions.length) {
        return (
          <BenthicPitObservationsTable
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
      <CollectRecordFormPage
        areObservationsInputsDirty={areObservationsInputsDirty}
        collectRecordBeingEdited={collectRecordBeingEdited}
        handleCollectRecordChange={handleCollectRecordChange}
        idsNotAssociatedWithData={idsNotAssociatedWithData}
        initialFormikFormValues={initialFormikFormValues}
        isNewRecord={isNewRecord}
        isParentDataLoading={isLoading}
        observationsTable1Reducer={observationsReducer}
        ObservationTable1={PartiallyAppliedBenthicPitObservationsTable}
        sampleUnitFormatSaveFunction={reformatFormValuesIntoBenthicPitRecord}
        sampleUnitName="benthicpit"
        SampleUnitTransectInputs={BenthicPitTransectInputs}
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
          onSubmit={handleSubmitNewBenthicAttribute}
          modalAttributeOptions={benthicAttributeSelectOptions}
        />
      )}
    </ErrorBoundary>
  )
}

BenthicPitForm.propTypes = { isNewRecord: PropTypes.bool }

export default BenthicPitForm
