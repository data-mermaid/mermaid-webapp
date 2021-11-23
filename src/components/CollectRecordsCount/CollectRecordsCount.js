import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import language from '../../language'
import theme from '../../theme'
import { mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'
import { useSyncStatus } from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import useIsMounted from '../../library/useIsMounted'

const CollectRecordsCountWrapper = styled.strong`
  background: ${theme.color.callout};
  border-radius: 100%;
  border: solid 1px ${theme.color.white};
  width: ${theme.spacing.large};
  height: ${theme.spacing.large};
  color: ${theme.color.white};
  float: right;
  display: grid;
  place-items: center;
  font-size: ${theme.typography.smallFontSize};
  ${mediaQueryTabletLandscapeOnly(css`
    float: none;
    margin: 0.5rem auto;
  `)}
`

const CollectRecordsCount = () => {
  const [collectRecordsCount, setCollectRecordsCount] = useState(0)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()

  const _getCollectRecordCount = useEffect(() => {
    if (!isSyncInProgress && databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getCollectRecordsWithoutOfflineDeleted(projectId)
        .then(collectRecords => {
          if (isMounted.current) {
            setCollectRecordsCount(collectRecords.length)
          }
        })
        .catch(() => {
          toast.warn(language.error.collectRecordsUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isSyncInProgress, projectId, isMounted])

  return (
    !!collectRecordsCount && (
      <CollectRecordsCountWrapper data-testid="collect-record-count">
        {collectRecordsCount}
      </CollectRecordsCountWrapper>
    )
  )
}

export default CollectRecordsCount
