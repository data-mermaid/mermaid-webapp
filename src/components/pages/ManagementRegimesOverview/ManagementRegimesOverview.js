import React, { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'
import { ContentPageLayout } from '../../Layout'
import { H2 } from '../../generic/text'
import language from '../../../language'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import useIsMounted from '../../../library/useIsMounted'

const ManagementRegimesOverview = () => {
  const { isAppOnline } = useOnlineStatus()
  const [isLoading, setIsLoading] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const [managemeRegimeRecords, setManagemeRegimeRecords] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const { currentUser } = useCurrentUser()

  const _getSupportingData = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId) {
    }
  }, [databaseSwitchboardInstance, projectId, isMounted, isAppOnline])

  const toolbar = <H2>{language.pages.managementRegimesOverview.title}</H2>

  return <ContentPageLayout content={<></>} toolbar={toolbar} />
}

export default ManagementRegimesOverview
