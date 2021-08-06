import { Link } from 'react-router-dom'
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
import { IconCheck, IconPlus, IconCopy, IconDownload } from '../../icons'
import {
  Table,
  Tr,
  Th,
  Td,
  TableOverflowWrapper,
  TableNavigation,
  InnerCell,
} from '../../generic/Table/table'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import { ToolbarButtonWrapper, ButtonSecondary } from '../../generic/buttons'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'

const ManagementRegimes = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [
    managementRegimeRecordsForUiDisplay,
    setManagementRegimeRecordsForUiDisplay,
  ] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const _getManagementRegimeRecords = useEffect(() => {
    let isMounted = true

    databaseSwitchboardInstance
      .getManagementRegimeRecordsForUiDisplay()
      .then((records) => {
        if (isMounted) {
          setManagementRegimeRecordsForUiDisplay(records)
          setIsLoading(false)
        }
      })
      .catch(() => {
        toast.error(language.error.collectRecordsUnavailable)
      })

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance])

  const currentProjectPath = useCurrentProjectPath()
  const getIconCheckLabel = (property) => property && <IconCheck />

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Year Est.',
        accessor: 'estYear',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Compliance',
        accessor: 'compliance',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Open Access',
        accessor: 'openAccess',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Access Restrictions',
        accessor: 'accessRestriction',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Periodic Closure',
        accessor: 'periodicClosure',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Size Limits',
        accessor: 'sizeLimits',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Gear Restrictions',
        accessor: 'gearRestriction',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Species Restrictions',
        accessor: 'speciesRestriction',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'No Take',
        accessor: 'noTake',
        sortType: reactTableNaturalSort,
      },
    ],
    [],
  )

  const tableCellData = useMemo(
    () =>
      managementRegimeRecordsForUiDisplay.map(({ id, uiLabels }) => ({
        name: (
          <Link to={`${currentProjectPath}/management-regimes/${id}`}>
            {uiLabels.name}
          </Link>
        ),
        estYear: uiLabels.estYear,
        compliance: uiLabels.compliance,
        openAccess: getIconCheckLabel(uiLabels.openAccess),
        accessRestriction: getIconCheckLabel(uiLabels.accessRestriction),
        periodicClosure: getIconCheckLabel(uiLabels.periodicClosure),
        sizeLimits: getIconCheckLabel(uiLabels.sizeLimits),
        gearRestriction: getIconCheckLabel(uiLabels.gearRestriction),
        speciesRestriction: getIconCheckLabel(uiLabels.speciesRestriction),
        noTake: getIconCheckLabel(uiLabels.noTake),
      })),
    [managementRegimeRecordsForUiDisplay, currentProjectPath],
  )

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.name.props.children', 'values.estYear']

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
                        <InnerCell>{cell.render('Cell')}</InnerCell>
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
          <H2>Management Regimes</H2>
          <RowBottom>
            <FilterSearchToolbar
              name={language.pages.managementRegimeTable.filterToolbarText}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />
            <ToolbarButtonWrapper>
              <ButtonSecondary>
                <IconPlus /> New MR
              </ButtonSecondary>
              <ButtonSecondary>
                <IconCopy /> Copy MRs from other projects
              </ButtonSecondary>
              <ButtonSecondary>
                <IconDownload /> Export MRs
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

export default ManagementRegimes
