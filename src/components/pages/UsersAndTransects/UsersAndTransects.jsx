import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { toast } from 'react-toastify'

import { ContentPageLayout } from '../../Layout'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../library/getToastArguments'
import { H2 } from '../../generic/text'
import language from '../../../language'
import PageUnavailable from '../PageUnavailable'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import { sortArray } from '../../../library/arrays/sortArray'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import {
  TableNavigation,
  HeaderCenter,
  StickyTableOverflowWrapper,
  StickyOverviewTable,
  OverviewTh,
  OverviewThead,
  Tr,
  OverviewTr,
  OverviewTd,
} from '../../generic/Table/table'
import { FilterItems, ToolBarItemsRow } from '../../generic/positioning'
import theme from '../../../theme'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import useIsMounted from '../../../library/useIsMounted'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import { getSampleDateLabel } from '../../../App/mermaidData/getSampleDateLabel'
import SubmittedSampleUnitPopup from '../../SampleUnitPopups/SubmittedSampleUnitPopup'
import EmptySampleUnitPopup from '../../SampleUnitPopups/EmptySampleUnitPopup/EmptySampleUnitPopup'
import CollectSampleUnitPopup from '../../SampleUnitPopups/CollectSampleUnitPopup/CollectSampleUnitPopup'
import { PAGE_SIZE_DEFAULT } from '../../../library/constants/constants'
import MethodsFilterDropDown from '../../MethodsFilterDropDown/MethodsFilterDropDown'
import FilterIndicatorPill from '../../generic/FilterIndicatorPill/FilterIndicatorPill'
import useDocumentTitle from '../../../library/useDocumentTitle'
import { getIsEmptyStringOrWhitespace } from '../../../library/getIsEmptyStringOrWhitespace'

const EMPTY_TABLE_CELL_VALUE = '-'

const UserColumnHeader = styled.span`
  display: flex;
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
const checkDateAndGetSiteName = (name) => {
  const elementsInName = name.split(' ')
  const lastItemInName = elementsInName.pop()
  const isDateValid = moment(lastItemInName, 'YYYY-MM-DD', true).isValid()

  if (isDateValid) {
    return `${elementsInName.join(' ')} ${getSampleDateLabel(lastItemInName)}`
  }

  return name
}

const groupCollectSampleUnitsByProfileSummary = (records) => {
  return records.reduce((accumulator, record) => {
    const profileSummary = record.profile_summary

    for (const collectRecordProfile in profileSummary) {
      if (profileSummary[collectRecordProfile]) {
        const collectRecords = profileSummary[collectRecordProfile]?.collect_records

        // eslint-disable-next-line no-param-reassign
        accumulator[collectRecordProfile] = accumulator[collectRecordProfile] || {}

        accumulator[collectRecordProfile] = {
          profileId: collectRecordProfile,
          profileName: profileSummary[collectRecordProfile].profile_name,
          collectRecords: accumulator[collectRecordProfile].collectRecords
            ? accumulator[collectRecordProfile].collectRecords.concat(collectRecords)
            : [...collectRecords],
        }
      }
    }

    return accumulator
  }, {})
}

const UsersAndTransects = () => {
  const { isAppOnline } = useOnlineStatus()
  const [isLoading, setIsLoading] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const [submittedRecords, setSubmittedRecords] = useState([])
  const [submittedTransectNumbers, setSubmittedTransectNumbers] = useState([])
  const [collectRecordsByProfile, setCollectRecordsByProfile] = useState({})
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const { currentUser } = useCurrentUser()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const [methodsFilteredTableCellData, setMethodsFilteredTableCellData] = useState([])
  const [methodsFilter, setMethodsFilter] = useState([])
  const isMethodFilterInitializedWithPersistedTablePreferences = useRef(false)
  const [searchFilteredRows, setSearchFilteredRows] = useState([])

  useDocumentTitle(`${language.pages.usersAndTransectsTable.title} - ${language.title.mermaid}`)

  const _getSupportingData = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getRecordsForUsersAndTransectsTable(projectId)
        .then((sampleUnitRecordsResponse) => {
          if (isMounted.current) {
            if (!sampleUnitRecordsResponse && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }

            const sampleUnitTransectNumbers = sampleUnitRecordsResponse
              .reduce((acc, record) => acc.concat(record.sample_unit_numbers), [])
              .map((reducedRecords) => reducedRecords.label)

            const uniqueTransectNumbersAscending = sortArray([
              ...new Set(sampleUnitTransectNumbers),
            ])

            setCollectRecordsByProfile(
              groupCollectSampleUnitsByProfileSummary(sampleUnitRecordsResponse),
            )
            setSubmittedRecords(sampleUnitRecordsResponse)
            setSubmittedTransectNumbers(uniqueTransectNumbersAscending)
            setIsLoading(false)
          }
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

  const getUserColumnHeaders = useMemo(() => {
    const collectRecordsByProfileValues = Object.values(collectRecordsByProfile)

    return collectRecordsByProfileValues.map((user) => {
      return {
        Header: user.profileName,
        accessor: user.profileId,
        disableSortBy: true,
      }
    })
  }, [collectRecordsByProfile])

  const getSubmittedTransectNumberColumnHeaders = useMemo(() => {
    return submittedTransectNumbers.map((number) => {
      return {
        Header: number,
        accessor: number,
        disableSortBy: true,
      }
    })
  }, [submittedTransectNumbers])

  const tableColumns = useMemo(() => {
    const headers = [
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
        Header: () => <HeaderCenter>Submitted</HeaderCenter>,
        id: 'transect-numbers',
        columns: getSubmittedTransectNumberColumnHeaders,
        disableSortBy: true,
      },
      {
        Header: () => '',
        id: 'first-user-header',
        columns: [{ Header: '', accessor: 'firstUserHeader', disableSortBy: true }],
        disableSortBy: true,
      },
      {
        Header: () => <HeaderCenter>Collecting</HeaderCenter>,
        id: 'user-headers',
        columns: getUserColumnHeaders,
        disableSortBy: true,
      },
    ]

    if (getSubmittedTransectNumberColumnHeaders.length === 0) {
      // Remove first-transect-header column if transect number columns are empty
      headers.splice(2, 1)
    }

    if (getUserColumnHeaders.length === 0) {
      // Remove first-user-header column if user columns are empty
      headers.splice(-2, 1)
    }

    return headers
  }, [getUserColumnHeaders, getSubmittedTransectNumberColumnHeaders])

  const populateTransectNumberRow = useCallback(
    (rowRecord) => {
      const rowNumbers = rowRecord.sample_unit_numbers.map(({ label }) => label)

      const submittedTransectNumbersRow = submittedTransectNumbers.reduce((accumulator, number) => {
        if (!accumulator[number]) {
          // eslint-disable-next-line no-param-reassign
          accumulator[number] = EMPTY_TABLE_CELL_VALUE
        }

        if (rowNumbers.includes(number)) {
          const filteredRowSampleUnitNumbers = rowRecord.sample_unit_numbers.filter(
            ({ label }) => label === number,
          )
          // eslint-disable-next-line no-param-reassign
          accumulator[number] = (
            <SubmittedSampleUnitPopup
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
      const collectRecordsByProfileValues = Object.values(collectRecordsByProfile)

      const collectTransectNumbersRow = collectRecordsByProfileValues.reduce(
        (accumulator, record) => {
          // eslint-disable-next-line no-param-reassign
          accumulator[record.profileId] = rowRecord.profile_summary[record.profileId] ? (
            <CollectSampleUnitPopup
              rowRecord={rowRecord}
              recordProfileSummary={rowRecord.profile_summary[record.profileId]}
            />
          ) : (
            EMPTY_TABLE_CELL_VALUE
          )

          return accumulator
        },
        {},
      )

      return collectTransectNumbersRow
    },
    [collectRecordsByProfile],
  )

  const tableCellData = useMemo(
    () =>
      submittedRecords.map((record) => {
        const siteName = checkDateAndGetSiteName(record.site_name)

        return {
          site: siteName,
          method: record.sample_unit_method,
          ...populateTransectNumberRow(record),
          ...populateCollectNumberRow(record),
        }
      }),
    [submittedRecords, populateTransectNumberRow, populateCollectNumberRow],
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
    key: `${currentUser.id}-observersAndTransectsTable`,
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

    setSearchFilteredRows(tableFilteredRows)

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
    if (filters.length && submittedRecords.length) {
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

  const calcUserCollectRecordCount = (tableData, user) => {
    const userTableCellData = tableData.map((cellData) => cellData[user])

    return userTableCellData.reduce((accumulator, userCollectRecord) => {
      const collectRecordCount =
        userCollectRecord !== EMPTY_TABLE_CELL_VALUE
          ? userCollectRecord.props.recordProfileSummary.collect_records.length
          : 0

      return accumulator + collectRecordCount
    }, 0)
  }

  const getUserHeaderCount = useCallback(
    (user) => {
      const isSearchFilterEnabled = !!globalFilter?.length
      const isMethodFilterEnabled = !!methodsFilter.length

      if (isSearchFilterEnabled) {
        const searchFilteredTableCellData = searchFilteredRows.map((row) => row.values)

        return calcUserCollectRecordCount(searchFilteredTableCellData, user)
      }

      if (isMethodFilterEnabled) {
        return calcUserCollectRecordCount(methodsFilteredTableCellData, user)
      }

      return calcUserCollectRecordCount(tableCellData, user)
    },
    [globalFilter, methodsFilter, searchFilteredRows, methodsFilteredTableCellData, tableCellData],
  )

  const pageNoDataAvailable = (
    <>
      <h3>{language.pages.usersAndTransectsTable.noDataMainText}</h3>
      <p>{language.pages.usersAndTransectsTable.noDataSubTextTitle}</p>
      <ul>
        {language.pages.usersAndTransectsTable.noDataSubTexts.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </>
  )

  const table = submittedRecords.length ? (
    <>
      <StickyTableOverflowWrapper>
        <StickyOverviewTable {...getTableProps()}>
          <OverviewThead>
            {headerGroups.map((headerGroup) => {
              const headerGroupProps = headerGroup.getHeaderGroupProps()
              return (
                <Tr {...headerGroupProps} key={headerGroupProps.key}>
                  {headerGroup.headers.map((column) => {
                    const isMultiSortColumn = headerGroup.headers.some(
                      (header) => header.sortedIndex > 0,
                    )
                    const ThClassName = column.parent ? column.parent.id : undefined

                    const headerAlignment =
                      column.Header === 'Site' || column.Header === 'Method' ? 'left' : 'right'
                    const isUserHeader = ThClassName === 'user-headers'
                    const userProfileId = isUserHeader ? column.id : null

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
                        {isUserHeader ? (
                          <UserColumnHeader>
                            {column.render('Header')}{' '}
                            <ActiveRecordsCount>
                              {getUserHeaderCount(userProfileId)}
                            </ActiveRecordsCount>
                          </UserColumnHeader>
                        ) : (
                          column.render('Header')
                        )}
                      </OverviewTh>
                    )
                  })}
                </Tr>
              )
            })}
          </OverviewThead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)

              return (
                <OverviewTr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => {
                    const cellColumnId = cell.column.id
                    const cellColumnGroupId = cell.column.parent.id
                    const cellRowValues = cell.row.values
                    const cellRowValuesMethod = cell.row.values.method
                    const isNotBleachingMethodRow = cellRowValuesMethod !== 'Bleaching'
                    const isCellInSubmittedTransectNumberColumns =
                      submittedTransectNumbers.includes(cellColumnId)

                    const areSiteOrMethodOrEmptyHeaderColumns =
                      cellColumnGroupId === 'site' ||
                      cellColumnGroupId === 'method' ||
                      cellColumnGroupId === 'first-transect-header' ||
                      cellColumnGroupId === 'first-user-header'

                    const cellRowValuesForSubmittedTransectNumbers = Object.entries(
                      cellRowValues,
                    ).filter((value) => submittedTransectNumbers.includes(value[0]))

                    const filteredEmptyCellValuesLength =
                      cellRowValuesForSubmittedTransectNumbers.filter(
                        (value) => value[1] === EMPTY_TABLE_CELL_VALUE,
                      ).length

                    const isNotRowWithAllEmptyCellValues =
                      filteredEmptyCellValuesLength < submittedTransectNumbers.length

                    const isSubmittedNumberCellHightLighted =
                      cell.value === EMPTY_TABLE_CELL_VALUE &&
                      isNotBleachingMethodRow &&
                      isNotRowWithAllEmptyCellValues &&
                      isCellInSubmittedTransectNumberColumns

                    const isCollectingNumberCellHighLighted =
                      cell.value !== EMPTY_TABLE_CELL_VALUE &&
                      !isCellInSubmittedTransectNumberColumns &&
                      !areSiteOrMethodOrEmptyHeaderColumns

                    const cellAlignment = areSiteOrMethodOrEmptyHeaderColumns ? 'left' : 'right'

                    const isCellHighlighted =
                      isSubmittedNumberCellHightLighted || isCollectingNumberCellHighLighted

                    const cellClassName = isCellHighlighted
                      ? `${cellColumnGroupId} highlighted`
                      : cellColumnGroupId

                    const isCellEmpty =
                      cell.value === EMPTY_TABLE_CELL_VALUE ||
                      cell.value === null ||
                      cell.value === undefined ||
                      getIsEmptyStringOrWhitespace(cell.value)

                    const emptyCellContents = isCellHighlighted ? EMPTY_TABLE_CELL_VALUE : null

                    const cellContents = (
                      <>{isCellEmpty ? emptyCellContents : cell.render('Cell')} </>
                    )

                    return (
                      <OverviewTd
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        align={cellAlignment}
                        className={cellClassName}
                      >
                        <span>
                          {cellContents}
                          {isSubmittedNumberCellHightLighted && (
                            <EmptySampleUnitPopup
                              tableCellData={cell}
                              collectRecordsByProfile={collectRecordsByProfile}
                            />
                          )}
                        </span>
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
          unfilteredRowLength={submittedRecords.length}
          methodFilteredRowLength={methodsFilteredTableCellData.length}
          searchFilteredRowLength={searchFilteredRows.length}
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
    <PageUnavailable>{pageNoDataAvailable}</PageUnavailable>
  )

  const content = isAppOnline ? (
    table
  ) : (
    <PageUnavailable mainText={language.error.pageUnavailableOffline} />
  )

  const toolbar = (
    <>
      <H2>{language.pages.usersAndTransectsTable.title}</H2>
      {isAppOnline && (
        <ToolBarItemsRow>
          <FilterItems>
            <FilterSearchToolbar
              name={language.pages.usersAndTransectsTable.filterToolbarText}
              disabled={submittedRecords.length === 0}
              globalSearchText={globalFilter}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />
            <MethodsFilterDropDown
              value={tableUserPrefs.methodsFilter}
              handleMethodsColumnFilterChange={handleMethodsColumnFilterChange}
              disabled={submittedRecords.length === 0}
            />
            {globalFilter?.length || methodsFilter?.length ? (
              <FilterIndicatorPill
                unfilteredRowLength={submittedRecords.length}
                methodFilteredRowLength={methodsFilteredTableCellData.length}
                searchFilteredRowLength={searchFilteredRows.length}
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

export default UsersAndTransects
