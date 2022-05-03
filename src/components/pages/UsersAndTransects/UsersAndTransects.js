import { toast } from 'react-toastify'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useTable } from 'react-table'
import { useParams } from 'react-router-dom'
import { H2 } from '../../generic/text'
import { getToastArguments } from '../../../library/getToastArguments'
import { Table, Tr, Th, TableOverflowWrapper } from '../../generic/Table/table'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../library/useIsMounted'
import language from '../../../language'

const UsersAndTransects = () => {
  const { isAppOnline } = useOnlineStatus()
  const [isLoading, setIsLoading] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()
  const [observerProfiles, setObserverProfiles] = useState([])

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([databaseSwitchboardInstance.getProjectProfiles(projectId)])
        .then(([projectProfilesResponse]) => {
          if (isMounted.current) {
            setObserverProfiles(projectProfilesResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.userRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted])

  const getUserColumnHeaders = useCallback(() => {
    return observerProfiles.map((user) => {
      return { Header: user.profile_name, id: user.id }
    })
  }, [observerProfiles])

  const tableColumns = useMemo(
    () => [
      {
        Header: () => null,
        id: 'Transect Header',
        columns: [
          { Header: 'Site' },
          { Header: 'Method' },
          { Header: 'Submitted Transect Number' },
        ],
      },
      {
        Header: () => (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            Transect Number / User
          </div>
        ),
        id: 'User Headers',
        columns: getUserColumnHeaders(),
      },
    ],
    [getUserColumnHeaders],
  )
  const { getTableProps, headerGroups } = useTable({
    columns: tableColumns,
    data: [],
  })

  const table = (
    <TableOverflowWrapper>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            return (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
                ))}
              </Tr>
            )
          })}
        </thead>
      </Table>
    </TableOverflowWrapper>
  )

  const content = isAppOnline ? table : <PageUnavailableOffline />

  return (
    <ContentPageLayout
      isPageContentLoading={isAppOnline ? isLoading : false}
      content={content}
      toolbar={
        <>
          <H2>Users Overview</H2>
        </>
      }
    />
  )
}

export default UsersAndTransects
