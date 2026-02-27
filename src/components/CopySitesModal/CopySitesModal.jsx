import { toast } from 'react-toastify'
import { usePagination, useSortBy, useGlobalFilter, useTable, useRowSelect } from 'react-table'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import {
  Tr,
  Th,
  Td,
  Table,
  ViewSelectedOnly,
  CopyModalToolbarWrapper,
  CopyModalPaginationWrapper,
} from '../generic/Table/table'
import useIsMounted from '../../library/useIsMounted'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { getTableColumnHeaderProps } from '../../library/getTableColumnHeaderProps'
import { IconCopy } from '../icons'
import Modal, {
  ModalLoadingIndicatorWrapper,
  ModalTableOverflowWrapper,
  RightFooter,
} from '../generic/Modal'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import usePersistUserTablePreferences from '../generic/Table/usePersistUserTablePreferences'
import { useCurrentUser } from '../../App/CurrentUserContext'
import LoadingModal from '../LoadingModal/LoadingModal'
import { getToastArguments } from '../../library/getToastArguments'
import { pluralize } from '../../library/strings/pluralize'
import { reactTableNaturalSort } from '../generic/Table/reactTableNaturalSort'
import PageSelector from '../generic/Table/PageSelector'
import FilterSearchToolbar from '../FilterSearchToolbar/FilterSearchToolbar'
import { splitSearchQueryStrings } from '../../library/splitSearchQueryStrings'
import { getTableFilteredRows } from '../../library/getTableFilteredRows'
import CopySitesMap from '../mermaidMap/CopySitesMap'
import LoadingIndicator from '../LoadingIndicator'
import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'

const DEFAULT_PAGE_SIZE = 7

// eslint-disable-next-line react/prop-types, react/display-name
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  )
})

const CopySitesModal = ({ isOpen, onDismiss, addCopiedSitesToSiteTable }) => {
  const { t } = useTranslation()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { currentUser } = useCurrentUser()
  const { projectId } = useParams()
  const { isAppOnline } = useOnlineStatus()
  const isMounted = useIsMounted()
  const [isCopySitesLoading, setIsCopySitesLoading] = useState(false)
  const [isModalContentLoading, setIsModalContentLoading] = useState(true)
  const [isViewSelectedOnly, setIsViewSelectedOnly] = useState(false)
  const [siteRecords, setSiteRecords] = useState([])
  const [selectedRowIdsForCopy, setSelectedRowIdsForCopy] = useState([])
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const siteRecordsUnavailableText = t('sites.data_unavailable')
  const nameHeaderText = t('name')
  const projectHeaderText = t('projects.project')
  const countryHeaderText = t('projects.country', { count: 1 })
  const reefTypeHeaderText = t('sites.reef_type')
  const reefZoneHeaderText = t('sites.reef_zone')
  const exposureHeaderText = t('sites.exposure')

  const _getSiteRecords = useEffect(() => {
    if (!isAppOnline) {
      setIsModalContentLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId && isOpen) {
      databaseSwitchboardInstance
        .getSitesExcludedInCurrentProjectByPage(projectId)
        .then((sitesResponse) => {
          if (isMounted.current) {
            setSiteRecords(sitesResponse)
            setIsModalContentLoading(false)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(siteRecordsUnavailableText))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    handleHttpResponseError,
    isAppOnline,
    isMounted,
    isOpen,
    projectId,
    siteRecordsUnavailableText,
  ])

  const tableColumns = useMemo(
    () => [
      {
        id: 'selection',
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        /* eslint-disable react/prop-types */
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      {
        Header: nameHeaderText,
        accessor: 'name',
        sortType: reactTableNaturalSort,
      },
      {
        Header: projectHeaderText,
        accessor: 'projectName',
        sortType: reactTableNaturalSort,
      },
      {
        Header: countryHeaderText,
        accessor: 'countryName',
        sortType: reactTableNaturalSort,
      },
      {
        Header: reefTypeHeaderText,
        accessor: 'reefType',
        sortType: reactTableNaturalSort,
      },
      {
        Header: reefZoneHeaderText,
        accessor: 'reefZone',
        sortType: reactTableNaturalSort,
      },
      {
        Header: exposureHeaderText,
        accessor: 'exposure',
        sortType: reactTableNaturalSort,
      },
    ],
    [
      nameHeaderText,
      projectHeaderText,
      countryHeaderText,
      reefTypeHeaderText,
      reefZoneHeaderText,
      exposureHeaderText,
    ],
  )

  const tableCellData = useMemo(
    () =>
      siteRecords.map(
        ({
          id,
          name,
          project_name,
          country_name,
          reef_type_name,
          reef_zone_name,
          exposure_name,
          location,
          project,
        }) => ({
          id,
          name,
          projectName: project_name,
          countryName: country_name,
          reefType: reef_type_name,
          reefZone: reef_zone_name,
          exposure: exposure_name,
          location,
          project,
        }),
      ),
    [siteRecords],
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
    key: `${currentUser.id}-copySitesTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.name', 'values.projectName', 'values.countryName']

    const queryTerms = splitSearchQueryStrings(query)
    const filteredRows =
      !queryTerms || !queryTerms.length ? rows : getTableFilteredRows(rows, keys, queryTerms)

    return filteredRows
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
    selectedFlatRows,
    state: { pageIndex, sortBy, globalFilter, selectedRowIds },
    toggleAllRowsSelected,
    setGlobalFilter,
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: {
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: tableUserPrefs.sortBy,
        globalFilter: tableUserPrefs.globalFilter,
      },
      getRowId: (row) => row.id,
      globalFilter: tableGlobalFilters,
      // Disables requirement to hold shift to enable multi-sort
      isMultiSortEvent: () => true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
  )

  const handleViewSelectedOnlyChange = () => {
    setIsViewSelectedOnly(!isViewSelectedOnly)
  }

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const _setFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: globalFilter })
  }, [globalFilter, handleSetTableUserPrefs])

  const _updateSelectedRows = useEffect(() => {
    const rowIds = Object.keys(selectedRowIds)

    setSelectedRowIdsForCopy(rowIds)
  }, [selectedRowIds])

  const _resetToPageOneWhenViewSelectedRowsIsOn = useEffect(() => {
    if (isViewSelectedOnly) {
      gotoPage(0)
    }
  }, [isViewSelectedOnly, gotoPage])

  const copySelectedSites = () => {
    setIsCopySitesLoading(true)

    databaseSwitchboardInstance
      .copySitesToProject(projectId, selectedRowIdsForCopy)
      .then((response) => {
        const copiedSitesCount = response.length
        const copiedSiteMsg = pluralize(copiedSitesCount, 'site', 'sites')

        toast.success(...getToastArguments(`Added ${copiedSitesCount} ${copiedSiteMsg}`))
        addCopiedSitesToSiteTable(response)
        setIsCopySitesLoading(false)
        toggleAllRowsSelected(false)
        onDismiss()
        setIsModalContentLoading(true)
      })
  }

  const selectedRowsPaginationSize = Math.ceil(selectedFlatRows.length / DEFAULT_PAGE_SIZE)
  const pageCount = isViewSelectedOnly ? selectedRowsPaginationSize : pageOptions.length
  const selectedRowsPageStartIndex = pageIndex * DEFAULT_PAGE_SIZE
  const selectedRowsPageEndIndex = selectedRowsPageStartIndex + DEFAULT_PAGE_SIZE
  const tableBodyRow = isViewSelectedOnly
    ? selectedFlatRows.slice(selectedRowsPageStartIndex, selectedRowsPageEndIndex)
    : page

  const table = !!siteRecords.length && (
    <>
      <ModalTableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps()

              return (
                <Tr key={headerGroupKey} {...headerGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const isMultiSortColumn = headerGroup.headers.some(
                      (header) => header.sortedIndex > 0,
                    )
                    const { key: headerKey, ...headerProps } = column.getHeaderProps(
                      getTableColumnHeaderProps(column),
                    )

                    return (
                      <Th
                        key={headerKey}
                        {...headerProps}
                        $isSortedDescending={column.isSortedDesc}
                        $sortedIndex={column.sortedIndex}
                        $isMultiSortColumn={isMultiSortColumn}
                      >
                        {column.render('Header')}
                      </Th>
                    )
                  })}
                </Tr>
              )
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {tableBodyRow.map((row) => {
              prepareRow(row)
              const { key: rowKey, ...rowProps } = row.getRowProps()

              return (
                <Tr key={rowKey} {...rowProps}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps()

                    return (
                      <Td key={cellKey} {...cellProps} $align={cell.column.align}>
                        {cell.render('Cell')}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </tbody>
        </Table>
      </ModalTableOverflowWrapper>
      <CopyModalPaginationWrapper>
        <PageSelector
          onPreviousClick={previousPage}
          previousDisabled={!canPreviousPage}
          onNextClick={nextPage}
          nextDisabled={!canNextPage}
          onGoToPage={gotoPage}
          currentPageIndex={pageIndex}
          pageCount={pageCount}
        />
      </CopyModalPaginationWrapper>
      <CopySitesMap sitesForMapMarkers={selectedFlatRows.map((r) => r.original)} />
    </>
  )

  const toolbarContent = (
    <CopyModalToolbarWrapper>
      <FilterSearchToolbar
        id="copy-sites-filter"
        name={t('filters.by_name_project_country')}
        globalSearchText={globalFilter}
        handleGlobalFilterChange={handleGlobalFilterChange}
        type="copy-site-modal"
      />
      <ViewSelectedOnly htmlFor="viewSelectedOnly">
        <input
          id="viewSelectedOnly"
          type="checkbox"
          checked={isViewSelectedOnly}
          onChange={handleViewSelectedOnlyChange}
        />
        {t('view_selected_only')}
      </ViewSelectedOnly>
    </CopyModalToolbarWrapper>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('buttons.cancel')}</ButtonSecondary>
      <ButtonPrimary disabled={!selectedFlatRows.length} onClick={copySelectedSites}>
        <IconCopy />
        {t('sites.copy_selected_sites_to_project')}
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <>
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        title={t('sites.copy')}
        mainContent={
          isModalContentLoading ? (
            <ModalLoadingIndicatorWrapper>
              <LoadingIndicator />
            </ModalLoadingIndicatorWrapper>
          ) : (
            table
          )
        }
        footerContent={footerContent}
        toolbarContent={!isModalContentLoading && toolbarContent}
      />
      {isCopySitesLoading && <LoadingModal />}
    </>
  )
}

CopySitesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  addCopiedSitesToSiteTable: PropTypes.func.isRequired,
}

export default CopySitesModal
