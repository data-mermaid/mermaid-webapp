import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { Table, Tr, Th, Td, TableOverflowWrapper, TableNavigation } from '../../generic/Table/table'
import { ContentPageLayout } from '../../Layout'
import { H2 } from '../../generic/text'
import { IconCheck, IconPlus, IconCopy, IconDownload } from '../../icons'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import { ToolBarRow } from '../../generic/positioning'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import { ToolbarButtonWrapper, ButtonSecondary } from '../../generic/buttons'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import useDocumentTitle from '../../../library/useDocumentTitle'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import usePrevious from '../../../library/usePrevious'
import useIsMounted from '../../../library/useIsMounted'
import PageNoData from '../PageNoData'

const ManagementRegimes = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [managementRegimeRecordsForUiDisplay, setManagementRegimeRecordsForUiDisplay] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const currentUser = useCurrentUser()

  useDocumentTitle(`${language.pages.managementRegimeTable.title} - ${language.title.mermaid}`)

  const _getManagementRegimeRecords = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getManagementRegimeRecordsForUiDisplay(projectId),
        databaseSwitchboardInstance.getProject(projectId),
      ])
        .then(([managementRegimes, projectResponse]) => {
          if (isMounted.current) {
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }
            setManagementRegimeRecordsForUiDisplay(managementRegimes)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.managementRegimeRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted])

  const currentProjectPath = useCurrentProjectPath()
  const getIconCheckLabel = (property) => property && <IconCheck />

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Management Regime Name',
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
        name: <Link to={`${currentProjectPath}/management-regimes/${id}`}>{uiLabels.name}</Link>,
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

  const tableDefaultPrefs = useMemo(() => {
    return {
      sortBy: [
        {
          id: 'name',
          desc: false,
        },
      ],
      globalFilter: ""
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences(`${currentUser.id}-managementRegimesTable`, tableDefaultPrefs)

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.name.props.children', 'values.estYear']

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
    state: { pageIndex, pageSize, sortBy, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: {
        pageSize: 15,
        sortBy: tableUserPrefs.sortBy,
        globalFilter: tableUserPrefs.globalFilter
      },
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

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs('sortBy', sortBy)
  }, [sortBy, handleSetTableUserPrefs])

  const _setFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs('globalFilter', globalFilter)
  }, [globalFilter, handleSetTableUserPrefs])

  const table = managementRegimeRecordsForUiDisplay.length ? (
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
  ) : (
    <PageNoData
      mainText={language.pages.managementRegimeTable.noDataText}
      subText={language.pages.managementRegimeTable.noDataExtraText}
    />
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
          <H2>{language.pages.managementRegimeTable.title}</H2>
          <ToolBarRow>
            <FilterSearchToolbar
              name={language.pages.managementRegimeTable.filterToolbarText}
              value={tableUserPrefs.globalFilter}
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
          </ToolBarRow>
        </>
      }
      content={table}
      isPageContentLoading={isLoading}
    />
  )
}

export default ManagementRegimes
