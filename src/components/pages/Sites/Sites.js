import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CSVLink } from 'react-csv'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import {
  Tr,
  Th,
  Td,
  TableNavigation,
  StickyTableOverflowWrapper,
  GenericStickyTable,
} from '../../generic/Table/table'
import { ContentPageLayout } from '../../Layout'
import { H2 } from '../../generic/text'
import { IconPlus, IconCopy, IconDownload } from '../../icons'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
} from '../../generic/Table/reactTableNaturalSort'
import { ToolBarRow } from '../../generic/positioning'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import {
  ToolbarButtonWrapper,
  ButtonSecondary,
  LinkLooksLikeButtonSecondary,
} from '../../generic/buttons'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import useDocumentTitle from '../../../library/useDocumentTitle'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import useIsMounted from '../../../library/useIsMounted'
import PageUnavailable from '../PageUnavailable'
import ProjectSitesMap from '../../mermaidMap/ProjectSitesMap'
import { getIsReadOnlyUserRole } from '../../../App/currentUserProfileHelpers'
import CopySitesModal from '../../CopySitesModal'

const Sites = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [siteRecordsForUiDisplay, setSiteRecordsForUiDisplay] = useState([])
  const [choices, setChoices] = useState({})

  const [sitesForMapMarkers, setSitesForMapMarkers] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const { isAppOnline } = useOnlineStatus()
  const { currentUser } = useCurrentUser()
  const isReadOnlyUser = getIsReadOnlyUserRole(currentUser, projectId)
  const [isCopySitesModalOpen, setIsCopySitesModalOpen] = useState(false)
  const openCopySitesModal = () => setIsCopySitesModalOpen(true)
  const closeCopySitesModal = () => setIsCopySitesModalOpen(false)

  useDocumentTitle(`${language.pages.siteTable.title} - ${language.title.mermaid}`)

  const _getSiteRecords = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getSiteRecordsForUIDisplay(projectId),
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getChoices(),
      ])

        .then(([sites, project, choicesResponse]) => {
          if (isMounted.current) {
            if (!project && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }
            setSiteRecordsForUiDisplay(sites)
            setSitesForMapMarkers(sites)
            setChoices(choicesResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.siteRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted])

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

  const tableDefaultPrefs = useMemo(() => {
    return {
      sortBy: [
        {
          id: 'name',
          desc: false,
        },
      ],
      globalFilter: '',
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser && currentUser.id}-sitesTable`,
    defaultValue: tableDefaultPrefs,
  })

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
    state: { pageIndex, pageSize, sortBy, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: {
        pageSize: 15,
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

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const _setFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: globalFilter })
  }, [globalFilter, handleSetTableUserPrefs])

  const getDataForCSV = useMemo(() => {
    const countryChoices = choices?.countries?.data

    return siteRecordsForUiDisplay.map((site) => {
      const findCountry = countryChoices?.find((country) => country.id === site.country)

      return {
        Country: findCountry?.name,
        Name: site.uiLabels.name,
        Latitude: site.location.coordinates[1],
        Longitude: site.location.coordinates[0],
        'Reef type': site.uiLabels.reefType,
        'Reef zone': site.uiLabels.reefZone,
        'Reef exposure': site.uiLabels.exposure,
        Notes: site.notes,
      }
    })
  }, [siteRecordsForUiDisplay, choices])

  const readOnlySitesHeaderContent = (
    <>
      <ButtonSecondary>
        <CSVLink
          data={getDataForCSV}
          filename="Export_sites.csv"
          style={{ margin: 0, textDecoration: 'none' }}
        >
          <IconDownload /> Export sites
        </CSVLink>
      </ButtonSecondary>
    </>
  )

  const toolbarButtonsByRole = isReadOnlyUser ? (
    <>
      <ToolbarButtonWrapper>{readOnlySitesHeaderContent}</ToolbarButtonWrapper>
    </>
  ) : (
    <>
      <ToolbarButtonWrapper>
        <LinkLooksLikeButtonSecondary to={`${currentProjectPath}/sites/new`}>
          <IconPlus /> New site
        </LinkLooksLikeButtonSecondary>
        <ButtonSecondary type="button" onClick={openCopySitesModal}>
          <IconCopy /> Copy sites from other projects
        </ButtonSecondary>
        <CopySitesModal isOpen={isCopySitesModalOpen} onDismiss={closeCopySitesModal} />
        {readOnlySitesHeaderContent}
      </ToolbarButtonWrapper>
    </>
  )

  const table = siteRecordsForUiDisplay.length ? (
    <>
      <StickyTableOverflowWrapper>
        <GenericStickyTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const isMultiSortColumn = headerGroup.headers.some(
                    (header) => header.sortedIndex > 0,
                  )

                  return (
                    <Th
                      {...column.getHeaderProps(getTableColumnHeaderProps(column))}
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
        </GenericStickyTable>
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
      {isAppOnline && <ProjectSitesMap sitesForMapMarkers={sitesForMapMarkers} choices={choices} />}
    </>
  ) : (
    <PageUnavailable
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
      toolbar={
        <>
          <H2>{language.pages.siteTable.title}</H2>
          <ToolBarRow>
            <FilterSearchToolbar
              name={language.pages.siteTable.filterToolbarText}
              value={tableUserPrefs.globalFilter}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />

            <ToolbarButtonWrapper>{toolbarButtonsByRole}</ToolbarButtonWrapper>
          </ToolBarRow>
        </>
      }
      content={table}
      isPageContentLoading={isLoading}
    />
  )
}

export default Sites
