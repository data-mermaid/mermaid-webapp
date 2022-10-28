import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import { useSyncStatus } from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import useIsMounted from '../../library/useIsMounted'
import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'

const CollectRecordsCountWrapper = styled.strong`
  background: ${theme.color.callout};
  border-radius: 100%;
  border: solid 1px ${theme.color.white};
  width: ${theme.spacing.xlarge};
  height: ${theme.spacing.xlarge};
  color: ${theme.color.white};
  display: grid;
  place-items: center;
  font-size: ${theme.typography.smallFontSize};
`

const CollectRecordsCount = () => {
  const [collectRecordsCount, setCollectRecordsCount] = useState(0)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const _getCollectRecordCount = useEffect(() => {
    if (!isSyncInProgress && databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getCollectRecordsWithoutOfflineDeleted(projectId)
        .then((collectRecords) => {
          if (isMounted.current) {
            setCollectRecordsCount(collectRecords.length)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordsUnavailable))
            },
          })
        })
    }
  }, [databaseSwitchboardInstance, isSyncInProgress, projectId, isMounted, handleHttpResponseError])

  return (
    !!collectRecordsCount && (
      <CollectRecordsCountWrapper data-testid="collect-record-count">
        {collectRecordsCount}
      </CollectRecordsCountWrapper>
    )
  )
}

export default CollectRecordsCount
