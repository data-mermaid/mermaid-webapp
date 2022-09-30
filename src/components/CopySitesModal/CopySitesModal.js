import { toast } from 'react-toastify'
import { usePagination, useSortBy, useGlobalFilter, useTable, useRowSelect } from 'react-table'
import { useParams } from 'react-router-dom'
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
import PaginationForCopy from '../generic/Table/PaginationForCopy'
import { getToastArguments } from '../../library/getToastArguments'
import { pluralize } from '../../library/strings/pluralize'

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

  const [currentPage, setCurrentPage] = useState(1)
  const [orderingTerms, setOrderingTerms] = useState()
  const [siteRecords, setSiteRecords] = useState([])
  const [siteRecordCount, setSiteRecordCount] = useState(0)
  const [selectedRowsIds, setSelectedRowsIds] = useState([])

  const _getSiteRecords = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getSitesExcludedInCurrentProject(projectId, currentPage, orderingTerms)
        .then((sitesResponse) => {
          if (isMounted.current) {
            setSiteRecordCount(sitesResponse.count)
            setSiteRecords(sitesResponse.results)
            setIsLoading(false)
          }
        })
    }
  }, [databaseSwitchboardInstance, projectId, isAppOnline, isMounted, currentPage, orderingTerms])

  const pageChangeHandler = (pageNo) => {
    setCurrentPage(pageNo)
  }

  const handleServerSort = useCallback((sortTerms) => {
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
        }) => ({
          id,
          name,
          projectName: project_name,
          countryName: country_name,
          reefType: reef_type_name,
          reefZone: reef_zone_name,
          exposure: exposure_name,
          location,
        }),
      ),
    [siteRecords],
  )

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { sortBy },
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      manualPagination: true,
      manualSortBy: true,
      isMultiSortEvent: () => true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
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
        ...columns,
      ])
    },
  )

  useEffect(() => {
    handleServerSort(sortBy)
  }, [handleServerSort, sortBy])

  useEffect(() => {
    const rowIds = selectedFlatRows.map((rowInfo) => rowInfo.original.id)

    setSelectedRowsIds(rowIds)
  }, [selectedFlatRows])

  const copySelectedSites = () => {
    setIsLoading(true)

    databaseSwitchboardInstance.copySitesToProject(projectId, selectedRowsIds).then((response) => {
      const copiedSitesCount = response.length
      const copiedSiteMsg = pluralize(copiedSitesCount, 'site', 'sites')

      toast.success(...getToastArguments(`Add ${copiedSitesCount} ${copiedSiteMsg}`))
      addCopiedSitesToSiteTable(response)
      setIsLoading(false)
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
            {rows.map((row) => {
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
      <PaginationForCopy
        totalRows={siteRecordCount}
        currentPage={currentPage}
        pageChangeHandler={pageChangeHandler}
      />
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
