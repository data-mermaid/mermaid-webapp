// import { CSVLink } from 'react-csv'
import { Link, useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'

import { ContentPageLayout } from '../../../Layout'
import FilterSearchToolbar from '../../../FilterSearchToolbar/FilterSearchToolbar'
import {
  getIsUserAdminForProject,
  getIsUserReadOnlyForProject,
} from '../../../../App/currentUserProfileHelpers'
import { getTableColumnHeaderProps } from '../../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../../library/getToastArguments'
import { H2 } from '../../../generic/text'
import { IconPlus, IconDownload } from '../../../icons'
import language from '../../../../language'
import PageSelector from '../../../generic/Table/PageSelector'
import PageSizeSelector from '../../../generic/Table/PageSizeSelector'
import PageUnavailable from '../../PageUnavailable'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
} from '../../../generic/Table/reactTableNaturalSort'
import { splitSearchQueryStrings } from '../../../../library/splitSearchQueryStrings'
import { ButtonSecondary, ToolbarButtonWrapper } from '../../../generic/buttons'
import { Column, ToolBarRow } from '../../../generic/positioning'
import {
  Tr,
  Th,
  Td,
  TableNavigation,
  StickyTableOverflowWrapper,
  GenericStickyTable,
} from '../../../generic/Table/table'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useDocumentTitle from '../../../../library/useDocumentTitle'
import useIsMounted from '../../../../library/useIsMounted'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import usePersistUserTablePreferences from '../../../generic/Table/usePersistUserTablePreferences'
// import { getFileExportName } from '../../../../library/getFileExportName'
import { PAGE_SIZE_DEFAULT } from '../../../../library/constants/constants'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { GfcrPageUnavailablePadding, StyledToolbarButtonWrapper } from './Gfcr.styles'
import ButtonSecondaryDropdown from '../../../generic/ButtonSecondaryDropdown'
import { DropdownItemStyle } from '../../../generic/ButtonSecondaryDropdown/ButtonSecondaryDropdown.styles'
import { useCurrentProject } from '../../../../App/CurrentProjectContext'

// const indicatorSetsDummyData = [
//   {
//     id: 1,
//     name: 'Baseline',
//     type: 'report',
//     year: 2021,
//   },
//   {
//     id: 2,
//     name: 'Phase 1 result',
//     type: 'report',
//     year: 2023,
//   },
//   {
//     id: 3,
//     name: 'Midterm Target',
//     type: 'target',
//     year: 2026,
//   },
//   {
//     id: 4,
//     name: 'FinalTarget',
//     type: 'target',
//     year: 2029,
//   }
// ]

const Gfcr = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const currentProjectPath = useCurrentProjectPath()
  const { gfcrIndicatorSets, setGfcrIndicatorSets } = useCurrentProject()
  const navigate = useNavigate()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const { isAppOnline } = useOnlineStatus()
  const { currentUser } = useCurrentUser()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const [isLoading, setIsLoading] = useState(true)
  // const [siteExportName, setSiteExportName] = useState('')
  // const [choices, setChoices] = useState({})
  // const [sitesForMapMarkers, setSitesForMapMarkers] = useState([])
  const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, projectId)
  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)

  // const [isCopySitesModalOpen, setIsCopySitesModalOpen] = useState(false)
  // const openCopySitesModal = () => setIsCopySitesModalOpen(true)
  // const closeCopySitesModal = () => setIsCopySitesModalOpen(false)
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)

  useDocumentTitle(`${language.pages.siteTable.title} - ${language.title.mermaid}`)
  const [isExporting, setIsExporting] = useState(false)

  const _getIndicatorSets = useEffect(() => {
    if (databaseSwitchboardInstance && isAppOnline) {
      Promise.all([databaseSwitchboardInstance.getIndicatorSets(projectId)])
        .then(([indicatorSetsResponse]) => {
          if (isMounted.current) {
            setGfcrIndicatorSets(indicatorSetsResponse.results)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.gfcrIndicatorSetsUnavailable))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    handleHttpResponseError,
    projectId,
    setGfcrIndicatorSets,
    isAppOnline,
  ])

  // setIndicatorSets(indicatorSetsDummyData)
  // setIsLoading(false)
  // if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
  //   Promise.all([
  //     databaseSwitchboardInstance.getSiteRecordsForUIDisplay(projectId),
  //     databaseSwitchboardInstance.getProject(projectId),
  //     databaseSwitchboardInstance.getChoices(),
  //   ])

  //     .then(([sites, project, choicesResponse]) => {
  //       if (isMounted.current) {
  //         if (!project && projectId) {
  //           setIdsNotAssociatedWithData([projectId])
  //         }

  //         const exportName = getFileExportName(project, 'sites')

  //         setSiteRecordsForUiDisplay(sites)
  //         setSitesForMapMarkers(sites)
  //         setSiteExportName(exportName)
  //         setChoices(choicesResponse)
  //         setIsLoading(false)
  //       }
  //     })
  //     .catch((error) => {
  //       handleHttpResponseError({
  //         error,
  //         callback: () => {
  //           toast.error(...getToastArguments(language.error.siteRecordsUnavailable))
  //         },
  //       })
  //     })
  // }
  // }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted, handleHttpResponseError])
  // }, [])

  // const addCopiedSitesToSiteTable = (copiedSites) => {
  //   setSiteRecordsForUiDisplay([...siteRecordsForUiDisplay, ...copiedSites])
  //   setSitesForMapMarkers([...siteRecordsForUiDisplay, ...copiedSites])
  // }

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: 'Type',
        accessor: 'indicator_set_type',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Year',
        accessor: 'report_year',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
      // {
      //   Header: 'Reef Type',
      //   accessor: 'reefType',
      //   sortType: reactTableNaturalSort,
      // },
      // {
      //   Header: 'Reef Zone',
      //   accessor: 'reefZone',
      //   sortType: reactTableNaturalSort,
      // },
      // {
      //   Header: 'Exposure',
      //   accessor: 'exposure',
      //   sortType: reactTableNaturalSort,
      // },
    ],
    [],
  )

  const tableCellData = useMemo(() => {
    return gfcrIndicatorSets.map((indicatorSet) => {
      const { id, title, indicator_set_type, report_year } = indicatorSet

      return {
        title: <Link to={`${currentProjectPath}/gfcr/${id}`}>{title}</Link>,
        indicator_set_type: indicator_set_type === 'annual_report' ? 'Annual Report' : 'Target',
        report_year,
      }
    })
  }, [gfcrIndicatorSets, currentProjectPath])

  const tableDefaultPrefs = useMemo(() => {
    return {
      sortBy: [
        {
          id: 'title',
          desc: false,
        },
      ],
      globalFilter: '',
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser && currentUser.id}-gfcrTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback(
    (rows, id, query) => {
      const keys = ['values.title.props.children', 'values.type', 'values.report_year']

      const queryTerms = splitSearchQueryStrings(query)
      const filteredRows =
        !queryTerms || !queryTerms.length ? rows : getTableFilteredRows(rows, keys, queryTerms)

      const filteredRowIds = filteredRows.map((row) => row.original.id)
      const filteredIndicatorSets = gfcrIndicatorSets.filter((indicatorSet) =>
        filteredRowIds.includes(indicatorSet.id),
      )

      setSearchFilteredRowsLength(filteredIndicatorSets.length)

      return filteredRows
    },
    [gfcrIndicatorSets],
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

  // const getDataForCSV = useMemo(() => {
  //   const countryChoices = choices?.countries?.data
  //   const reefTypeChoices = choices?.reeftypes?.data
  //   const reefZoneChoices = choices?.reefzones?.data
  //   const exposureChoices = choices?.reefexposures?.data

  //   return siteRecordsForUiDisplay
  //     .map((site) => {
  //       const countryName = getObjectById(countryChoices, site.country)?.name
  //       const reefTypeName = getObjectById(reefTypeChoices, site.reef_type)?.name
  //       const reefZoneName = getObjectById(reefZoneChoices, site.reef_zone)?.name
  //       const exposureName = getObjectById(exposureChoices, site.exposure)?.name

  //       return {
  //         Country: countryName,
  //         Name: site.name,
  //         Latitude: site.location.coordinates[1],
  //         Longitude: site.location.coordinates[0],
  //         'Reef type': reefTypeName,
  //         'Reef zone': reefZoneName,
  //         'Reef exposure': exposureName,
  //         Notes: site.notes,
  //       }
  //     })
  //     .toSorted((a, b) => a.Name.localeCompare(b.Name))
  // }, [siteRecordsForUiDisplay, choices])

  const readOnlySitesHeaderContent = (
    <>
      <ButtonSecondary>
        {/* <CSVLink
          data={getDataForCSV}
          filename={siteExportName}
          style={{ margin: 0, textDecoration: 'none' }}
        >
          <IconDownload /> Export sites
        </CSVLink> */}
      </ButtonSecondary>
    </>
  )

  const createDropdownLabel = (
    <>
      <IconPlus /> Create new
    </>
  )

  const handleNewIndicatorSet = (type) => {
    navigate(`${currentProjectPath}/gfcr/new/${type}`)
  }

  const handleExportClick = () => {
    setIsExporting(true)

    databaseSwitchboardInstance
      .exportData(projectId)
      .catch(() => {
        toast.error('There was an error exporting the report.')
      })
      .finally(() => {
        setIsExporting(false)
      })
  }

  const toolbarButtonsByRole = isReadOnlyUser ? (
    <>
      <ToolbarButtonWrapper>{readOnlySitesHeaderContent}</ToolbarButtonWrapper>
    </>
  ) : (
    <>
      <StyledToolbarButtonWrapper>
        <ButtonSecondaryDropdown label={createDropdownLabel}>
          <Column as="nav" data-testid="export-to-csv">
            <DropdownItemStyle as="button" onClick={() => handleNewIndicatorSet('annual-report')}>
              Annual Report
            </DropdownItemStyle>
            <DropdownItemStyle as="button" onClick={() => handleNewIndicatorSet('target')}>
              Target
            </DropdownItemStyle>
          </Column>
        </ButtonSecondaryDropdown>
        <ButtonSecondary
          to=""
          disabled={!gfcrIndicatorSets.length || isExporting}
          onClick={handleExportClick}
        >
          <IconDownload /> {isExporting ? 'Exporting...' : 'Export to XLSX'}
        </ButtonSecondary>
      </StyledToolbarButtonWrapper>
    </>
  )

  const table = gfcrIndicatorSets.length ? (
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
                      {...column.getHeaderProps({
                        ...getTableColumnHeaderProps(column),
                        ...{ style: { textAlign: column.align } },
                      })}
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
                      <Td key={cell.id} {...cell.getCellProps()} align={cell.column.align}>
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
          unfilteredRowLength={gfcrIndicatorSets.length}
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
    </>
  ) : (
    <PageUnavailable
      mainText={language.pages.gfcrTable.noDataMainText}
      subText={language.pages.gfcrTable.noDataSubText}
    />
  )

  if (!isAdminUser) {
    return (
      <GfcrPageUnavailablePadding>
        <PageUnavailable mainText={language.error.pageAdminOnly} />
      </GfcrPageUnavailablePadding>
    )
  }

  return (
    <ContentPageLayout
      toolbar={
        <>
          <H2>{language.pages.gfcrTable.title}</H2>
          <ToolBarRow>
            <FilterSearchToolbar
              name={language.pages.gfcrTable.filterToolbarText}
              disabled={gfcrIndicatorSets.length === 0}
              globalSearchText={globalFilter || ''}
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
  // )
}

export default Gfcr
