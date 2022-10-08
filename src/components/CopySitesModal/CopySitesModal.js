import { toast } from 'react-toastify'
import { usePagination, useSortBy, useGlobalFilter, useTable, useRowSelect } from 'react-table'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import React, { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Td, Table, TableOverflowWrapper } from '../generic/Table/table'
import useIsMounted from '../../library/useIsMounted'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { getTableColumnHeaderProps } from '../../library/getTableColumnHeaderProps'
import { IconSend } from '../icons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import usePersistUserTablePreferences from '../generic/Table/usePersistUserTablePreferences'
import { useCurrentUser } from '../../App/CurrentUserContext'
import LoadingModal from '../LoadingModal/LoadingModal'
import { getToastArguments } from '../../library/getToastArguments'
import { pluralize } from '../../library/strings/pluralize'
import language from '../../language'
import { reactTableNaturalSort } from '../generic/Table/reactTableNaturalSort'
import PageSelector from '../generic/Table/PageSelector'
import FilterSearchToolbar from '../FilterSearchToolbar/FilterSearchToolbar'
import { ToolBarRow } from '../generic/positioning'
import PageUnavailable from '../pages/PageUnavailable'
import { splitSearchQueryStrings } from '../../library/splitSearchQueryStrings'
import { getTableFilteredRows } from '../../library/getTableFilteredRows'
import CopySitesMap from '../mermaidMap/CopySitesMap'

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

// eslint-disable-next-line react/prop-types
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
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { currentUser } = useCurrentUser()
  const { projectId } = useParams()
  const { isAppOnline } = useOnlineStatus()
  const isMounted = useIsMounted()
  const [isCopySitesLoading, setIsCopySitesLoading] = useState(false)
  const [isModalContentLoading, setIsModalContentLoading] = useState(true)

  const [siteRecords, setSiteRecords] = useState([])
  const [selectedRowsIds, setSelectedRowsIds] = useState([])

  const _getSiteRecords = useEffect(() => {
    if (!isAppOnline) {
      setIsModalContentLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId && isOpen) {
      databaseSwitchboardInstance
        .getSitesExcludedInCurrentProject(projectId)
        .then((sitesResponse) => {
          if (isMounted.current) {
            setSiteRecords(sitesResponse.results)
            setIsModalContentLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.siteRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isAppOnline, isMounted, isOpen])

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
        Header: 'Country',
        accessor: 'countryName',
        sortType: reactTableNaturalSort,
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
        pageSize: 5,
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

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const _setFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: globalFilter })
  }, [globalFilter, handleSetTableUserPrefs])

  const _updateSelectedRows = useEffect(() => {
    const rowIds = Object.keys(selectedRowIds)

    setSelectedRowsIds(rowIds)
  }, [selectedRowIds])

  const copySelectedSites = () => {
    setIsCopySitesLoading(true)

    databaseSwitchboardInstance.copySitesToProject(projectId, selectedRowsIds).then((response) => {
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

  const table = siteRecords.length ? (
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
        </Table>
      </TableOverflowWrapper>
      <PaginationWrapper>
        <PageSelector
          onPreviousClick={previousPage}
          previousDisabled={!canPreviousPage}
          onNextClick={nextPage}
          nextDisabled={!canNextPage}
          onGoToPage={gotoPage}
          currentPageIndex={pageIndex}
          pageCount={pageOptions.length}
        />
      </PaginationWrapper>
      <CopySitesMap sitesForMapMarkers={selectedFlatRows.map((r) => r.original)} />
    </>
  ) : (
    <PageUnavailable
      mainText={language.table.noFilterResults}
      subText={language.table.noFilterResultsSubText}
    />
  )

  const toolbarContent = (
    <ToolBarRow>
      <FilterSearchToolbar
        name={language.pages.copySiteTable.filterToolbarText}
        value={tableUserPrefs.globalFilter}
        handleGlobalFilterChange={handleGlobalFilterChange}
      />
    </ToolBarRow>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonPrimary disabled={!selectedFlatRows.length} onClick={copySelectedSites}>
        <IconSend />
        Copy selected sites to project
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <>
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        title={language.pages.copySiteTable.title}
        mainContent={isModalContentLoading ? 'Loading...' : table}
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
