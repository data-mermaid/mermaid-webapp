import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

import {
  getCollectRecordDataInitialValues,
  getTransectInitialValues,
  getSampleInfoInitialValues,
  getBenthicPhotoQuadratAdditionalValues,
} from '../collectRecordFormInitialValues'

import { getBenthicOptions } from '../../../../library/getOptions'
import { getDataForSubNavNode } from '../../../../library/getDataForSubNavNode'
import { getToastArguments } from '../../../../library/getToastArguments'
import { reformatFormValuesIntoBenthicPQTRecord } from '../reformatFormValuesIntoRecord'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import CollectRecordFormPage from '../CollectRecordFormPage'
import language from '../../../../language'
import NewAttributeModal from '../../../NewAttributeModal'
import useIsMounted from '../../../../library/useIsMounted'
import ErrorBoundary from '../../../ErrorBoundary'

import BenthicPhotoQuadratTransectInputs from './BenthicPhotoQuadratTransectInputs'
import BenthicPhotoQuadratObservationTable from './BenthicPhotoQuadratObservationTable'
import benthicpqtObservationReducer from './benthicpqtObservationReducer'
import ImageClassificationContainer from '../../ImageClassification/ImageClassificationTable/ImageClassificationContainer'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import BpqObservationTypeSelector from '../../ImageClassification/SampleUnitInputSelector/BpqObservationTypeSelector'
import ImageClassificationObservationsNotAvailableOfflineMessage from '../../ImageClassification/SampleUnitInputSelector/ImageClassificationObservationsNotAvailableOfflineMessage'
import { getCurrentUserOptionalFeature } from '../../../../library/getCurrentUserOptionalFeature'

const BenthicPhotoQuadratForm = ({ isNewRecord = true }) => {
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [benthicAttributeSelectOptions, setBenthicAttributeSelectOptions] = useState([])
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewBenthicAttributeModalOpen, setIsNewBenthicAttributeModalOpen] = useState(false)
  const [observationIdToAddNewBenthicAttributeTo, setObservationIdToAddNewBenthicAttributeTo] =
    useState()
  const [subNavNode, setSubNavNode] = useState(null)
  const { isAppOnline } = useOnlineStatus()

  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isMounted = useIsMounted()
  const observationsReducer = useReducer(benthicpqtObservationReducer, [])
  const [sites, setSites] = useState([])
  const [isImageClassificationSelected, setIsImageClassificationSelected] = useState(null)

  const [observationsDispatch] = observationsReducer
  const doesRecordHaveImageClassificationData = collectRecordBeingEdited?.data?.image_classification
  const { enabled: isImageClassificationEnabledForUser = false } = getCurrentUserOptionalFeature(
    currentUser,
    'image_classification',
  )

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
        ...getTransectInitialValues(collectRecordBeingEdited, 'quadrat_transect'),
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
      const isImageClassificationObservationsOfflineMessageShowing =
        !isAppOnline && doesRecordHaveImageClassificationData
      const isBpqObservationTypeSelectorShowing = isNewRecord && isImageClassificationEnabledForUser
      const isRegularObservationsTableShowing = !doesRecordHaveImageClassificationData
      const isImageClassificationObservationsTableShowing =
        collectRecordBeingEdited && doesRecordHaveImageClassificationData

      if (isImageClassificationObservationsOfflineMessageShowing) {
        return <ImageClassificationObservationsNotAvailableOfflineMessage />
      }
      if (isBpqObservationTypeSelectorShowing) {
        return (
          <BpqObservationTypeSelector
            setIsImageClassificationSelected={setIsImageClassificationSelected}
            isAppOnline={isAppOnline}
          />
        )
      }
      if (isRegularObservationsTableShowing) {
        return (
          <BenthicPhotoQuadratObservationTable
            benthicAttributeSelectOptions={benthicAttributeSelectOptions}
            {...props}
          />
        )
      }
      if (isImageClassificationObservationsTableShowing) {
        return (
          <ImageClassificationContainer
            {...props}
            isImageClassificationEnabledForUser={isImageClassificationEnabledForUser}
          />
        )
      }
      return null
    },
    [
      collectRecordBeingEdited,
      isAppOnline,
      doesRecordHaveImageClassificationData,
      isNewRecord,
      isImageClassificationEnabledForUser,
      benthicAttributeSelectOptions,
    ],
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
        ObservationTable1={PartiallyAppliedBenthicPhotoQuadratObservationsTable}
        sampleUnitFormatSaveFunction={reformatFormValuesIntoBenthicPQTRecord}
        sampleUnitName="benthicpqt"
        SampleUnitTransectInputs={BenthicPhotoQuadratTransectInputs}
        setAreObservationsInputsDirty={setAreObservationsInputsDirty}
        setIdsNotAssociatedWithData={setIdsNotAssociatedWithData}
        setIsNewBenthicAttributeModalOpen={setIsNewBenthicAttributeModalOpen}
        setObservationIdToAddNewBenthicAttributeTo={setObservationIdToAddNewBenthicAttributeTo}
        subNavNode={subNavNode}
        isImageClassificationSelected={isImageClassificationSelected}
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

export default BenthicPhotoQuadratForm
