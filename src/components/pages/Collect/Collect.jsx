import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Tr,
  Th,
  Td,
  TableNavigation,
  GenericStickyTable,
  StickyTableOverflowWrapper,
} from '../../generic/Table/table'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
  reactTableNaturalSortDates,
} from '../../generic/Table/reactTableNaturalSort'
import { ContentPageLayout } from '../../Layout'
import { H2 } from '../../generic/text'
import { ToolBarItemsRow, FilterItems } from '../../generic/positioning'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import AddSampleUnitButton from './AddSampleUnitButton'
import MethodsFilterDropDown from '../../MethodsFilterDropDown/MethodsFilterDropDown'
import FilterIndicatorPill from '../../generic/FilterIndicatorPill/FilterIndicatorPill'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import { getToastArguments } from '../../../library/getToastArguments'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import useDocumentTitle from '../../../library/useDocumentTitle'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import useIsMounted from '../../../library/useIsMounted'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import PageUnavailable from '../PageUnavailable'
import {
  getIsQuadratSampleUnit,
  noLabelSymbol,
} from '../../../App/mermaidData/recordProtocolHelpers'
import { getIsUserReadOnlyForProject } from '../../../App/currentUserProfileHelpers'
import { PAGE_SIZE_DEFAULT } from '../../../library/constants/constants'
import { TrCollectRecordStatus } from './Collect.styles'
import { getIsEmptyStringOrWhitespace } from '../../../library/getIsEmptyStringOrWhitespace'

const Collect = () => {
  const { t } = useTranslation()
  const [collectRecordsForUiDisplay, setCollectRecordsForUiDisplay] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const { currentUser } = useCurrentUser()
  const isMounted = useIsMounted()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, projectId)
  const [methodsFilteredTableCellData, setMethodsFilteredTableCellData] = useState([])
  const [methodsFilter, setMethodsFilter] = useState([])
  const isMethodFilterInitializedWithPersistedTablePreferences = useRef(false)
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)

  const collectTitle = t('sample_units.collecting')
  const methodText = t('sample_units.method')
  const siteText = t('sites.site')
  const managementRegimeText = t('management_regimes.management_regime')
  const sampleUnitNumberText = t('sample_units.sample_unit_number')
  const sizeText = t('sample_units.size')
  const depthText = t('sample_units.depth_m')
  const sampleDateText = t('sample_units.sample_date')
  const observersText = t('sample_units.observers')
  const statusText = t('sample_units.status')
  const collectRecordsUnavailableText = t('sample_units.errors.data_unavailable')

  useDocumentTitle(`${collectTitle} - ${t('mermaid')}`)

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
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(collectRecordsUnavailableText))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    projectId,
    isSyncInProgress,
    isMounted,
    handleHttpResponseError,
    collectRecordsUnavailableText,
  ])

  const currentProjectPath = useCurrentProjectPath()

  const tableColumns = useMemo(
    () => [
      {
        Header: methodText,
        accessor: 'method',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: siteText,
        accessor: 'site',
        sortType: reactTableNaturalSort,
      },
      {
        Header: managementRegimeText,
        accessor: 'management',
        sortType: reactTableNaturalSort,
      },
      {
        Header: sampleUnitNumberText,
        accessor: 'sampleUnitNumber',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: sizeText,
        accessor: 'size',
        align: 'right',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: depthText,
        accessor: 'depth',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: sampleDateText,
        accessor: 'sampleDate',
        sortType: reactTableNaturalSortDates,
      },
      {
        Header: observersText,
        accessor: 'observers',
        sortType: reactTableNaturalSort,
      },
      {
        Header: statusText,
        accessor: 'status',
        sortType: reactTableNaturalSort,
      },
    ],
    [
      methodText,
      siteText,
      managementRegimeText,
      sampleUnitNumberText,
      sizeText,
      depthText,
      sampleDateText,
      observersText,
      statusText,
    ],
  )

  const tableCellData = useMemo(
    () =>
      collectRecordsForUiDisplay.map(({ id, data, uiLabels }) => {
        const isQuadratSampleUnit = getIsQuadratSampleUnit(data.protocol)

        return {
          method: (
            <Link to={`${currentProjectPath}/collecting/${data.protocol}/${id}`}>
              {uiLabels.protocol}
            </Link>
          ),
          site: uiLabels.site,
          management: uiLabels.management,
          sampleUnitNumber: uiLabels.sampleUnitNumber,
          size: (
            <>
              {uiLabels.size}{' '}
              {isQuadratSampleUnit && uiLabels.size !== noLabelSymbol && <sup>2</sup>}
            </>
          ),
          depth: uiLabels.depth,
          sampleDate: uiLabels.sampleDate,
          observers: uiLabels.observers,
          status: uiLabels.status,
        }
      }),
    [collectRecordsForUiDisplay, currentProjectPath],
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
          id: 'site',
        },
        {
          id: 'method',
        },
        {
          id: 'sampleDate',
        },
        {
          id: 'sampleUnitNumber',
        },
      ],
      globalFilter: '',
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser.id}-collectTable`,
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
    setGlobalFilter,
    state: { pageIndex, pageSize, sortBy, globalFilter },
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
  const handleRowsNumberChange = (e) => {
    setPageSize(Number(e.target.value))
  }

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const handleMethodsColumnFilterChange = (filters) => {
    if (filters.length && collectRecordsForUiDisplay.length) {
      setMethodsFilter(filters)
      applyMethodsTableFilters(tableCellData, filters)
    } else {
      setMethodsFilter([])
    }
  }

  const clearFilters = () => {
    setMethodsFilter([])
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: '' })
    handleGlobalFilterChange('')
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

  const table = collectRecordsForUiDisplay.length ? (
    <>
      <StickyTableOverflowWrapper>
        <GenericStickyTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const isMultiSortColumn = headerGroup.headers.some((header) => header.sortedIndex > 0)
              const headerProps = headerGroup.getHeaderGroupProps()
              return (
                <Tr {...headerProps} key={headerProps.key}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <Th
                        {...column.getHeaderProps(getTableColumnHeaderProps(column))}
                        key={column.id}
                        isSortedDescending={column.isSortedDesc}
                        sortedIndex={column.sortedIndex}
                        isMultiSortColumn={isMultiSortColumn}
                        data-testid={`collecting-header-${column.id}`}
                      >
                        <span>{column.render('Header')}</span>
                      </Th>
                    )
                  })}
                </Tr>
              )
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)

              return (
                <TrCollectRecordStatus
                  {...row.getRowProps()}
                  key={row.id}
                  $recordStatusLabel={row.values.status}
                >
                  {row.cells.map((cell) => {
                    const isCellEmpty =
                      cell.value === undefined ||
                      cell.value === null ||
                      getIsEmptyStringOrWhitespace(cell.value)

                    const cellContents = isCellEmpty ? '-' : cell.render('Cell')

                    return (
                      <Td {...cell.getCellProps()} align={cell.column.align} key={cell.column.id}>
                        {cellContents}
                      </Td>
                    )
                  })}
                </TrCollectRecordStatus>
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
          unfilteredRowLength={collectRecordsForUiDisplay.length}
          methodFilteredRowLength={methodsFilteredTableCellData.length}
          searchFilteredRowLength={searchFilteredRowsLength}
          isSearchFilterEnabled={!!globalFilter?.length}
          isMethodFilterEnabled={!!methodsFilter?.length}
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
    <PageUnavailable mainText={t('sample_units.no_active_access')} />
  )

  const contentViewByRole = isReadOnlyUser ? (
    <PageUnavailable mainText={t('page.read_only')} />
  ) : (
    table
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
          <H2 data-testid="collecting-title">{collectTitle}</H2>
          {!isReadOnlyUser && (
            <ToolBarItemsRow>
              <FilterItems>
                <FilterSearchToolbar
                  name={t('filters.by_site_management_observer')}
                  disabled={collectRecordsForUiDisplay.length === 0}
                  globalSearchText={globalFilter}
                  handleGlobalFilterChange={handleGlobalFilterChange}
                />
                <MethodsFilterDropDown
                  value={tableUserPrefs.methodsFilter}
                  handleMethodsColumnFilterChange={handleMethodsColumnFilterChange}
                  disabled={collectRecordsForUiDisplay.length === 0}
                />
                {globalFilter?.length || methodsFilter?.length ? (
                  <FilterIndicatorPill
                    unfilteredRowLength={collectRecordsForUiDisplay.length}
                    methodFilteredRowLength={methodsFilteredTableCellData.length}
                    searchFilteredRowLength={searchFilteredRowsLength}
                    isSearchFilterEnabled={!!globalFilter?.length}
                    isMethodFilterEnabled={!!methodsFilter?.length}
                    clearFilters={clearFilters}
                  />
                ) : null}
              </FilterItems>
              <AddSampleUnitButton />
            </ToolBarItemsRow>
          )}
        </>
      }
      content={contentViewByRole}
      isPageContentLoading={isLoading}
      maxWidth="960px"
    />
  )
}

export default Collect
