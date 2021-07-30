import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { matchSorter } from 'match-sorter'
import {
  usePagination,
  useSortBy,
  useGlobalFilter,
  useTable,
} from 'react-table'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import language from '../../../language'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import {
  Table,
  Tr,
  Th,
  Td,
  TableOverflowWrapper,
  TableNavigation,
} from '../../generic/Table/table'
import {
  reactTableNaturalSort,
  reactTableNaturalSortDates,
} from '../../generic/Table/reactTableNaturalSort'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import useIsMounted from '../../../library/useIsMounted'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import DataToolbarSection from './DataToolbarSection'

const Data = () => {
  const isMounted = useIsMounted()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [
    submittedRecordsForUiDisplay,
    setSubmittedRecordsForUiDisplay,
  ] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isOnline } = useOnlineStatus()

  const _getSubmittedRecords = useEffect(() => {
    if (databaseSwitchboardInstance && isMounted) {
      databaseSwitchboardInstance
        .getSubmittedRecordsForUIDisplay()
        .then((records) => {
          if (isMounted) {
            setSubmittedRecordsForUiDisplay(records)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(language.error.submittedRecordsUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isMounted])
  const currentProjectPath = useCurrentProjectPath()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Method',
        accessor: 'method',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Site',
        accessor: 'site',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Management',
        accessor: 'management',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Sample Unit #',
        accessor: 'sampleUnitNumber',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Size',
        accessor: 'size',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Depth (m)',
        accessor: 'depth',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Sample Date',
        accessor: 'sampleDate',
        sortType: reactTableNaturalSortDates,
      },
      {
        Header: 'Observers',
        accessor: 'observers',
        sortType: reactTableNaturalSort,
      },
    ],
    [],
  )

  const tableCellData = useMemo(
    () =>
      submittedRecordsForUiDisplay.map(({ id, protocol, uiLabels }) => ({
        method: (
          <Link to={`${currentProjectPath}/data/${protocol}/${id}`}>
            {uiLabels.protocol}
          </Link>
        ),
        site: uiLabels.site,
        management: uiLabels.management,
        sampleUnitNumber: uiLabels.sampleUnitNumber,
        size: uiLabels.size,
        depth: uiLabels.depth,
        sampleDate: uiLabels.sampleDate,
        observers: uiLabels.observers,
      })),
    [submittedRecordsForUiDisplay],
  )

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = [
      'values.method',
      'values.site',
      'values.management',
      'values.observers',
    ]

    const queryTerms = splitSearchQueryStrings(query)

    if (!queryTerms) {
      return rows
    }

    return queryTerms.reduce(
      (results, term) => matchSorter(results, term, { keys }),
      rows,
    )
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
    state: { pageIndex, pageSize },
    setGlobalFilter,
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: { pageSize: 10 },
      globalFilter: tableGlobalFilters,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => setPageSize(Number(e.target.value))

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const table = (
    <>
      <TableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isSorted={column.isSorted}
                    isSortedDescending={column.isSortedDesc}
                  >
                    {column.render('Header')}
                  </Th>
                ))}
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
          pageSizeOptions={[10, 50, 100]}
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

  const content = isOnline ? <>{table}</> : <PageUnavailableOffline />

  return (
    <ContentPageLayout
      content={content}
      toolbar={
        <DataToolbarSection
          name={language.pages.submittedTable.filterToolbarText}
          handleGlobalFilterChange={handleGlobalFilterChange}
        />
      }
      isLoading={isLoading}
    />
  )
}

export default Data
