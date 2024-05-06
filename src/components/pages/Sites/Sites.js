import { CSVLink } from 'react-csv'
import { Link, useParams } from 'react-router-dom'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'

import { ContentPageLayout } from '../../Layout'
import CopySitesModal from '../../CopySitesModal'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import { getIsUserReadOnlyForProject } from '../../../App/currentUserProfileHelpers'
import { getObjectById } from '../../../library/getObjectById'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../library/getToastArguments'
import { H2 } from '../../generic/text'
import { IconPlus, IconCopy, IconDownload } from '../../icons'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import language from '../../../language'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import PageUnavailable from '../PageUnavailable'
import ProjectSitesMap from '../../mermaidMap/ProjectSitesMap'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
} from '../../generic/Table/reactTableNaturalSort'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import {
  ButtonPrimary,
  ButtonSecondary,
  LinkLooksLikeButtonSecondary,
  ToolbarButtonWrapper,
} from '../../generic/buttons'
import { ToolBarRow } from '../../generic/positioning'
import {
  Tr,
  Th,
  Td,
  TableNavigation,
  StickyTableOverflowWrapper,
  GenericStickyTable,
} from '../../generic/Table/table'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { getFileExportName } from '../../../library/getFileExportName'
import { PAGE_SIZE_DEFAULT } from '../../../library/constants/constants'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'

const Sites = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const currentProjectPath = useCurrentProjectPath()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const { isAppOnline } = useOnlineStatus()
  const { currentUser } = useCurrentUser()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [siteRecordsForUiDisplay, setSiteRecordsForUiDisplay] = useState([])
  const [siteExportName, setSiteExportName] = useState('')
  const [choices, setChoices] = useState({})
  const [sitesForMapMarkers, setSitesForMapMarkers] = useState([])
  const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, projectId)
  const [isCopySitesModalOpen, setIsCopySitesModalOpen] = useState(false)
  const openCopySitesModal = () => setIsCopySitesModalOpen(true)
  const closeCopySitesModal = () => setIsCopySitesModalOpen(false)
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)

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

            const exportName = getFileExportName(project, 'sites')

            setSiteRecordsForUiDisplay(sites)
            setSitesForMapMarkers(sites)
            setSiteExportName(exportName)
            setChoices(choicesResponse)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.siteRecordsUnavailable))
            },
          })
        })
    }
  }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted, handleHttpResponseError])

  const addCopiedSitesToSiteTable = (copiedSites) => {
    setSiteRecordsForUiDisplay([...siteRecordsForUiDisplay, ...copiedSites])
    setSitesForMapMarkers([...siteRecordsForUiDisplay, ...copiedSites])
  }

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

  const tableCellData = useMemo(() => {
    const reefTypeChoices = choices?.reeftypes?.data
    const reefZoneChoices = choices?.reefzones?.data
    const exposureChoices = choices?.reefexposures?.data

    return siteRecordsForUiDisplay.map((site) => {
      const reefTypeName = getObjectById(reefTypeChoices, site.reef_type)?.name
      const reefZoneName = getObjectById(reefZoneChoices, site.reef_zone)?.name
      const exposureName = getObjectById(exposureChoices, site.exposure)?.name

      return {
        name: <Link to={`${currentProjectPath}/sites/${site.id}`}>{site.name}</Link>,
        reefType: reefTypeName,
        reefZone: reefZoneName,
        exposure: exposureName,
        id: site.id,
      }
    })
  }, [siteRecordsForUiDisplay, currentProjectPath, choices])

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
      setSearchFilteredRowsLength(filteredSiteRecords.length)

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

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const _setFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: globalFilter })
  }, [globalFilter, handleSetTableUserPrefs])

  const _setPageSizePrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'pageSize', currentValue: pageSize })
  }, [pageSize, handleSetTableUserPrefs])

  const getDataForCSV = useMemo(() => {
    const countryChoices = choices?.countries?.data
    const reefTypeChoices = choices?.reeftypes?.data
    const reefZoneChoices = choices?.reefzones?.data
    const exposureChoices = choices?.reefexposures?.data

    return siteRecordsForUiDisplay
      .map((site) => {
        const countryName = getObjectById(countryChoices, site.country)?.name
        const reefTypeName = getObjectById(reefTypeChoices, site.reef_type)?.name
        const reefZoneName = getObjectById(reefZoneChoices, site.reef_zone)?.name
        const exposureName = getObjectById(exposureChoices, site.exposure)?.name

        return {
          Country: countryName,
          Name: site.name,
          Latitude: site.location.coordinates[1],
          Longitude: site.location.coordinates[0],
          'Reef type': reefTypeName,
          'Reef zone': reefZoneName,
          'Reef exposure': exposureName,
          Notes: site.notes,
        }
      })
      .toSorted((a, b) => a.Name.localeCompare(b.Name))
  }, [siteRecordsForUiDisplay, choices])

  const readOnlySitesHeaderContent = (
    <>
      <ButtonSecondary>
        <CSVLink
          data={getDataForCSV}
          filename={siteExportName}
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
        {isAppOnline ? (
          <ButtonSecondary type="button" onClick={openCopySitesModal}>
            <IconCopy /> {language.pages.siteTable.copySitesButtonText}
          </ButtonSecondary>
        ) : null}
        {readOnlySitesHeaderContent}
      </ToolbarButtonWrapper>
      <CopySitesModal
        isOpen={isCopySitesModalOpen}
        onDismiss={closeCopySitesModal}
        addCopiedSitesToSiteTable={addCopiedSitesToSiteTable}
      />
    </>
  )

  const table = siteRecordsForUiDisplay.length ? (
    <>
      <StickyTableOverflowWrapper>
        <GenericStickyTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <Tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const isMultiSortColumn = headerGroup.headers.some(
                    (header) => header.sortedIndex > 0,
                  )
                  const ThClassName = column.parent ? column.parent.id : undefined

                  return (
                    <Th
                      {...column.getHeaderProps(getTableColumnHeaderProps(column))}
                      key={column.id}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                      isMultiSortColumn={isMultiSortColumn}
                      className={ThClassName}
                    >
                      <span>{column.render('Header')}</span>
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
          pageType="site"
          unfilteredRowLength={siteRecordsForUiDisplay.length}
          searchFilteredRowLength={searchFilteredRowsLength}
          isSearchFilterEnabled={!!globalFilter?.length}
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
      mainText={language.pages.siteTable.noDataMainText}
      subText={
        <ButtonPrimary type="button" onClick={openCopySitesModal}>
          <IconCopy /> {language.pages.siteTable.copySitesButtonText}
        </ButtonPrimary>
      }
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
              disabled={siteRecordsForUiDisplay.length === 0}
              globalSearchText={globalFilter}
              handleGlobalFilterChange={handleGlobalFilterChange}
              type="site"
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
