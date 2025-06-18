import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'

import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { ContentPageLayout } from '../../Layout'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import {
  GenericStickyTable,
  Tr,
  Th,
  Td,
  TableNavigation,
  StickyTableOverflowWrapper,
} from '../../generic/Table/table'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
  reactTableNaturalSortDates,
} from '../../generic/Table/reactTableNaturalSort'
import { H2 } from '../../generic/text'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import SubmittedToolbarSection from './SubmittedToolbarSection'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import PageUnavailable from '../PageUnavailable'
import { PAGE_SIZE_DEFAULT } from '../../../library/constants/constants'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'

const Submitted = () => {
  const [submittedRecordsForUiDisplay, setSubmittedRecordsForUiDisplay] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const { currentUser } = useCurrentUser()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const [methodsFilteredTableCellData, setMethodsFilteredTableCellData] = useState([])
  const [methodsFilter, setMethodsFilter] = useState([])
  const isMethodFilterInitializedWithPersistedTablePreferences = useRef(false)
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)

  useDocumentTitle(`${language.pages.submittedTable.title} - ${language.title.mermaid}`)

  const _getSubmittedRecords = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getSubmittedRecordsForUIDisplay(projectId)
        .then((records) => {
          if (isMounted.current) {
            setSubmittedRecordsForUiDisplay(records)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          const errorStatus = error.response?.status

          if ((errorStatus === 404 || errorStatus === 400) && isMounted.current) {
            setIdsNotAssociatedWithData([projectId])
            setIsLoading(false)
          }

          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.submittedRecordsUnavailable))
            },
          })
        })
    }
  }, [databaseSwitchboardInstance, projectId, isMounted, isAppOnline, handleHttpResponseError])
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
        Header: 'Management Regime',
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
          <Link to={`${currentProjectPath}/submitted/${protocol}/${id}`}>{uiLabels.protocol}</Link>
        ),
        site: uiLabels.site,
        management: uiLabels.management,
        sampleUnitNumber: uiLabels.sampleUnitNumber,
        size: uiLabels.size,
        depth: uiLabels.depth,
        sampleDate: uiLabels.sampleDate,
        observers: uiLabels.observers,
      })),
    [submittedRecordsForUiDisplay, currentProjectPath],
  )

  const applyMethodsTableFilters = useCallback((rows, filterValue) => {
    const filteredRows = rows?.filter((row) => filterValue.includes(row.method.props.children))

    setMethodsFilteredTableCellData(filteredRows)
  }, [])

  const _applyMethodsFilterOnLoad = useEffect(() => {
    if (methodsFilter.length) {
      applyMethodsTableFilters(tableCellData, methodsFilter)
    }
  }, [methodsFilter, tableCellData, applyMethodsTableFilters])

  const tableDefaultPrefs = useMemo(() => {
    return {
      sortBy: [
        {
          id: 'method',
          desc: false,
        },
      ],
      globalFilter: '',
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser.id}-dataSubmittedTable`,
    defaultValue: tableDefaultPrefs,
  })

  useEffect(
    function initializeMethodFilterWithPersistedTablePreferences() {
      if (
        !isMethodFilterInitializedWithPersistedTablePreferences.current &&
        tableUserPrefs?.methodsFilter
      ) {
        setMethodsFilter(tableUserPrefs.methodsFilter)
        isMethodFilterInitializedWithPersistedTablePreferences.current = true
      }
    },
    [tableUserPrefs],
  )

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.site', 'values.management', 'values.observers']

    const queryTerms = splitSearchQueryStrings(query)

    if (!queryTerms || !queryTerms.length) {
      return rows
    }

    const tableFilteredRows = getTableFilteredRows(rows, keys, queryTerms)

    setSearchFilteredRowsLength(tableFilteredRows.length)

    return tableFilteredRows
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
      data: methodsFilter.length ? methodsFilteredTableCellData : tableCellData,
      initialState: {
        pageSize: tableUserPrefs.pageSize ? tableUserPrefs.pageSize : PAGE_SIZE_DEFAULT,
        sortBy: tableUserPrefs.sortBy,
        globalFilter: tableUserPrefs.globalFilter,
      },
      globalFilter: tableGlobalFilters,
      // Disables requirement to hold shift to enable multi-sort
      isMultiSortEvent: () => true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => setPageSize(Number(e.target.value))

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const handleMethodsColumnFilterChange = (filters) => {
    if (filters.length && submittedRecordsForUiDisplay.length) {
      setMethodsFilter(filters)
      applyMethodsTableFilters(tableCellData, filters)
    } else {
      setMethodsFilter([])
    }
  }

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const _setFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: globalFilter })
  }, [globalFilter, handleSetTableUserPrefs])

  const _setPageSizePrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'pageSize', currentValue: pageSize })
  }, [pageSize, handleSetTableUserPrefs])

  const _setMethodsFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'methodsFilter', currentValue: methodsFilter })
  }, [methodsFilter, handleSetTableUserPrefs])

  const table = submittedRecordsForUiDisplay.length ? (
    <>
      <StickyTableOverflowWrapper>
        <GenericStickyTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const isMultiSortColumn = headerGroup.headers.some((header) => header.sortedIndex > 0)

              return (
                <Tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps(getTableColumnHeaderProps(column))}
                      key={column.id}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                      isMultiSortColumn={isMultiSortColumn}
                    >
                      <span>{column.render('Header')}</span>
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
                <Tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td key={cell.column.id} {...cell.getCellProps()} align={cell.column.align}>
                        {cell.render('Cell')}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </tbody>
        </GenericStickyTable>
      </StickyTableOverflowWrapper>
      <TableNavigation>
        <PageSizeSelector
          onChange={handleRowsNumberChange}
          pageSize={pageSize}
          pageSizeOptions={[15, 50, 100]}
          pageType="sample unit"
          unfilteredRowLength={submittedRecordsForUiDisplay.length}
          methodFilteredRowLength={methodsFilteredTableCellData.length}
          searchFilteredRowLength={searchFilteredRowsLength}
          isSearchFilterEnabled={!!globalFilter?.length}
          isMethodFilterEnabled={!!methodsFilter.length}
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
    <PageUnavailable mainText={language.pages.submittedTable.noDataMainText} />
  )

  const content = isAppOnline ? (
    <>{table}</>
  ) : (
    <PageUnavailable mainText={language.error.pageUnavailableOffline} />
  )

  const toolbar = isAppOnline ? (
    <SubmittedToolbarSection
      name={language.pages.submittedTable.filterToolbarText}
      globalSearchText={globalFilter}
      handleGlobalFilterChange={handleGlobalFilterChange}
      searchFilterValue={tableUserPrefs.globalFilter}
      methodFilterValue={tableUserPrefs.methodsFilter}
      handleMethodsColumnFilterChange={handleMethodsColumnFilterChange}
      disabled={submittedRecordsForUiDisplay.length === 0}
      unfilteredRowLength={submittedRecordsForUiDisplay.length}
      methodFilteredRowLength={methodsFilteredTableCellData.length}
      searchFilteredRowLength={searchFilteredRowsLength}
      isSearchFilterEnabled={!!globalFilter?.length}
      isMethodFilterEnabled={!!methodsFilter?.length}
      setMethodsFilter={setMethodsFilter}
      handleSetTableUserPrefs={handleSetTableUserPrefs}
      submittedRecordsForUiDisplay={submittedRecordsForUiDisplay}
    />
  ) : (
    <H2>{language.pages.submittedTable.title}</H2>
  )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout content={content} toolbar={toolbar} isPageContentLoading={isLoading} />
  )
}

export default Submitted
