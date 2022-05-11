import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Link, useParams } from 'react-router-dom'
import { usePagination, useSortBy, useTable } from 'react-table'
import { toast } from 'react-toastify'

import { ContentPageLayout } from '../../Layout'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getToastArguments } from '../../../library/getToastArguments'
import { H2 } from '../../generic/text'
import language from '../../../language'
import PageUnavailableOffline from '../PageUnavailableOffline'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import { Table, Tr, Th, Td, TableOverflowWrapper, TableNavigation } from '../../generic/Table/table'
import theme from '../../../theme'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../library/useIsMounted'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'

const HeaderCenter = styled.div`
  text-align: center;
`

const InlineCell = styled.div`
  display: inline-flex;
`

const UserColumnHeader = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
`

const CollectRecordsCountWrapper = styled.strong`
  background: ${theme.color.callout};
  border-radius: 100%;
  border: solid 1px ${theme.color.white};
  width: ${theme.spacing.xlarge};
  height: ${theme.spacing.xlarge};
  color: ${theme.color.white};
  display: grid;
  margin: auto 0.5rem;
  place-items: center;
  font-size: ${theme.typography.smallFontSize};
`

const UsersAndTransects = () => {
  const { isAppOnline } = useOnlineStatus()
  const [isLoading, setIsLoading] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()
  const [observerProfiles, setObserverProfiles] = useState([])
  const [submittedRecords, setSubmittedRecords] = useState([])
  const [submittedTransectNumbers, setSubmittedTransectNumbers] = useState([])
  const currentProjectPath = useCurrentProjectPath()
  const currentUser = useCurrentUser()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getProjectProfiles(projectId),
        databaseSwitchboardInstance.getRecordsForUsersAndTransectsTable(projectId),
      ])
        .then(([projectProfilesResponse, submittedRecordsResponse]) => {
          if (isMounted.current) {
            const numbers = submittedRecordsResponse
              .reduce((acc, record) => acc.concat(record.sample_unit_numbers), [])
              .map((reducedRecords) => reducedRecords.sample_unit_number)

            const uniqueNumbersAsc = [...new Set(numbers)].sort((a, b) => a - b)

            setObserverProfiles(projectProfilesResponse)
            setSubmittedRecords(submittedRecordsResponse)
            setSubmittedTransectNumbers(uniqueNumbersAsc)
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
      return {
        Header: (
          <UserColumnHeader>
            <span>{user.profile_name}</span>
            <span>
              <CollectRecordsCountWrapper>
                {user.num_active_sample_units}
              </CollectRecordsCountWrapper>
            </span>
          </UserColumnHeader>
        ),
        id: user.id,
      }
    })
  }, [observerProfiles])

  const getSubmittedTransectNumberColumnHeaders = useCallback(() => {
    return submittedTransectNumbers.map((number) => {
      const unitNumberColumn = number ? number.toString() : 'NaN'

      return {
        Header: unitNumberColumn,
        id: unitNumberColumn,
        accessor: unitNumberColumn,
        disableSortBy: true,
      }
    })
  }, [submittedTransectNumbers])

  const tableColumns = useMemo(
    () => [
      { Header: 'Site', accessor: 'site', sortType: reactTableNaturalSort },
      { Header: 'Method', accessor: 'method', sortType: reactTableNaturalSort },
      {
        Header: () => <HeaderCenter>Submitted Transect Number</HeaderCenter>,
        id: 'Transect Number Headers',
        columns: getSubmittedTransectNumberColumnHeaders(),
      },
      {
        Header: () => <HeaderCenter>Transect Number / User</HeaderCenter>,
        id: 'User Headers',
        columns: getUserColumnHeaders(),
      },
    ],
    [getUserColumnHeaders, getSubmittedTransectNumberColumnHeaders],
  )

  const populateNumberRow = useCallback(
    (rowRecord) => {
      const rowNumbers = rowRecord.sample_unit_numbers.map(
        ({ sample_unit_number }) => sample_unit_number,
      )

      return submittedTransectNumbers.reduce((accumulator, number) => {
        if (!accumulator[number]) {
          accumulator[number] = '-'
        }

        if (rowNumbers.includes(number)) {
          const filteredRowSampleUnitNumbers = rowRecord.sample_unit_numbers.filter(
            ({ sample_unit_number }) => sample_unit_number === number,
          )

          const sampleUnitNumberLinks = filteredRowSampleUnitNumbers.map((row, idx) => {
            return (
              <span key={row.id}>
                <Link to={`${currentProjectPath}/data/${rowRecord.transect_protocol}/${row.id}`}>
                  {row.sample_unit_number}
                </Link>
                {idx < filteredRowSampleUnitNumbers.length - 1 && ', '}
              </span>
            )
          })

          accumulator[number] = <InlineCell>{sampleUnitNumberLinks}</InlineCell>
        }

        return accumulator
      }, {})
    },
    [submittedTransectNumbers, currentProjectPath],
  )

  const tableCellData = useMemo(
    () =>
      submittedRecords.map((record) => ({
        site: record.site_name,
        method: record.method,
        ...populateNumberRow(record),
      })),
    [submittedRecords, populateNumberRow],
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
        pageSize: 100,
        sortBy: tableUserPrefs.sortBy,
      },
      isMultiSortEvent: () => true,
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
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const isMultiSortColumn = headerGroup.headers.some(
                    (header) => header.sortedIndex > 0,
                  )

                  return (
                    <Th
                      {...column.getHeaderProps(getTableColumnHeaderProps(column))}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                      isMultiSortColumn={isMultiSortColumn}
                    >
                      {column.render('Header')}
                    </Th>
                  )
                })}
              </Tr>
            ))}
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
          pageSizeOptions={[100, 200]}
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
