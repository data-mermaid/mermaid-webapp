import { toast } from 'react-toastify'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { useParams } from 'react-router-dom'
import { H2 } from '../../generic/text'
import { getToastArguments } from '../../../library/getToastArguments'
import { Table, Tr, Th, Td, TableOverflowWrapper, TableNavigation } from '../../generic/Table/table'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../library/useIsMounted'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import language from '../../../language'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import { useCurrentUser } from '../../../App/CurrentUserContext'

const UsersAndTransects = () => {
  const { isAppOnline } = useOnlineStatus()
  const [isLoading, setIsLoading] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()
  const [observerProfiles, setObserverProfiles] = useState([])
  const [submittedRecords, setSubmittedRecords] = useState([])
  const currentUser = useCurrentUser()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getProjectProfiles(projectId),
        databaseSwitchboardInstance.getRecordsForUsersAndTransectsTable(projectId),
      ])
        .then(([projectProfilesResponse, submittedRecordsResponse]) => {
          if (isMounted.current) {
            setObserverProfiles(projectProfilesResponse)
            setSubmittedRecords(submittedRecordsResponse)
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

  const tableCellData = useMemo(
    () =>
      submittedRecords.map((record) => ({
        site: record.site_name,
        method: record.method,
      })),
    [submittedRecords],
  )

  const tableColumns = useMemo(
    () => [
      {
        Header: () => null,
        id: 'Transect Header',
        columns: [
          { Header: 'Site', accessor: 'site', sortType: reactTableNaturalSort },
          { Header: 'Method', accessor: 'method', sortType: reactTableNaturalSort },
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

  const tableDefaultPrefs = useMemo(() => {
    return {
      sortBy: [
        {
          id: 'site',
          desc: false,
        },
      ],
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser.id}-usersAndTransectsTable`,
    defaultValue: tableDefaultPrefs,
  })

  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageOptions,
    prepareRow,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: {
        pageSize: 15,
        sortBy: tableUserPrefs.sortBy,
      },
    },
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => setPageSize(Number(e.target.value))

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const table = (
    <>
      <TableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              return (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                    >
                      {column.render('Header')}
                    </Th>
                  ))}
                </Tr>
              )
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)

              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td {...cell.getCellProps()} align={cell.column.align}>
                        {cell.render('Cell')}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </tbody>
        </Table>
      </TableOverflowWrapper>
      <TableNavigation>
        <PageSizeSelector
          onChange={handleRowsNumberChange}
          pageSize={pageSize}
          pageSizeOptions={[15, 50, 100]}
        />
        <PageSelector
          onPreviousClick={previousPage}
          previousDisabled={!canPreviousPage}
          onNextClick={nextPage}
          nextDisabled={!canNextPage}
          onGoToPage={gotoPage}
          currentPageIndex={pageIndex}
          pageCount={pageOptions.length}
        />
      </TableNavigation>
    </>
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
