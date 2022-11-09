import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import useIsMounted from '../../../../library/useIsMounted'
import { getRecordName } from '../../../../library/getRecordName'
import { getToastArguments } from '../../../../library/getToastArguments'
import language from '../../../../language'

const SubmittedBenthicPIT = () => {
  const { isAppOnline } = useOnlineStatus()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { submittedRecordId, projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  // eslint-disable-next-line no-unused-vars
  const [sites, setSites] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [managementRegimes, setManagementRegimes] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [choices, setChoices] = useState({})
  // eslint-disable-next-line no-unused-vars
  const [submittedRecord, setSubmittedRecord] = useState()
  // eslint-disable-next-line no-unused-vars
  const [subNavNode, setSubNavNode] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])

  const _getSupportingData = useEffect(() => {
    if (isAppOnline && databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getSubmittedSampleUnitRecord(
          projectId,
          submittedRecordId,
          'benthicpittransectmethods',
        ),
      ]

      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            // benthicAttributes,
            submittedRecordResponse,
          ]) => {
            if (isMounted.current) {
              const recordNameForSubNode = getRecordName(
                submittedRecordResponse,
                sitesResponse,
                // what is quadrat_transect and does it relate to Benthic PIT
                'quadrat_transect',
              )

              //   const updateBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              //   setBenthicAttributeOptions(updateBenthicAttributeOptions)
              setSubmittedRecord(submittedRecordResponse)
              setSubNavNode(recordNameForSubNode)
              setIsLoading(false)
            }
          },
        )
        .catch((error) => {
          const errorStatus = error.response?.status

          if ((errorStatus === 404 || errorStatus === 400) && isMounted.current) {
            setIdsNotAssociatedWithData([projectId, submittedRecordId])
            setIsLoading(false)
          }
          toast.error(...getToastArguments(language.error.submittedRecordUnavailable))
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    submittedRecordId,
    projectId,
    isAppOnline,
    isSyncInProgress,
  ])
}

export default SubmittedBenthicPIT
