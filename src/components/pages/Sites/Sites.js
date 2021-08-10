import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { matchSorter } from 'match-sorter'
import {
  usePagination,
  useSortBy,
  useGlobalFilter,
  useTable,
} from 'react-table'
import { ContentPageLayout } from '../../Layout'
import { H2 } from '../../generic/text'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import { RowBottom } from '../../generic/positioning'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
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
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import { ToolbarButtonWrapper, ButtonSecondary } from '../../generic/buttons'
import { IconPlus, IconCopy, IconDownload } from '../../icons'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'

const Sites = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [siteRecordsForUiDisplay, setSiteRecordsForUiDisplay] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { projectId } = useParams()

  const _getSiteRecords = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getSiteRecordsForUIDisplay(projectId)
        .then((records) => {
          if (isMounted) {
            setSiteRecordsForUiDisplay(records)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(language.error.collectRecordsUnavailable)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance, projectId])

  const currentProjectPath = useCurrentProjectPath()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Reef Type',
        accessor: 'reefType',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Reef Zone',
        accessor: 'reefZone',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Exposure',
        accessor: 'exposure',
        sortType: reactTableNaturalSort,
      },
    ],
    [],
  )

  const tableCellData = useMemo(
    () =>
      siteRecordsForUiDisplay.map(({ id, uiLabels }) => ({
        name: (
          <Link to={`${currentProjectPath}/sites/${id}`}>{uiLabels.name}</Link>
        ),
        reefType: uiLabels.reefType,
        reefZone: uiLabels.reefZone,
        exposure: uiLabels.exposure,
      })),
    [siteRecordsForUiDisplay, currentProjectPath],
  )

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = [
      'values.name.props.children',
      'values.reefType',
      'values.reefZone',
      'values.exposure',
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
  const handleRowsNumberChange = (e) => {
    setPageSize(Number(e.target.value))
  }

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

  return (
    <ContentPageLayout
      toolbar={
        <>
          <H2>Sites</H2>
          <RowBottom>
            <FilterSearchToolbar
              name={language.pages.siteTable.filterToolbarText}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />
            <ToolbarButtonWrapper>
              <ButtonSecondary>
                <IconPlus /> New site
              </ButtonSecondary>
              <ButtonSecondary>
                <IconCopy /> Copy sites from other projects
              </ButtonSecondary>
              <ButtonSecondary>
                <IconDownload /> Export sites
              </ButtonSecondary>
            </ToolbarButtonWrapper>
          </RowBottom>
        </>
      }
      content={table}
      isPageContentLoading={isLoading}
    />
  )
}

export default Sites
