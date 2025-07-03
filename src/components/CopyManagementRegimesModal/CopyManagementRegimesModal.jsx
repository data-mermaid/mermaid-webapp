import { toast } from 'react-toastify'
import { usePagination, useSortBy, useGlobalFilter, useTable, useRowSelect } from 'react-table'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
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
import { IconCheck, IconCopy } from '../icons'
import Modal, {
  ModalLoadingIndicatorWrapper,
  ModalTableOverflowWrapper,
  RightFooter,
} from '../generic/Modal/Modal'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { getToastArguments } from '../../library/getToastArguments'
import language from '../../language'
import PageSelector from '../generic/Table/PageSelector'
import { reactTableNaturalSort } from '../generic/Table/reactTableNaturalSort'
import usePersistUserTablePreferences from '../generic/Table/usePersistUserTablePreferences'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { pluralize } from '../../library/strings/pluralize'
import FilterSearchToolbar from '../FilterSearchToolbar/FilterSearchToolbar'
import { splitSearchQueryStrings } from '../../library/splitSearchQueryStrings'
import { getTableFilteredRows } from '../../library/getTableFilteredRows'
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

const CopyManagementRegimesModal = ({ onDismiss, addCopiedMRsToManagementRegimeTable }) => {
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isMounted = useIsMounted()

  const [isCopyMRsLoading, setIsCopyMRsLoading] = useState(false)
  const [isModalContentLoading, setIsModalContentLoading] = useState(true)
  const [isViewSelectedOnly, setIsViewSelectedOnly] = useState(false)
  const [managementRegimeRecords, setManagementRegimeRecords] = useState([])
  const [selectedRowIdsForCopy, setSelectedRowIdsForCopy] = useState([])

  const _getManagementRegimeRecords = useEffect(() => {
    if (!isAppOnline) {
      setIsModalContentLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getManagementRegimesExcludedInCurrentProjectByPage(projectId)
        .then((managementRegimesResponse) => {
          if (isMounted.current) {
            setManagementRegimeRecords(managementRegimesResponse)
            setIsModalContentLoading(false)
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
  }, [
    databaseSwitchboardInstance,
    projectId,
    isAppOnline,
    isMounted,
    handleHttpResponseError,
  ])

  const getIconCheckLabel = (property) => property && <IconCheck />

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
        Header: 'Name',
        accessor: 'name',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Project',
        accessor: 'projectName',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Year Est.',
        accessor: 'estYear',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Open Access',
        accessor: 'openAccess',
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
        Header: 'Access Restrictions',
        accessor: 'accessRestriction',
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
      managementRegimeRecords.map(
        ({
          access_restriction,
          est_year,
          gear_restriction,
          id,
          name,
          no_take,
          open_access,
          periodic_closure,
          project_name,
          size_limits,
          species_restriction,
        }) => ({
          id,
          name,
          projectName: project_name,
          estYear: est_year,
          openAccess: getIconCheckLabel(open_access),
          periodicClosure: getIconCheckLabel(periodic_closure),
          sizeLimits: getIconCheckLabel(size_limits),
          gearRestriction: getIconCheckLabel(gear_restriction),
          accessRestriction: getIconCheckLabel(access_restriction),
          speciesRestriction: getIconCheckLabel(species_restriction),
          noTake: getIconCheckLabel(no_take),
        }),
      ),
    [managementRegimeRecords],
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
    key: `${currentUser.id}-copyManagementRegimesTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.name', 'values.estYear', 'values.projectName']

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
        pageSize: 5,
        sortBy: tableUserPrefs.sortBy,
      },
      autoResetSelectedRows: false,
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

  const copySelectedManagementRegimes = () => {
    setIsCopyMRsLoading(true)

    databaseSwitchboardInstance
      .copyManagementRegimesToProject(projectId, selectedRowIdsForCopy)
      .then((response) => {
        const copiedManagementRegimesCount = response.length
        const copiedManagementRegimesMsg = pluralize(
          copiedManagementRegimesCount,
          'management regime',
          'management regimes',
        )

        toast.success(
          ...getToastArguments(
            `Added ${copiedManagementRegimesCount} ${copiedManagementRegimesMsg}`,
          ),
        )
        addCopiedMRsToManagementRegimeTable(response)
        setIsCopyMRsLoading(false)
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

  const table = !!managementRegimeRecords.length && (
    <>
      <ModalTableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <Tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const isMultiSortColumn = headerGroup.headers.some(
                    (header) => header.sortedIndex > 0,
                  )

                  return (
                    <Th
                      key={column.id}
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
            {tableBodyRow.map((row) => {
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
    </>
  )

  const toolbarContent = (
    <CopyModalToolbarWrapper>
      <FilterSearchToolbar
        id="copy-management-regimes-filter"
        name={language.pages.copyManagementRegimeTable.filterToolbarText}
        globalSearchText={globalFilter}
        handleGlobalFilterChange={handleGlobalFilterChange}
        type="copy-mr-modal"
      />
      <ViewSelectedOnly htmlFor="viewSelectedOnly">
        <input
          id="viewSelectedOnly"
          type="checkbox"
          checked={isViewSelectedOnly}
          onChange={handleViewSelectedOnlyChange}
        />
        View Selected Only
      </ViewSelectedOnly>
    </CopyModalToolbarWrapper>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonPrimary disabled={!selectedFlatRows.length} onClick={copySelectedManagementRegimes}>
        <IconCopy />
        {language.pages.copyManagementRegimeTable.copyButtonText}
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <>
      <Modal
        onDismiss={onDismiss}
        title={language.pages.copyManagementRegimeTable.title}
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
      {isCopyMRsLoading && <LoadingIndicator />}
    </>
  )
}

CopyManagementRegimesModal.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  addCopiedMRsToManagementRegimeTable: PropTypes.func.isRequired,
}

export default CopyManagementRegimesModal
