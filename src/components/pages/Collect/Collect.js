import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { Link, useParams } from 'react-router-dom'
import { matchSorter } from 'match-sorter'
import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { Table, Tr, Th, Td, TableOverflowWrapper, TableNavigation } from '../../generic/Table/table'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
  reactTableNaturalSortDates,
} from '../../generic/Table/reactTableNaturalSort'
import { ContentPageLayout } from '../../Layout'
import { H2 } from '../../generic/text'
import { ToolBarRow } from '../../generic/positioning'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import AddSampleUnitButton from './AddSampleUnitButton'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import useIsMounted from '../../../library/useIsMounted'

const Collect = () => {
  const [collectRecordsForUiDisplay, setCollectRecordsForUiDisplay] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()

  const _getCollectRecords = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getCollectRecordsForUIDisplay(projectId),
        databaseSwitchboardInstance.getProject(projectId),
      ])

        .then(([records, project]) => {
          if (isMounted.current) {
            if (!project && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }
            setCollectRecordsForUiDisplay(records)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(
            ...getToastArguments(language.error.collectRecordsUnavailable)
          )
        })
    }
  }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted])

  const currentProjectPath = useCurrentProjectPath()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Method',
        accessor: 'method',
        sortType: reactTableNaturalSortReactNodes,
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
      {
        Header: 'Status',
        accessor: 'status',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Synced',
        accessor: 'synced',
        sortType: reactTableNaturalSort,
      },
    ],
    [],
  )

  const tableCellData = useMemo(
    () =>
      collectRecordsForUiDisplay.map(({ id, data, uiLabels }) => ({
        method: (
          <Link to={`${currentProjectPath}/collecting/${data.protocol}/${id}`}>
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
        status: uiLabels.status,
        synced: 'wip',
      })),
    [collectRecordsForUiDisplay, currentProjectPath],
  )

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = [
      'values.method.props.children',
      'values.site',
      'values.management',
      'values.observers',
    ]

    const queryTerms = splitSearchQueryStrings(query)

    if (!queryTerms) {
      return rows
    }

    return queryTerms.reduce((results, term) => matchSorter(results, term, { keys }), rows)
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
      initialState: { pageSize: 15 },
      globalFilter: tableGlobalFilters,
      // Disables requirement to hold shift to enable multi-sort
      isMultiSortEvent: () => true
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )
  const handleRowsNumberChange = (e) => {
    setPageSize(Number(e.target.value))
  }

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const table = (
    <>
      <TableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const isMultiSortColumn = headerGroup.headers.some(header => header.sortedIndex > 0)

              return (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                      isMultiSortColumn={isMultiSortColumn}
                    >
                      {column.render('Header')}
                    </Th>
                  ))}
                </Tr>
              )
            }
            )}
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

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      toolbar={
        <>
          <H2>Collecting</H2>
          <ToolBarRow>
            <FilterSearchToolbar
              name={language.pages.collectTable.filterToolbarText}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />
            <AddSampleUnitButton />
          </ToolBarRow>
        </>
      }
      content={table}
      isPageContentLoading={isLoading}
    />
  )
}

export default Collect
