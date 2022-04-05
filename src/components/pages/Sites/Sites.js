import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { Table, Tr, Th, Td, TableOverflowWrapper, TableNavigation } from '../../generic/Table/table'
import { ContentPageLayout } from '../../Layout'
import { H2 } from '../../generic/text'
import { IconPlus, IconCopy, IconDownload } from '../../icons'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
} from '../../generic/Table/reactTableNaturalSort'
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
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import PageNoData from '../PageNoData'
import ProjectSitesMap from '../../mermaidMap/ProjectSitesMap'
import { useCurrentUser } from '../../../App/CurrentUserContext'

const Sites = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [siteRecordsForUiDisplay, setSiteRecordsForUiDisplay] = useState([])
  const [choices, setChoices] = useState({})
  const [sitesForMapMarkers, setSitesForMapMarkers] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [currentUserProfile, setCurrentUserProfile] = useState({})
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const currentUser = useCurrentUser()
  const isMounted = useIsMounted()

  useDocumentTitle(`${language.pages.siteTable.title} - ${language.title.mermaid}`)

  const _getSiteRecords = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getSiteRecordsForUIDisplay(projectId),
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
      ])

        .then(([sites, project, choicesResponse, projectProfilesResponse]) => {
          if (isMounted.current) {
            if (!project && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }
            const filteredUserProfile = projectProfilesResponse.filter(
              ({ profile }) => currentUser.id === profile,
            )[0]

            setSiteRecordsForUiDisplay(sites)
            setSitesForMapMarkers(sites)
            setChoices(choicesResponse)
            setCurrentUserProfile(filteredUserProfile)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.siteRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted, currentUser])

  const currentProjectPath = useCurrentProjectPath()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: reactTableNaturalSortReactNodes,
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
        name: <Link to={`${currentProjectPath}/sites/${id}`}>{uiLabels.name}</Link>,
        reefType: uiLabels.reefType,
        reefZone: uiLabels.reefZone,
        exposure: uiLabels.exposure,
        id,
      })),
    [siteRecordsForUiDisplay, currentProjectPath],
  )

  const tableDefaultSortByColumns = useMemo(
    () => [
      {
        id: 'name',
        desc: false,
      },
    ],
    [],
  )

  const tableGlobalFilters = useCallback(
    (rows, id, query) => {
      const keys = [
        'values.name.props.children',
        'values.reefType',
        'values.reefZone',
        'values.exposure',
      ]

      const queryTerms = splitSearchQueryStrings(query)
      const filteredRows =
        !queryTerms || !queryTerms.length ? rows : getTableFilteredRows(rows, keys, queryTerms)

      const filteredRowIds = filteredRows.map((row) => row.original.id)
      const filteredSiteRecords = siteRecordsForUiDisplay.filter((site) =>
        filteredRowIds.includes(site.id),
      )

      setSitesForMapMarkers(filteredSiteRecords)

      return filteredRows
    },
    [siteRecordsForUiDisplay],
  )

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
  const handleRowsNumberChange = (e) => {
    setPageSize(Number(e.target.value))
  }

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const isReadOnlyUser = !(currentUserProfile?.is_admin || currentUserProfile?.is_collector)
  const table = siteRecordsForUiDisplay.length ? (
    <>
      <TableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const isMultiSortColumn = headerGroup.headers.some(
                    (header) => header.sortedIndex > 0,
                  )

                  return (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                      isMultiSortColumn={isMultiSortColumn}
                    >
                      {column.render('Header')}
                    </Th>
                  )
                })}
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
      <ProjectSitesMap sitesForMapMarkers={sitesForMapMarkers} choices={choices} />
    </>
  ) : (
    <PageNoData
      mainText={language.pages.siteTable.noDataText}
      subText={language.pages.siteTable.noDataExtraText}
    />
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
      content={table}
      toolbar={
        <>
          <H2>{language.pages.siteTable.title}</H2>
          <ToolBarRow>
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
          </ToolBarRow>
        </>
      }
    />
  )
}

export default Sites
