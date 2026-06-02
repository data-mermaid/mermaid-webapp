import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  getBeltInvertAdditionalValues,
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
} from '../collectRecordFormInitialValues'
import { getDataForSubNavNode } from '../../../../library/getDataForSubNavNode'
import { getToastArguments } from '../../../../library/getToastArguments'
import { reformatFormValuesIntoBeltInvertRecord } from '../reformatFormValuesIntoRecord'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import CollectRecordFormPage from '../CollectRecordFormPage'
import ErrorBoundary from '../../../ErrorBoundary'
import beltInvertObservationReducer from './beltInvertObservationReducer'
import BeltInvertObservationTable from './BeltInvertObservationTable'
import BeltInvertTransectInputs from './BeltInvertTransectInputs'
import useIsMounted from '../../../../library/useIsMounted'

interface BeltInvertFormProps {
  isNewRecord?: boolean
}

const BeltInvertForm = ({ isNewRecord = true }: BeltInvertFormProps) => {
  const { t } = useTranslation()
  const { recordId, projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const observationsReducer = useReducer(beltInvertObservationReducer, [])
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [observationsState, observationsDispatch] = observationsReducer
  const [sites, setSites] = useState([])
  const [subNavNode, setSubNavNode] = useState(null)
  const [invertAttributes, setInvertAttributes] = useState([]) // to be used in phase 3.2
  const { currentUser } = useCurrentUser()

  const errorMessage = isNewRecord
    ? t('sample_units.errors.supporting_data_unavailable')
    : t('sample_units.errors.data_unavailable')

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getInvertAttributes(),
        databaseSwitchboardInstance.getProject(projectId),
      ]

      if (recordId && !isNewRecord) {
        promises.push(databaseSwitchboardInstance.getCollectRecord(recordId))
      }

      Promise.all(promises)
        .then(
          ([sitesResponse, invertAttributesResponse, projectResponse, collectRecordResponse]) => {
            if (isMounted.current) {
              if (!isNewRecord && !collectRecordResponse && recordId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, recordId])
              }
              if (!projectResponse && projectId) {
                setIdsNotAssociatedWithData((previousState) =>
                  Array.from(new Set([...previousState, projectId])),
                )
              }

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
              setInvertAttributes(invertAttributesResponse)
              setIsLoading(false)
            }
          },
        )
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
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
    errorMessage,
  ])

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
        ...getTransectInitialValues(collectRecordBeingEdited, 'beltinvert_transect'),
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

  const PartiallyAppliedBeltInvertObservationTable = useCallback(
    (props) => {
      return <BeltInvertObservationTable invertAttributes={invertAttributes} {...props} />
    },
    [invertAttributes],
  )

  const PartiallyAppliedBeltInvertTransectInputs = useCallback(
    (props) => {
      return (
        <BeltInvertTransectInputs
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
        ObservationTable1={PartiallyAppliedBeltInvertObservationTable}
        sampleUnitFormatSaveFunction={reformatFormValuesIntoBeltInvertRecord}
        sampleUnitName="macroinvertebrate"
        SampleUnitTransectInputs={PartiallyAppliedBeltInvertTransectInputs}
        setAreObservationsInputsDirty={setAreObservationsInputsDirty}
        setIdsNotAssociatedWithData={setIdsNotAssociatedWithData}
        subNavNode={subNavNode}
      />
    </ErrorBoundary>
  )
}

export default BeltInvertForm
