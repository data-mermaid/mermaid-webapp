import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { Table, Tr, Th, Td, TableOverflowWrapper, TableNavigation } from '../../generic/Table/table'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
  reactTableNaturalSortDates,
} from '../../generic/Table/reactTableNaturalSort'
import { H2 } from '../../generic/text'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import DataToolbarSection from './DataToolbarSection'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import PageNoData from '../PageNoData'
import { useCurrentUser } from '../../../App/CurrentUserContext'

const getTransectReportProperties = (transect) => {
  return {
    'Fish Belt': 'beltfishes',
    'Benthic LIT': 'benthiclits',
    'Benthic PIT': 'benthicpits',
    'Habitat Complexity': 'habitatcomplexities',
    'Colonies Bleached': ['bleachingqcs', 'obscoloniesbleacheds'],
    'Quadrat Percentage': ['bleachingqcs', 'obsquadratbenthicpercents'],
  }[transect]
}
const Data = () => {
  const [submittedRecordsForUiDisplay, setSubmittedRecordsForUiDisplay] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [currentUserProfile, setCurrentUserProfile] = useState({})
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const currentUser = useCurrentUser()
  const isMounted = useIsMounted()

  useDocumentTitle(`${language.pages.submittedTable.title} - ${language.title.mermaid}`)

  const _getSubmittedRecords = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (databaseSwitchboardInstance && projectId) {
      const promises = [
        databaseSwitchboardInstance.getSubmittedRecordsForUIDisplay(projectId),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
      ]

      Promise.all(promises)
        .then(([submittedRecordsResponse, projectProfilesResponse]) => {
          if (isMounted.current) {
            const filteredUserProfile = projectProfilesResponse.filter(
              ({ profile }) => currentUser.id === profile,
            )[0]

            setSubmittedRecordsForUiDisplay(submittedRecordsResponse)
            setCurrentUserProfile(filteredUserProfile)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          const errorStatus = error.response?.status

          if ((errorStatus === 404 || errorStatus === 400) && isMounted.current) {
            setIdsNotAssociatedWithData([projectId])
            setIsLoading(false)
          }
          toast.error(...getToastArguments(language.error.submittedRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isMounted, isAppOnline, currentUser])
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
    ],
    [],
  )

  const tableCellData = useMemo(
    () =>
      submittedRecordsForUiDisplay.map(({ id, protocol, uiLabels }) => ({
        method: (
          <Link to={`${currentProjectPath}/data/${protocol}/${id}`}>{uiLabels.protocol}</Link>
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

  const tableDefaultSortByColumns = useMemo(
    () => [
      {
        id: 'method',
        desc: false,
      },
    ],
    [],
  )

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = [
      'values.method.props.children',
      'values.site',
      'values.management',
      'values.observers',
    ]

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
    state: { pageIndex, pageSize },
    setGlobalFilter,
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: {
        pageSize: 15,
        sortBy: tableDefaultSortByColumns,
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

  const handleExportToCSV = (transect) => {
    const isBleachingTransect =
      transect === 'Colonies Bleached' || transect === 'Quadrat Percentage'
    const transectReportProperty = getTransectReportProperties(transect)

    const transectProtocol = isBleachingTransect
      ? transectReportProperty[0]
      : transectReportProperty
    const transectMethod = isBleachingTransect
      ? transectReportProperty[1]
      : `obstransect${transectReportProperty}`

    databaseSwitchboardInstance.exportToCSV(projectId, transectProtocol, transectMethod)
  }

  const isReadOnlyUser = !(currentUserProfile?.is_admin || currentUserProfile?.is_collector)
  const table = submittedRecordsForUiDisplay.length ? (
    <>
      <TableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const isMultiSortColumn = headerGroup.headers.some((header) => header.sortedIndex > 0)

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
    <PageNoData mainText={language.pages.submittedTable.noDataText} />
  )

  const content = isAppOnline ? <>{table}</> : <PageUnavailableOffline />
  const toolbar = isAppOnline ? (
    <DataToolbarSection
      name={language.pages.submittedTable.filterToolbarText}
      handleGlobalFilterChange={handleGlobalFilterChange}
      handleExportToCSV={handleExportToCSV}
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
    <ContentPageLayout
      isPageContentLoading={isLoading}
      showCollectingNav={!isReadOnlyUser}
      content={content}
      toolbar={toolbar}
    />
  )
}

export default Data
