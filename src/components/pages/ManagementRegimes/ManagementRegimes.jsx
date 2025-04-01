import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CSVLink } from 'react-csv'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { getObjectById } from '../../../library/getObjectById'
import {
  Tr,
  Th,
  Td,
  TableNavigation,
  StickyTableOverflowWrapper,
  GenericStickyTableTextWrapTh,
} from '../../generic/Table/table'
import { ContentPageLayout } from '../../Layout'
import CopyManagementRegimesModal from '../../CopyManagementRegimesModal'

import { H2 } from '../../generic/text'
import { IconCheck, IconPlus, IconCopy, IconDownload } from '../../icons'
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
  ButtonPrimary,
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
import { useCurrentUser } from '../../../App/CurrentUserContext'
import useDocumentTitle from '../../../library/useDocumentTitle'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import useIsMounted from '../../../library/useIsMounted'
import PageUnavailable from '../PageUnavailable'
import { getIsUserReadOnlyForProject } from '../../../App/currentUserProfileHelpers'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { getFileExportName } from '../../../library/getFileExportName'
import { PAGE_SIZE_DEFAULT } from '../../../library/constants/constants'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'

const ManagementRegimes = () => {
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isMounted = useIsMounted()

  const [choices, setChoices] = useState({})
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isCopyManagementRegimesModalOpen, setIsCopyManagementRegimesModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [managementRegimeExportName, setManagementRegimeExportName] = useState('')
  const [managementRegimeRecordsForUiDisplay, setManagementRegimeRecordsForUiDisplay] = useState([])
  const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, projectId)
  const closeCopyManagementRegimesModal = () => setIsCopyManagementRegimesModalOpen(false)
  const openCopyManagementRegimesModal = () => setIsCopyManagementRegimesModalOpen(true)
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)

  useDocumentTitle(`${language.pages.managementRegimeTable.title} - ${language.title.mermaid}`)

  const _getManagementRegimeRecords = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getManagementRegimeRecordsForUiDisplay(projectId),
        databaseSwitchboardInstance.getProject(projectId),
      ])
        .then(([choicesResponse, managementRegimes, projectResponse]) => {
          if (isMounted.current) {
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }

            const exportName = getFileExportName(projectResponse, 'MRs')

            setManagementRegimeRecordsForUiDisplay(managementRegimes)
            setManagementRegimeExportName(exportName)
            setChoices(choicesResponse)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.managementRegimeRecordsUnavailable))
            },
          })
        })
    }
  }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted, handleHttpResponseError])

  const getIconCheckLabel = (property) => property && <IconCheck />

  const addCopiedMRsToManagementRegimeTable = (copiedManagementRegimes) => {
    setManagementRegimeRecordsForUiDisplay([
      ...managementRegimeRecordsForUiDisplay,
      ...copiedManagementRegimes,
    ])
  }

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Management Regime Name',
        accessor: 'name',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: 'Secondary Name',
        accessor: 'secondaryName',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: 'Year Est.',
        accessor: 'estYear',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Compliance',
        accessor: 'compliance',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Open Access',
        accessor: 'openAccess',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Access Restrictions',
        accessor: 'accessRestriction',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Periodic Closure',
        accessor: 'periodicClosure',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Size Limits',
        accessor: 'sizeLimits',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Gear Restrictions',
        accessor: 'gearRestriction',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Species Restrictions',
        accessor: 'speciesRestriction',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'No Take',
        accessor: 'noTake',
        sortType: reactTableNaturalSort,
      },
    ],
    [],
  )

  const tableCellData = useMemo(() => {
    const complianceChoices = choices?.managementcompliances?.data

    return managementRegimeRecordsForUiDisplay.map((managementRegime) => {
      const complianceName = getObjectById(complianceChoices, managementRegime.compliance)?.name

      return {
        name: (
          <Link to={`${currentProjectPath}/management-regimes/${managementRegime.id}`}>
            {managementRegime.name}
          </Link>
        ),
        secondaryName: managementRegime.name_secondary,
        estYear: managementRegime.est_year,
        compliance: complianceName,
        openAccess: getIconCheckLabel(managementRegime.open_access),
        accessRestriction: getIconCheckLabel(managementRegime.access_restriction),
        periodicClosure: getIconCheckLabel(managementRegime.periodic_closure),
        sizeLimits: getIconCheckLabel(managementRegime.size_limits),
        gearRestriction: getIconCheckLabel(managementRegime.gear_restriction),
        speciesRestriction: getIconCheckLabel(managementRegime.species_restriction),
        noTake: getIconCheckLabel(managementRegime.no_take),
      }
    })
  }, [managementRegimeRecordsForUiDisplay, currentProjectPath, choices])

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
    key: `${currentUser.id}-managementRegimesTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.name.props.children', 'values.estYear']

    const queryTerms = splitSearchQueryStrings(query)

    if (!queryTerms || !queryTerms.length) {
      return rows
    }

    const tableFilteredRows = getTableFilteredRows(rows, keys, queryTerms)

    setSearchFilteredRowsLength(tableFilteredRows.length)

    return tableFilteredRows
  }, [])

  const getDataForCSV = useMemo(() => {
    const managementPartiesChoices = choices?.managementparties?.data
    const complianceChoices = choices?.managementcompliances?.data

    return managementRegimeRecordsForUiDisplay
      .map((managementRegime) => {
        const complianceName = getObjectById(complianceChoices, managementRegime.compliance)?.name
        const governance = managementRegime.parties
          .map((party) => getObjectById(managementPartiesChoices, party)?.name)
          .join(', ')

        const isPartialRestrict =
          managementRegime.periodic_closure ||
          managementRegime.size_limits ||
          managementRegime.gear_restriction ||
          managementRegime.species_restriction ||
          managementRegime.access_restriction

        const no_take = managementRegime.no_take && 'No Take'
        const open_access = managementRegime.open_access && 'Open Access'
        const partial_restrictions =
          isPartialRestrict &&
          `${[
            managementRegime.periodic_closure && 'Periodic Closures',
            managementRegime.size_limits && 'Size Limits',
            managementRegime.gear_restriction && 'Gear Restrictions',
            managementRegime.species_restriction && 'Species Restrictions',
            managementRegime.access_restriction && 'Access Restrictions',
          ].filter((restriction) => restriction)}`

        const rules = open_access || no_take || partial_restrictions || ''

        return {
          Name: managementRegime.name,
          'Secondary name': managementRegime.name_secondary,
          'Year established': managementRegime.est_year,
          Size: managementRegime.size,
          Governance: governance,
          'Estimate compliance': complianceName,
          Rules: rules,
          Notes: managementRegime.notes,
        }
      })
      .toSorted((a, b) => a.Name.localeCompare(b.Name))
  }, [managementRegimeRecordsForUiDisplay, choices])

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

  const readOnlyMrsHeaderContent = (
    <>
      <ButtonSecondary>
        <CSVLink
          data={getDataForCSV}
          filename={managementRegimeExportName}
          style={{ margin: 0, textDecoration: 'none' }}
        >
          <IconDownload /> Export MRs
        </CSVLink>
      </ButtonSecondary>
    </>
  )

  const toolbarButtonsByRole = isReadOnlyUser ? (
    <>
      <ToolbarButtonWrapper>{readOnlyMrsHeaderContent}</ToolbarButtonWrapper>
    </>
  ) : (
    <>
      <ToolbarButtonWrapper>
        <LinkLooksLikeButtonSecondary to={`${currentProjectPath}/management-regimes/new`}>
          <IconPlus /> New MR
        </LinkLooksLikeButtonSecondary>
        {isAppOnline ? (
          <ButtonSecondary type="button" onClick={openCopyManagementRegimesModal}>
            <IconCopy /> {language.pages.managementRegimeTable.copyManagementRegimeButtonText}
          </ButtonSecondary>
        ) : null}
        {readOnlyMrsHeaderContent}
      </ToolbarButtonWrapper>
      <CopyManagementRegimesModal
        isOpen={isCopyManagementRegimesModalOpen}
        onDismiss={closeCopyManagementRegimesModal}
        addCopiedMRsToManagementRegimeTable={addCopiedMRsToManagementRegimeTable}
      />
    </>
  )

  const noManagementRegimesTableContent = (
    <PageUnavailable
      mainText={language.pages.managementRegimeTable.noDataMainText}
      subText={
        isAppOnline ? (
          <ButtonPrimary type="button" onClick={openCopyManagementRegimesModal}>
            <IconCopy /> {language.pages.managementRegimeTable.copyManagementRegimeButtonText}
          </ButtonPrimary>
        ) : null
      }
    />
  )

  const table = managementRegimeRecordsForUiDisplay.length ? (
    <>
      <StickyTableOverflowWrapper>
        <GenericStickyTableTextWrapTh {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const isMultiSortColumn = headerGroup.headers.some((header) => header.sortedIndex > 0)

              return (
                <Tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      key={column.id}
                      {...column.getHeaderProps(getTableColumnHeaderProps(column))}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                      isMultiSortColumn={isMultiSortColumn}
                    >
                      <span>{column.render('Header')}</span>
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
        </GenericStickyTableTextWrapTh>
      </StickyTableOverflowWrapper>
      <TableNavigation>
        <PageSizeSelector
          onChange={handleRowsNumberChange}
          pageSize={pageSize}
          pageSizeOptions={[15, 50, 100]}
          pageType="management regime"
          unfilteredRowLength={managementRegimeRecordsForUiDisplay.length}
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
    noManagementRegimesTableContent
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
          <H2>{language.pages.managementRegimeTable.title}</H2>
          <ToolBarRow>
            <FilterSearchToolbar
              name={language.pages.managementRegimeTable.filterToolbarText}
              disabled={managementRegimeRecordsForUiDisplay.length === 0}
              globalSearchText={globalFilter}
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

export default ManagementRegimes
