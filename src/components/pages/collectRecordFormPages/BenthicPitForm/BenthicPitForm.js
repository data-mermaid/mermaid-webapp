import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useReducer, useEffect, useMemo } from 'react'

import {
  getBenthicPitAdditionalValues,
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
} from '../collectRecordFormInitialValues'

import { getToastArguments } from '../../../../library/getToastArguments'
import { reformatFormValuesIntoBenthicPitRecord } from '../CollectRecordFormPage/reformatFormValuesIntoRecord'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import benthicPitObservationReducer from './benthicPitObservationReducer'
import BenthicPitTransectInputs from './BenthicPitTransectInputs'
import CollectRecordFormPageAlternative from '../CollectRecordFormPageAlternative'
import language from '../../../../language'
import useIsMounted from '../../../../library/useIsMounted'

const BenthicPitForm = ({ isNewRecord }) => {
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isMounted = useIsMounted()
  const observationsReducer = useReducer(benthicPitObservationReducer, [])

  const handleCollectRecordChange = (updatedCollectRecord) =>
    setCollectRecordBeingEdited(updatedCollectRecord)

  useEffect(
    function getBenthicPitData() {
      if (databaseSwitchboardInstance && !isSyncInProgress) {
        if (isNewRecord) {
          setIsLoading(false)
        }

        if (recordId && !isNewRecord) {
          databaseSwitchboardInstance
            .getCollectRecord(recordId)
            .then((collectRecordResponse) => {
              if (isMounted.current) {
                if (!isNewRecord && !collectRecordResponse && recordId) {
                  setIdsNotAssociatedWithData((previousState) => [...previousState, recordId])
                }

                setCollectRecordBeingEdited(collectRecordResponse)

                setIsLoading(false)
              }
            })
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

  return (
    <CollectRecordFormPageAlternative
      collectRecordBeingEdited={collectRecordBeingEdited}
      handleCollectRecordChange={handleCollectRecordChange}
      idsNotAssociatedWithData={idsNotAssociatedWithData} // maybe handle this too
      initialFormikFormValues={initialFormikFormValues}
      isNewRecord={isNewRecord}
      isParentDataLoading={isLoading}
      observationsReducer={observationsReducer}
      ObservationTable={() => <>OBSERVATIONS SECTION COMING SOON</>}
      sampleUnitFormatSaveFunction={reformatFormValuesIntoBenthicPitRecord}
      sampleUnitName="benthicpit" // maybe use this to derive form name form name
      SampleUnitTransectInputs={BenthicPitTransectInputs}
      handleSubmitNewAttribute={() => {}}
      areObservationsInputsDirty={areObservationsInputsDirty}
      setAreObservationsInputsDirty={setAreObservationsInputsDirty}
      setIdsNotAssociatedWithData={setIdsNotAssociatedWithData}
    />
  )
}

BenthicPitForm.propTypes = { isNewRecord: PropTypes.bool }
BenthicPitForm.defaultProps = { isNewRecord: true }

export default BenthicPitForm
