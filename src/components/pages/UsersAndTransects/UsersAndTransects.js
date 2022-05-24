import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Link, useParams } from 'react-router-dom'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { toast } from 'react-toastify'

import { ContentPageLayout } from '../../Layout'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../library/getToastArguments'
import { H2 } from '../../generic/text'
import language from '../../../language'
import PageUnavailableOffline from '../PageUnavailableOffline'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import { Table, Tr, Th, Td, TableOverflowWrapper, TableNavigation } from '../../generic/Table/table'
import { ToolBarRow } from '../../generic/positioning'
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
`

const ActiveRecordsCount = styled.strong`
  background: ${theme.color.callout};
  border-radius: 100%;
  border: solid 1px ${theme.color.white};
  width: ${theme.spacing.xlarge};
  height: ${theme.spacing.xlarge};
  color: ${theme.color.white};
  display: grid;
  margin: 0.25rem 0.5rem;
  place-items: center;
  font-size: ${theme.typography.smallFontSize};
`

const SampleUnitLinks = ({ rowRecord, sampleUnitNumbersRow }) => {
  const currentProjectPath = useCurrentProjectPath()

  const sampleUnitLinks = sampleUnitNumbersRow.map((row, idx) => {
    return (
      <span key={row.id}>
        <Link to={`${currentProjectPath}/data/${rowRecord.transect_protocol}/${row.id}`}>
          {row.label}
        </Link>
        {idx < sampleUnitNumbersRow.length - 1 && ', '}
      </span>
    )
  })

  return <InlineCell>{sampleUnitLinks}</InlineCell>
}

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
  const { currentUser } = useCurrentUser()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getProjectProfiles(projectId),
        databaseSwitchboardInstance.getRecordsForUsersAndTransectsTable(projectId),
      ])
        .then(([projectProfilesResponse, sampleUnitRecordsResponse]) => {
          if (isMounted.current) {
            const numbersNew = sampleUnitRecordsResponse
              .reduce((acc, record) => acc.concat(record.sample_unit_numbers), [])
              .map((reducedRecords) => reducedRecords.label)

            const uniqueNumbersAscNew = [...new Set(numbersNew)]

            setObserverProfiles(projectProfilesResponse)
            setSubmittedRecords(sampleUnitRecordsResponse)
            setSubmittedTransectNumbers(uniqueNumbersAscNew)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.userRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted])

  const getUserColumnHeaders = useCallback(() => {
    const filteredObservers = observerProfiles.filter(
      ({ num_active_sample_units }) => num_active_sample_units > 0,
    )

    return filteredObservers.map((user) => {
      return {
        Header: (
          <UserColumnHeader>
            <span>{user.profile_name}</span>
            <span>
              <ActiveRecordsCount>{user.num_active_sample_units}</ActiveRecordsCount>
            </span>
          </UserColumnHeader>
        ),
        id: user.id,
        accessor: user.profile,
      }
    })
  }, [observerProfiles])

  const getSubmittedTransectNumberColumnHeaders = useCallback(() => {
    return submittedTransectNumbers.map((number) => {
      return {
        Header: number,
        id: number,
        accessor: number,
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

  const populateTransectNumberRow = useCallback(
    (rowRecord) => {
      const rowNumbers = rowRecord.sample_unit_numbers.map(({ label }) => label)

      const submittedTransectNumbersRow = submittedTransectNumbers.reduce((accumulator, number) => {
        if (!accumulator[number]) {
          accumulator[number] = '-'
        }

        if (rowNumbers.includes(number)) {
          const filteredRowSampleUnitNumbers = rowRecord.sample_unit_numbers.filter(
            ({ label }) => label === number,
          )

          accumulator[number] = (
            <SampleUnitLinks
              rowRecord={rowRecord}
              sampleUnitNumbersRow={filteredRowSampleUnitNumbers}
            />
          )
        }

        return accumulator
      }, {})

      return submittedTransectNumbersRow
    },
    [submittedTransectNumbers],
  )

  const populateCollectNumberRow = useCallback(
    (rowRecord) => {
      const collectTransectNumbersRow = observerProfiles.reduce((accumulator, record) => {
        accumulator[record.profile] = rowRecord.profile_summary[record.profile]
          ? rowRecord.profile_summary[record.profile].labels.sort((a, b) => a - b).join(', ')
          : '-'

        return accumulator
      }, {})

      return collectTransectNumbersRow
    },
    [observerProfiles],
  )

  const tableCellData = useMemo(
    () =>
      submittedRecords.map((record) => ({
        site: record.site_name,
        method: record.method,
        ...populateTransectNumberRow(record),
        ...populateCollectNumberRow(record),
      })),
    [submittedRecords, populateTransectNumberRow, populateCollectNumberRow],
  )

  const tableDefaultPrefs = useMemo(() => {
    return {
      sortBy: [
        {
          id: 'site',
          desc: false,
        },
      ],
      globalFilter: '',
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser.id}-usersAndTransectsTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.site', 'values.method']

    const queryTerms = splitSearchQueryStrings(query)

    if (!queryTerms || !queryTerms.length) {
      return rows
    }

    return getTableFilteredRows(rows, keys, queryTerms)
  }, [])

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
    setGlobalFilter,
    state: { pageIndex, pageSize, sortBy, globalFilter },
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: {
        pageSize: 100,
        sortBy: tableUserPrefs.sortBy,
        globalFilter: tableUserPrefs.globalFilter,
      },
      globalFilter: tableGlobalFilters,
      isMultiSortEvent: () => true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => setPageSize(Number(e.target.value))

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const _setFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: globalFilter })
  }, [globalFilter, handleSetTableUserPrefs])

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
          <ToolBarRow>
            <FilterSearchToolbar
              name={language.pages.usersAndTransectsTable.filterToolbarText}
              value={tableUserPrefs.globalFilter}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />
          </ToolBarRow>
        </>
      }
    />
  )
}

SampleUnitLinks.propTypes = {
  rowRecord: PropTypes.shape({
    transect_protocol: PropTypes.string,
  }).isRequired,
  sampleUnitNumbersRow: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      sample_unit_number: PropTypes.number,
    }),
  ).isRequired,
}

export default UsersAndTransects
