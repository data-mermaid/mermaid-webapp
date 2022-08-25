import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CSVLink } from 'react-csv'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { getObjectById } from '../../../library/getObjectById'
import { Table, Tr, Th, Td, TableOverflowWrapper, TableNavigation } from '../../generic/Table/table'
import { ContentPageLayout } from '../../Layout'
import { H2 } from '../../generic/text'
import { IconCheck, IconPlus, IconCopy, IconDownload } from '../../icons'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
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
import { useCurrentUser } from '../../../App/CurrentUserContext'
import useDocumentTitle from '../../../library/useDocumentTitle'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import useIsMounted from '../../../library/useIsMounted'
import PageNoData from '../PageNoData'
import { userRole } from '../../../App/mermaidData/userRole'
import { getProjectRole } from '../../../App/currentUserProfileHelpers'

const ManagementRegimes = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [managementParties, setManagementParties] = useState([])
  const [managementRegimeRecordsForUiDisplay, setManagementRegimeRecordsForUiDisplay] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const { currentUser } = useCurrentUser()
  const isReadOnlyUser = getProjectRole(currentUser, projectId) === userRole.read_only

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
            setManagementRegimeRecordsForUiDisplay(managementRegimes)
            setManagementParties(choicesResponse.managementparties)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.managementRegimeRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted])

  const currentProjectPath = useCurrentProjectPath()
  const getIconCheckLabel = (property) => property && <IconCheck />

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Management Regime Name',
        accessor: 'name',
        sortType: reactTableNaturalSort,
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

  const tableCellData = useMemo(
    () =>
      managementRegimeRecordsForUiDisplay.map(({ id, uiLabels }) => ({
        name: <Link to={`${currentProjectPath}/management-regimes/${id}`}>{uiLabels.name}</Link>,
        estYear: uiLabels.estYear,
        compliance: uiLabels.compliance,
        openAccess: getIconCheckLabel(uiLabels.openAccess),
        accessRestriction: getIconCheckLabel(uiLabels.accessRestriction),
        periodicClosure: getIconCheckLabel(uiLabels.periodicClosure),
        sizeLimits: getIconCheckLabel(uiLabels.sizeLimits),
        gearRestriction: getIconCheckLabel(uiLabels.gearRestriction),
        speciesRestriction: getIconCheckLabel(uiLabels.speciesRestriction),
        noTake: getIconCheckLabel(uiLabels.noTake),
      })),
    [managementRegimeRecordsForUiDisplay, currentProjectPath],
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
    key: `${currentUser.id}-managementRegimesTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.name.props.children', 'values.estYear']

    const queryTerms = splitSearchQueryStrings(query)

    if (!queryTerms || !queryTerms.length) {
      return rows
    }

    return getTableFilteredRows(rows, keys, queryTerms)
  }, [])

  const getDataForCSV = useMemo(() => {
    const managementPartiesChoices = managementParties?.data

    return managementRegimeRecordsForUiDisplay.map((site) => {
      const governance = site.parties
        .map((party) => getObjectById(managementPartiesChoices, party)?.name)
        .join(', ')

      const isPartialRestrict =
        site.periodic_closure ||
        site.size_limits ||
        site.gear_restriction ||
        site.species_restriction ||
        site.access_restriction

      const no_take = site.no_take && 'No Take'
      const open_access = site.open_access && 'Open Access'
      const partial_restrictions =
        isPartialRestrict &&
        `${[
          site.periodic_closure && 'Periodic Closures',
          site.size_limits && 'Size Limits',
          site.gear_restriction && 'Gear Restrictions',
          site.species_restriction && 'Species Restrictions',
          site.access_restriction && 'Access Restrictions',
        ].filter((restriction) => restriction)}`

      const rules = open_access || no_take || partial_restrictions || ''

      return {
        Name: site.uiLabels.name,
        'Secondary name': site.name_secondary,
        'Year established': site.uiLabels.estYear,
        Size: site.size,
        Governance: governance,
        'Estimate compliance': site.uiLabels.compliance,
        Rules: rules,
        Notes: site.notes,
      }
    })
  }, [managementRegimeRecordsForUiDisplay, managementParties])

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

  const readOnlyMrsHeaderContent = (
    <>
      <ButtonSecondary>
        <CSVLink
          data={getDataForCSV}
          filename="Export_MRs.csv"
          style={{ margin: 0, textDecoration: 'none' }}
        >
          <IconDownload /> Export MRs
        </CSVLink>
      </ButtonSecondary>
    </>
  )

  const contentViewByRole = isReadOnlyUser ? (
    <>
      <ToolbarButtonWrapper>{readOnlyMrsHeaderContent}</ToolbarButtonWrapper>
    </>
  ) : (
    <>
      <ToolbarButtonWrapper>
        <LinkLooksLikeButtonSecondary to={`${currentProjectPath}/management-regimes/new`}>
          <IconPlus /> New MR
        </LinkLooksLikeButtonSecondary>
        <ButtonSecondary>
          <IconCopy /> Copy MRs from other projects
        </ButtonSecondary>
        {readOnlyMrsHeaderContent}
      </ToolbarButtonWrapper>
    </>
  )

  const table = managementRegimeRecordsForUiDisplay.length ? (
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
                      {...column.getHeaderProps(getTableColumnHeaderProps(column))}
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
    <PageNoData
      mainText={language.pages.managementRegimeTable.noDataText}
      subText={language.pages.managementRegimeTable.noDataExtraText}
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
          <H2>{language.pages.managementRegimeTable.title}</H2>
          <ToolBarRow>
            <FilterSearchToolbar
              name={language.pages.managementRegimeTable.filterToolbarText}
              value={tableUserPrefs.globalFilter}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />
            <ToolbarButtonWrapper>{contentViewByRole}</ToolbarButtonWrapper>
          </ToolBarRow>
        </>
      }
      content={table}
      isPageContentLoading={isLoading}
    />
  )
}

export default ManagementRegimes
