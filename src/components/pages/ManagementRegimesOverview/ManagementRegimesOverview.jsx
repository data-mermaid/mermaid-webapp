import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { toast } from 'react-toastify'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { useParams } from 'react-router-dom'

import { ContentPageLayout } from '../../Layout'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import { H2 } from '../../generic/text'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import language from '../../../language'
import PageUnavailable from '../PageUnavailable'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../library/getToastArguments'
import SampleUnitLinks from '../../SampleUnitLinks'
import { sortArrayByObjectKey } from '../../../library/arrays/sortArrayByObjectKey'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import {
  OverviewTd,
  TableNavigation,
  HeaderCenter,
  Tr,
  StickyTableOverflowWrapper,
  StickyOverviewTable,
  OverviewTr,
  OverviewTh,
  OverviewThead,
} from '../../generic/Table/table'
import { FilterItems, ToolBarItemsRow } from '../../generic/positioning'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import useIsMounted from '../../../library/useIsMounted'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import { PAGE_SIZE_DEFAULT } from '../../../library/constants/constants'
import MethodsFilterDropDown from '../../MethodsFilterDropDown/MethodsFilterDropDown'
import FilterIndicatorPill from '../../generic/FilterIndicatorPill/FilterIndicatorPill'
import useDocumentTitle from '../../../library/useDocumentTitle'
import { getIsEmptyStringOrWhitespace } from '../../../library/getIsEmptyStringOrWhitespace'

const groupManagementRegimes = (records) => {
  return records.reduce((accumulator, record) => {
    const { management_regimes } = record

    for (const managementRegime of management_regimes) {
      accumulator[managementRegime.mr_id] = accumulator[managementRegime.mr_id] || {}
      accumulator[managementRegime.mr_id] = {
        id: managementRegime.mr_id,
        name: managementRegime.mr_name,
      }
    }

    return accumulator
  }, {})
}

const ManagementRegimesOverview = () => {
  const { isAppOnline } = useOnlineStatus()
  const [isLoading, setIsLoading] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const [sampleUnitWithManagementRegimeRecords, setSampleUnitWithManagementRegimeRecords] =
    useState([])
  const [managementRegimeRecordNames, setManagementRegimeRecordNames] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const { currentUser } = useCurrentUser()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const [methodsFilteredTableCellData, setMethodsFilteredTableCellData] = useState([])
  const [methodsFilter, setMethodsFilter] = useState([])
  const isMethodFilterInitializedWithPersistedTablePreferences = useRef(false)
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)

  useDocumentTitle(`${language.pages.managementRegimesOverview.title} - ${language.title.mermaid}`)

  const _getSupportingData = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getRecordsForManagementRegimesOverviewTable(projectId)
        .then((sampleUnitWithManagementRegimeRecordsResponse) => {
          const uniqueManagementRegimes = groupManagementRegimes(
            sampleUnitWithManagementRegimeRecordsResponse,
          )
          const uniqueManagementRegimeNamesAscending = sortArrayByObjectKey(
            Object.values(uniqueManagementRegimes),
            'name',
          )

          setSampleUnitWithManagementRegimeRecords(sampleUnitWithManagementRegimeRecordsResponse)
          setManagementRegimeRecordNames(uniqueManagementRegimeNamesAscending)
          setIsLoading(false)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              const errorStatus = error.response?.status

              if ((errorStatus === 404 || errorStatus === 400) && isMounted.current) {
                setIdsNotAssociatedWithData([projectId])
                setIsLoading(false)
              }

              toast.error(...getToastArguments(language.error.projectHealthRecordsUnavailable))
            },
          })
        })
    }
  }, [databaseSwitchboardInstance, projectId, isMounted, isAppOnline, handleHttpResponseError])

  const getManagementRegimeTransectNumberColumnHeaders = useMemo(() => {
    return managementRegimeRecordNames.map((mr) => {
      return {
        Header: mr.name,
        accessor: mr.id,
        disableSortBy: true,
      }
    })
  }, [managementRegimeRecordNames])

  const tableColumns = useMemo(
    () => [
      {
        Header: () => <HeaderCenter>&nbsp;</HeaderCenter>,
        id: 'site',
        columns: [{ Header: 'Site', accessor: 'site', sortType: reactTableNaturalSort }],
        disableSortBy: true,
      },
      {
        Header: () => <HeaderCenter>&nbsp;</HeaderCenter>,
        id: 'method',
        columns: [{ Header: 'Method', accessor: 'method', sortType: reactTableNaturalSort }],
        disableSortBy: true,
      },
      {
        Header: () => '',
        id: 'first-transect-header',
        columns: [{ Header: '', accessor: 'firstTransectHeader', disableSortBy: true }],
        disableSortBy: true,
      },
      {
        Header: () => <HeaderCenter>Transect Number / Management Regime</HeaderCenter>,
        id: 'management-regime-numbers',
        columns: getManagementRegimeTransectNumberColumnHeaders,
        disableSortBy: true,
      },
    ],
    [getManagementRegimeTransectNumberColumnHeaders],
  )

  const populateSampleUnitNumbersByManagementRegimeRow = useCallback(
    (rowRecord) => {
      const { management_regimes } = rowRecord

      const rowRecordManagementRegimesWithoutNonEmptyValues = management_regimes.reduce(
        (accumulator, record) => {
          accumulator[record.mr_id] = (
            <SampleUnitLinks rowRecord={rowRecord} sampleUnitNumbersRow={record.labels} />
          )

          return accumulator
        },
        {},
      )

      const rowRecordManagementRegimes = managementRegimeRecordNames.reduce(
        (accumulator, record) => {
          accumulator[record.id] = rowRecordManagementRegimesWithoutNonEmptyValues[record.id] || ''

          return accumulator
        },
        {},
      )

      return rowRecordManagementRegimes
    },
    [managementRegimeRecordNames],
  )

  const tableCellData = useMemo(
    () =>
      sampleUnitWithManagementRegimeRecords.map((record) => ({
        site: record.site_name,
        method: record.sample_unit_method,
        ...populateSampleUnitNumbersByManagementRegimeRow(record),
      })),
    [sampleUnitWithManagementRegimeRecords, populateSampleUnitNumbersByManagementRegimeRow],
  )

  const applyMethodsTableFilters = useCallback((rows, filterValue) => {
    const filteredRows = rows?.filter((row) => filterValue.includes(row.method))

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
          desc: false,
        },
      ],
      globalFilter: '',
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser.id}-managementRegimesOverviewTable`,
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
    const keys = ['values.site']

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
      isMultiSortEvent: () => true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => setPageSize(Number(e.target.value))

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const handleMethodsColumnFilterChange = (filters) => {
    if (filters.length && sampleUnitWithManagementRegimeRecords.length) {
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

  const table = sampleUnitWithManagementRegimeRecords.length ? (
    <>
      <StickyTableOverflowWrapper>
        <StickyOverviewTable {...getTableProps()}>
          <OverviewThead>
            {headerGroups.map((headerGroup) => (
              <Tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const isMultiSortColumn = headerGroup.headers.some(
                    (header) => header.sortedIndex > 0,
                  )
                  const ThClassName = column.parent ? column.parent.id : undefined

                  const headerAlignment =
                    column.Header === 'Site' || column.Header === 'Method' ? 'left' : 'right'

                  return (
                    <OverviewTh
                      {...column.getHeaderProps(getTableColumnHeaderProps(column))}
                      key={column.id}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                      isMultiSortColumn={isMultiSortColumn}
                      isSortingEnabled={!column.disableSortBy}
                      disabledHover={column.disableSortBy}
                      align={headerAlignment}
                      className={ThClassName}
                    >
                      <span> {column.render('Header')}</span>
                    </OverviewTh>
                  )
                })}
              </Tr>
            ))}
          </OverviewThead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              const mrTransectNumberRowCells = row.cells.filter((cell) => {
                return (
                  cell.column.id !== 'site' &&
                  cell.column.id !== 'method' &&
                  cell.column.id !== 'firstTransectHeader'
                )
              })
              const mrTransectNumberRowCellsWithNonEmptyValue = mrTransectNumberRowCells.filter(
                (cell) =>
                  cell.value !== undefined &&
                  cell.value !== null &&
                  !getIsEmptyStringOrWhitespace(cell.value),
              )

              const mrTransectNumberRowCellValues = mrTransectNumberRowCellsWithNonEmptyValue?.map(
                (cell) => cell?.value?.props?.sampleUnitNumbersRow?.length,
              )

              const maxSampleUnitCount = Math.max(...mrTransectNumberRowCellValues)

              const isEqualToMaxSampleUnitCount = (currentValue) =>
                currentValue === maxSampleUnitCount

              const isEveryMRLabelsSameAsMax =
                mrTransectNumberRowCellValues.length > 1 &&
                mrTransectNumberRowCellValues.every(isEqualToMaxSampleUnitCount)

              return (
                <OverviewTr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    const cellColumnGroupId = cell.column.parent.id

                    const areSiteOrMethodOrEmptyHeaderColumns =
                      cellColumnGroupId === 'site' ||
                      cellColumnGroupId === 'method' ||
                      cellColumnGroupId === 'first-transect-header'

                    const managementRegimeCellNonEmpty =
                      cell.value !== undefined &&
                      cell.value !== null &&
                      !getIsEmptyStringOrWhitespace(cell.value) &&
                      !areSiteOrMethodOrEmptyHeaderColumns

                    const isCellValueLessThanMaxSampleUnitCount =
                      managementRegimeCellNonEmpty &&
                      cell?.value?.props?.sampleUnitNumbersRow.length < maxSampleUnitCount

                    const isCellValueEqualToMaxSampleUnitCount =
                      managementRegimeCellNonEmpty &&
                      cell?.value?.props?.sampleUnitNumbersRow.length === maxSampleUnitCount

                    const isManagementRegimeCellHighlighted = isEveryMRLabelsSameAsMax
                      ? isCellValueEqualToMaxSampleUnitCount
                      : isCellValueLessThanMaxSampleUnitCount

                    const cellAlignment = areSiteOrMethodOrEmptyHeaderColumns ? 'left' : 'right'

                    const cellClassName = isManagementRegimeCellHighlighted
                      ? `${cellColumnGroupId} highlighted`
                      : cellColumnGroupId

                    return (
                      <OverviewTd
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        align={cellAlignment}
                        className={cellClassName}
                      >
                        <span>{cell.render('Cell')}</span>
                      </OverviewTd>
                    )
                  })}
                </OverviewTr>
              )
            })}
          </tbody>
        </StickyOverviewTable>
      </StickyTableOverflowWrapper>
      <TableNavigation>
        <PageSizeSelector
          onChange={handleRowsNumberChange}
          pageSize={pageSize}
          pageSizeOptions={[15, 50, 100]}
          pageType="record"
          unfilteredRowLength={sampleUnitWithManagementRegimeRecords.length}
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
    <PageUnavailable
      mainText={language.pages.managementRegimesOverview.noDataMainText}
      subText={language.pages.managementRegimesOverview.noDataSubText}
    />
  )

  const content = isAppOnline ? (
    table
  ) : (
    <PageUnavailable mainText={language.error.pageUnavailableOffline} />
  )
  const toolbar = (
    <>
      <H2>{language.pages.managementRegimesOverview.title}</H2>
      {isAppOnline && (
        <ToolBarItemsRow>
          <FilterItems>
            <FilterSearchToolbar
              name={language.pages.usersAndTransectsTable.filterToolbarText}
              disabled={sampleUnitWithManagementRegimeRecords.length === 0}
              globalSearchText={globalFilter}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />
            <MethodsFilterDropDown
              value={tableUserPrefs.methodsFilter}
              handleMethodsColumnFilterChange={handleMethodsColumnFilterChange}
              disabled={sampleUnitWithManagementRegimeRecords.length === 0}
            />
            {globalFilter?.length || methodsFilter?.length ? (
              <FilterIndicatorPill
                unfilteredRowLength={sampleUnitWithManagementRegimeRecords.length}
                methodFilteredRowLength={methodsFilteredTableCellData.length}
                searchFilteredRowLength={searchFilteredRowsLength}
                isSearchFilterEnabled={!!globalFilter?.length}
                isMethodFilterEnabled={!!methodsFilter?.length}
                clearFilters={clearFilters}
              />
            ) : null}
          </FilterItems>
        </ToolBarItemsRow>
      )}
    </>
  )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout isPageContentLoading={isLoading} content={content} toolbar={toolbar} />
  )
}

export default ManagementRegimesOverview
