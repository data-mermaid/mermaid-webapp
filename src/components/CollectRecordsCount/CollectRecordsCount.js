import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import language from '../../language'
import theme from '../../theme'
import { useSyncStatus } from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'

const CollectRecordsCountWrapper = styled.span`
  background: ${theme.color.cautionColor};
  border-radius: 50%;
  padding: 3px;
  color: ${theme.color.white};
  float: right;
  font-size: 1.4rem;
`

const CollectRecordsCount = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()

  const [collectRecordsCount, setCollectRecordsCount] = useState(0)

  const _getCollectRecordCount = useEffect(() => {
    let isMounted = true

    if (!isSyncInProgress) {
      databaseSwitchboardInstance
        .getCollectRecords()
        .then((collectRecords) => {
          if (isMounted) {
            setCollectRecordsCount(collectRecords.length)
          }
        })
        .catch(() => {
          toast.warn(language.error.collectRecordsUnavailable)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance, isSyncInProgress])

  return (
    !!collectRecordsCount && (
      <CollectRecordsCountWrapper data-testid="collect-record-count">
        {collectRecordsCount}
      </CollectRecordsCountWrapper>
    )
  )
}

export default CollectRecordsCount
