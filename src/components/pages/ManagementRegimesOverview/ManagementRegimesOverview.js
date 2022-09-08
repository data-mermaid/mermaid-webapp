import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { toast } from 'react-toastify'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { useParams } from 'react-router-dom'

import { ContentPageLayout } from '../../Layout'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import { H2 } from '../../generic/text'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import language from '../../../language'
import PageNoData from '../PageNoData'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../library/getToastArguments'
import SampleUnitLinks from '../../SampleUnitLinks'
import { sortArrayByObjectKey } from '../../../library/arrays/sortArrayByObjectKey'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import {
  Tr,
  Th,
  Td,
  TableNavigation,
  HeaderCenter,
  StickyTableOverflowWrapper,
  StickyTable,
} from '../../generic/Table/table'
import { ToolBarRow } from '../../generic/positioning'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import useIsMounted from '../../../library/useIsMounted'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'

const ManagementOverviewHeaderRow = styled(Tr)`
  th.management-regime-numbers {
    background: hsl(235, 10%, 85%);
    &:after {
      display: none;
    }
  }
`

const ManagementOverviewRow = styled(Tr)`
  &:nth-child(odd) {
    background: hsl(0, 0%, 100%);
    td.management-regime-numbers {
      background: hsl(0, 0%, 90%);
    }
  }
  &:nth-child(even) {
    background: hsl(235, 10%, 95%);
    td.management-regime-numbers {
      background: hsl(235, 10%, 85%);
    }
  }
`

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
        Header: () => '',
        id: 'site',
        columns: [{ Header: 'Site', accessor: 'site', sortType: reactTableNaturalSort }],
        disableSortBy: true,
      },
      {
        Header: () => '',
        id: 'method',
        columns: [{ Header: 'Method', accessor: 'method', sortType: reactTableNaturalSort }],
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
          accumulator[record.id] = rowRecordManagementRegimesWithoutNonEmptyValues[record.id] || '-'

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
      <StickyTableOverflowWrapper>
        <StickyTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <ManagementOverviewHeaderRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const isMultiSortColumn = headerGroup.headers.some(
                    (header) => header.sortedIndex > 0,
                  )
                  const ThClassName = column.parent ? column.parent.id : undefined

                  const headerAlignment =
                    column.Header === 'Site' || column.Header === 'Method' ? 'left' : 'right'

                  return (
                    <Th
                      {...column.getHeaderProps(getTableColumnHeaderProps(column))}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                      isMultiSortColumn={isMultiSortColumn}
                      isSortingEnabled={!column.disableSortBy}
                      disabledHover={column.disableSortBy}
                      align={headerAlignment}
                      className={ThClassName}
                    >
                      {column.render('Header')}
                    </Th>
                  )
                })}
              </ManagementOverviewHeaderRow>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              const managementRegimesRowCells = row.cells.filter(
                (cell) => cell.column.Header !== 'Site' && cell.column.Header !== 'Method',
              )
              const managementRegimesRowCellsWithNonEmptyValue = managementRegimesRowCells.filter(
                (cell) => cell.value !== '-',
              )

              const managementRegimeRowCellValues = managementRegimesRowCellsWithNonEmptyValue.map(
                (cell) => cell.value.props.sampleUnitNumbersRow.length,
              )

              const maxSampleUnitCount = Math.max(...managementRegimeRowCellValues)

              const isEqualToMaxSampleUnitCount = (currentValue) =>
                currentValue === maxSampleUnitCount

              const isEveryMRLabelsSameAsMax =
                managementRegimeRowCellValues.length > 1 &&
                managementRegimeRowCellValues.every(isEqualToMaxSampleUnitCount)

              return (
                <ManagementOverviewRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    const cellColumnId = cell.column.id

                    const managementRegimeCellNonEmpty =
                      cell.value !== '-' && !(cellColumnId === 'site' || cellColumnId === 'method')

                    const isCellValueLessThanMaxSampleUnitCount =
                      managementRegimeCellNonEmpty &&
                      cell.value.props.sampleUnitNumbersRow.length < maxSampleUnitCount

                    const isCellValueEqualToMaxSampleUnitCount =
                      managementRegimeCellNonEmpty &&
                      cell.value.props.sampleUnitNumbersRow.length === maxSampleUnitCount

                    const isManagementRegimeCellHighlighted = isEveryMRLabelsSameAsMax
                      ? isCellValueEqualToMaxSampleUnitCount
                      : isCellValueLessThanMaxSampleUnitCount

                    const HighlightedClassName = isManagementRegimeCellHighlighted
                      ? 'highlighted'
                      : undefined

                    const cellAlignment =
                      cell.column.parent.id === 'site' || cell.column.parent.id === 'method'
                        ? 'left'
                        : 'right'

                    return (
                      <Td
                        {...cell.getCellProps()}
                        align={cellAlignment}
                        className={`${cell.column.parent.id} ${HighlightedClassName}`}
                      >
                        <span>{cell.render('Cell')}</span>
                      </Td>
                    )
                  })}
                </ManagementOverviewRow>
              )
            })}
          </tbody>
        </StickyTable>
      </StickyTableOverflowWrapper>
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

  const content = isAppOnline ? (
    table
  ) : (
    <PageNoData mainText={language.error.pageUnavailableOffline} />
  )
  const toolbar = (
    <>
      <H2>{language.pages.managementRegimesOverview.title}</H2>
      {isAppOnline && (
        <ToolBarRow>
          <FilterSearchToolbar
            name={language.pages.usersAndTransectsTable.filterToolbarText}
            value={tableUserPrefs.globalFilter}
            handleGlobalFilterChange={handleGlobalFilterChange}
          />
        </ToolBarRow>
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
