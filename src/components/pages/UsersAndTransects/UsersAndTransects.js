import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
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
import SampleUnitLinks from '../../SampleUnitLinks'
import { sortArray } from '../../../library/arrays/sortArray'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import {
  Tr,
  Th,
  Td,
  TableNavigation,
  HeaderCenter,
  StickyTableOverflowWrapper,
  StickyProjectHealthTable,
} from '../../generic/Table/table'
import { ToolBarRow } from '../../generic/positioning'
import theme from '../../../theme'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import useIsMounted from '../../../library/useIsMounted'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import { getSampleDateLabel } from '../../../App/mermaidData/getSampleDateLabel'

const EMPTY_VALUE = '-'

const UserColumnHeader = styled.div`
  display: inline-flex;
  flex-direction: row;
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
const UsersAndTransectsHeaderRow = styled(Tr)`
  th.transect-numbers {
    background: hsl(235, 10%, 90%);
    &:after {
      display: none;
    }
  }
  th.user-headers {
    background: hsl(235, 10%, 85%);
    &:after {
      display: none;
    }
  }
`
const UsersAndTransectsRow = styled(Tr)`
  &:nth-child(odd) {
    background: hsl(0, 0%, 100%);
    td.transect-numbers {
      background: hsl(0, 0%, 95%);
    }
    td.user-headers {
      background: hsl(0, 0%, 90%);
    }
  }
  &:nth-child(even) {
    background: hsl(235, 10%, 95%);
    td.transect-numbers {
      background: hsl(235, 10%, 90%);
    }
    td.user-headers {
      background: hsl(235, 10%, 85%);
    }
  }
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
        const collectRecords = profileSummary[collectRecordProfile]?.labels

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
        Header: (
          <UserColumnHeader>
            <span>{user.profileName}</span>
            <span>
              <ActiveRecordsCount>{user.collectRecords.length}</ActiveRecordsCount>
            </span>
          </UserColumnHeader>
        ),
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
        Header: () => <HeaderCenter>Submitted Transect Number</HeaderCenter>,
        id: 'transect-numbers',
        columns: getSubmittedTransectNumberColumnHeaders,
        disableSortBy: true,
      },
      {
        Header: () => <HeaderCenter>Transect Number / User</HeaderCenter>,
        id: 'user-headers',
        columns: getUserColumnHeaders,
        disableSortBy: true,
      },
    ],
    [getUserColumnHeaders, getSubmittedTransectNumberColumnHeaders],
  )

  const populateTransectNumberRow = useCallback(
    (rowRecord) => {
      const rowNumbers = rowRecord.sample_unit_numbers.map(({ label }) => label)

      const submittedTransectNumbersRow = submittedTransectNumbers.reduce((accumulator, number) => {
        if (!accumulator[number]) {
          accumulator[number] = EMPTY_VALUE
        }

        if (rowNumbers.includes(number)) {
          const filteredRowSampleUnitNumbers = rowRecord.sample_unit_numbers.filter(
            ({ label }) => label === number,
          )

          accumulator[number] = (
            <SampleUnitLinks
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
          const replaceEmptyLabels = (labels) => {
            return labels.map((label) => {
              return label.name || language.pages.usersAndTransectsTable.missingLabelNumber
            })
          }

          accumulator[record.profileId] = rowRecord.profile_summary[record.profileId]
            ? sortArray(
                replaceEmptyLabels(rowRecord.profile_summary[record.profileId].labels),
              ).join(', ')
            : EMPTY_VALUE

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
    key: `${currentUser.id}-usersAndTransectsTable`,
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
        pageSize: tableUserPrefs.pageSize ? tableUserPrefs.pageSize : 100,
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

  const _setPageSizePrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'pageSize', currentValue: pageSize })
  }, [pageSize, handleSetTableUserPrefs])

  const table = (
    <>
      <StickyTableOverflowWrapper>
        <StickyProjectHealthTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <UsersAndTransectsHeaderRow {...headerGroup.getHeaderGroupProps()}>
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
              </UsersAndTransectsHeaderRow>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)

              return (
                <UsersAndTransectsRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    const cellColumnId = cell.column.id
                    const cellColumnGroupId = cell.column.parent.id
                    const cellRowValues = cell.row.values
                    const cellRowValuesMethod = cell.row.values.method
                    const isNotBleachingMethodRow = cellRowValuesMethod !== 'Bleaching'
                    const isCellInSubmittedTransectNumberColumns =
                      submittedTransectNumbers.includes(cellColumnId)
                    const areSiteOrMethodColumns =
                      cellColumnId === 'site' || cellColumnId === 'method'

                    const cellRowValuesForSubmittedTransectNumbers = Object.entries(
                      cellRowValues,
                    ).filter((value) => submittedTransectNumbers.includes(value[0]))

                    const filteredEmptyCellValuesLength =
                      cellRowValuesForSubmittedTransectNumbers.filter(
                        (value) => value[1] === EMPTY_VALUE,
                      ).length

                    const isNotRowWithAllEmptyCellValues =
                      filteredEmptyCellValuesLength < submittedTransectNumbers.length

                    const isSubmittedNumberCellHightLighted =
                      cell.value === EMPTY_VALUE &&
                      isNotBleachingMethodRow &&
                      isNotRowWithAllEmptyCellValues &&
                      isCellInSubmittedTransectNumberColumns

                    const isCollectingNumberCellHighLighted =
                      cell.value !== EMPTY_VALUE &&
                      !isCellInSubmittedTransectNumberColumns &&
                      !areSiteOrMethodColumns

                    const cellAlignment = areSiteOrMethodColumns ? 'left' : 'right'

                    const cellClassName =
                      isSubmittedNumberCellHightLighted || isCollectingNumberCellHighLighted
                        ? `${cellColumnGroupId} highlighted`
                        : cellColumnGroupId

                    return (
                      <Td {...cell.getCellProps()} align={cellAlignment} className={cellClassName}>
                        <span>{cell.render('Cell')}</span>
                      </Td>
                    )
                  })}
                </UsersAndTransectsRow>
              )
            })}
          </tbody>
        </StickyProjectHealthTable>
      </StickyTableOverflowWrapper>
      <TableNavigation>
        <PageSizeSelector
          onChange={handleRowsNumberChange}
          pageSize={pageSize}
          pageSizeOptions={[15, 50, 100]}
          pageType="users and transects"
          rowLength={page.length}
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
    <PageUnavailable mainText={language.error.pageUnavailableOffline} />
  )

  const toolbar = (
    <>
      <H2>{language.pages.usersAndTransectsTable.title}</H2>
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

export default UsersAndTransects
