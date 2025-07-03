import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useReducer, useEffect, useMemo, useCallback } from 'react'

import {
  getBleachingQuadratCollection,
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
} from '../collectRecordFormInitialValues'
import { getBenthicOptions } from '../../../../library/getOptions'
import { getDataForSubNavNode } from '../../../../library/getDataForSubNavNode'
import { getToastArguments } from '../../../../library/getToastArguments'
import { reformatFormValuesIntoBleachingRecord } from '../reformatFormValuesIntoRecord'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import BleachingTransectInputs from './BleachingTransectInputs'
import CollectRecordFormPage from '../CollectRecordFormPage'
import coloniesBleachedObservationReducer from './coloniesBleachedObservationsReducer'
import ColoniesBleachedObservationsTable from './ColoniesBleachedObservationsTable'
import NewAttributeModal from '../../../NewAttributeModal'
import percentCoverObservationsReducer from './percentCoverObservationsReducer'
import PercentCoverObservationTable from './PercentCoverObservationsTable'
import useIsMounted from '../../../../library/useIsMounted'
import ErrorBoundary from '../../../ErrorBoundary'
import { useTranslation } from 'react-i18next'

const BleachingForm = ({ isNewRecord = true }) => {
  const { t } = useTranslation
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [benthicAttributeSelectOptions, setBenthicAttributeSelectOptions] = useState([])
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewBenthicAttributeModalOpen, setIsNewBenthicAttributeModalOpen] = useState(false)
  const [observationIdToAddNewBenthicAttributeTo, setObservationIdToAddNewBenthicAttributeTo] =
    useState()
  const [subNavNode, setSubNavNode] = useState(null)
  const [sites, setSites] = useState()

  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const coloniesBleachedReducer = useReducer(coloniesBleachedObservationReducer, [])
  const percentCoverReducer = useReducer(percentCoverObservationsReducer, [])
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isMounted = useIsMounted()

  const [, coloniesBleachedDispatch] = coloniesBleachedReducer

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
                  ? t('sample_units.errors.supporting_data_unavailable')
                  : t('sample_units.errors.data_unavailable')

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
        ...getBleachingQuadratCollection(collectRecordBeingEdited),
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
        const updatedBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

        setBenthicAttributeSelectOptions(updatedBenthicAttributeOptions)
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
        coloniesBleachedDispatch({
          type: 'updateBenthicAttribute',
          payload: {
            observationId: observationIdToAddNewBenthicAttributeTo,
            newValue: newBenthicAttribute.id,
          },
        })
        updateBenthicAttributeOptionsStateWithOfflineStorageData()
        setAreObservationsInputsDirty(true)
        toast.success(
          ...getToastArguments(
            t('benthic_observations.proposed_attribute_saved', {
              attribute: newBenthicAttributeName,
            }),
          ),
        )
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            if (error.message === 'Benthic attribute already exists') {
              toast.error(
                ...getToastArguments(
                  t('benthic_observations.attribute_already_exists', {
                    attribute: newBenthicAttributeName,
                  }),
                ),
              )

              coloniesBleachedDispatch({
                type: 'updateBenthicAttribute',
                payload: {
                  observationId: observationIdToAddNewBenthicAttributeTo,
                  newValue: error.existingBenthicAttribute.id,
                },
              })
              setAreObservationsInputsDirty(true)
            } else {
              toast.error(
                ...getToastArguments(
                  t('benthic_observations.errors.attribute_proposal_unsaved', {
                    attribute: newBenthicAttributeName,
                  }),
                ),
              )
            }
          },
        })
      })
  }

  const ColoniesBleachedObservationsTablePartiallyApplied = useCallback(
    (props) => (
      <ColoniesBleachedObservationsTable
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        {...props}
      />
    ),
    [benthicAttributeSelectOptions],
  )

  return (
    <ErrorBoundary>
      <CollectRecordFormPage
        collectRecordBeingEdited={collectRecordBeingEdited}
        handleCollectRecordChange={handleCollectRecordChange}
        idsNotAssociatedWithData={idsNotAssociatedWithData}
        initialFormikFormValues={initialFormikFormValues}
        isNewRecord={isNewRecord}
        isParentDataLoading={isLoading}
        observationsTable1Reducer={coloniesBleachedReducer}
        observationsTable2Reducer={percentCoverReducer}
        ObservationTable1={ColoniesBleachedObservationsTablePartiallyApplied}
        ObservationTable2={PercentCoverObservationTable}
        sampleUnitFormatSaveFunction={reformatFormValuesIntoBleachingRecord}
        sampleUnitName="bleachingqc"
        SampleUnitTransectInputs={BleachingTransectInputs}
        areObservationsInputsDirty={areObservationsInputsDirty}
        setAreObservationsInputsDirty={setAreObservationsInputsDirty}
        setIdsNotAssociatedWithData={setIdsNotAssociatedWithData}
        setObservationIdToAddNewBenthicAttributeTo={setObservationIdToAddNewBenthicAttributeTo}
        setIsNewBenthicAttributeModalOpen={setIsNewBenthicAttributeModalOpen}
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

BleachingForm.propTypes = { isNewRecord: PropTypes.bool }

export default BleachingForm
