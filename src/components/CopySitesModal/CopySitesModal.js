import { toast } from 'react-toastify'
import { usePagination, useSortBy, useGlobalFilter, useTable, useRowSelect } from 'react-table'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import React, { useState, useEffect, useMemo, useCallback, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Td, Table, TableOverflowWrapper } from '../generic/Table/table'
import useIsMounted from '../../library/useIsMounted'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { getTableColumnHeaderProps } from '../../library/getTableColumnHeaderProps'
import { IconSend } from '../icons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import LoadingModal from '../LoadingModal/LoadingModal'
import { getToastArguments } from '../../library/getToastArguments'
import { pluralize } from '../../library/strings/pluralize'
import language from '../../language'
import PageSelector from '../generic/Table/PageSelector'
import CopySitesMap from '../mermaidMap/CopySitesMap'

const DEFAULT_PAGE_SIZE = 5
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const getSortKey = {
  projectName: 'project__name',
  countryName: 'country__name',
  reefType: 'reef_type__name',
  reefZone: 'reef_zone__name',
  exposure: 'exposure__name',
}

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
  const { projectId } = useParams()
  const { isAppOnline } = useOnlineStatus()
  const isMounted = useIsMounted()
  const [isLoading, setIsLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState()
  const [orderingTerms, setOrderingTerms] = useState()
  const [siteRecords, setSiteRecords] = useState([])
  const [selectedRowsIds, setSelectedRowsIds] = useState([])
  const [controlledPageCount, setControlledPageCount] = useState(0)

  const _getSiteRecords = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId && isOpen) {
      setIsLoading(true)

      databaseSwitchboardInstance
        .getSitesExcludedInCurrentProject(projectId, currentPage, orderingTerms)
        .then((sitesResponse) => {
          if (isMounted.current) {
            const controlledCount = Math.ceil(sitesResponse.count / DEFAULT_PAGE_SIZE)

            setSiteRecords(sitesResponse.results)
            setControlledPageCount(controlledCount)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.siteRecordsUnavailable))
        })
    }
  }, [
    databaseSwitchboardInstance,
    projectId,
    isAppOnline,
    isMounted,
    currentPage,
    orderingTerms,
    isOpen,
  ])

  const handleSortBy = useCallback((sortTerms) => {
    const sortTermQuery = sortTerms
      .map(({ id, desc }) => {
        const sortKey = getSortKey[id] || id

        if (desc) {
          return `-${sortKey}`
        }

        return sortKey
      })
      .join(',')

    setOrderingTerms(sortTermQuery)
  }, [])

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
      },
      {
        Header: 'Project',
        accessor: 'projectName',
      },
      {
        Header: 'Country',
        accessor: 'countryName',
      },
      {
        Header: 'Reef Type',
        accessor: 'reefType',
      },
      {
        Header: 'Reef Zone',
        accessor: 'reefZone',
      },
      {
        Header: 'Exposure',
        accessor: 'exposure',
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

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    selectedFlatRows,
    state: { sortBy, pageIndex, selectedRowIds },
    toggleAllRowsSelected,
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      manualSortBy: true,
      pageCount: controlledPageCount,
      autoResetSelectedRows: false,
      autoResetSelectedCell: false,
      autoResetSelectedColumn: false,
      getRowId: (row) => row.id,
      isMultiSortEvent: () => true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
  )

  const _updateSort = useEffect(() => {
    handleSortBy(sortBy)
  }, [handleSortBy, sortBy])

  const _updateCurrentPage = useEffect(() => {
    const currentPageNo = pageIndex + 1

    setCurrentPage(currentPageNo)
  }, [pageIndex])

  const _updateSelectedRows = useEffect(() => {
    const rowIds = Object.keys(selectedRowIds)

    setSelectedRowsIds(rowIds)
  }, [selectedRowIds])

  const copySelectedSites = () => {
    setIsLoading(true)

    databaseSwitchboardInstance.copySitesToProject(projectId, selectedRowsIds).then((response) => {
      const copiedSitesCount = response.length
      const copiedSiteMsg = pluralize(copiedSitesCount, 'site', 'sites')

      toast.success(...getToastArguments(`Add ${copiedSitesCount} ${copiedSiteMsg}`))
      addCopiedSitesToSiteTable(response)
      setIsLoading(false)
      toggleAllRowsSelected(false)
      onDismiss()
    })
  }

  const table = siteRecords.length && (
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
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonPrimary onClick={copySelectedSites}>
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
        title="Copy Sites"
        mainContent={table}
        footerContent={footerContent}
      />
      {isLoading && <LoadingModal />}
    </>
  )
}

CopySitesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  addCopiedSitesToSiteTable: PropTypes.func.isRequired,
}

export default CopySitesModal
