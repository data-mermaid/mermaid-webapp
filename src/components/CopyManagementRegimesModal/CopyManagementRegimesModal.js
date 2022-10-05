import { toast } from 'react-toastify'
import { usePagination, useSortBy, useTable, useRowSelect } from 'react-table'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import React, { useState, useEffect, useMemo, useCallback, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Td, Table, TableOverflowWrapper } from '../generic/Table/table'
import useIsMounted from '../../library/useIsMounted'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { getTableColumnHeaderProps } from '../../library/getTableColumnHeaderProps'
import { IconCheck, IconSend } from '../icons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import LoadingModal from '../LoadingModal/LoadingModal'
import { getToastArguments } from '../../library/getToastArguments'
import language from '../../language'
import PageSelector from '../generic/Table/PageSelector'
import { reactTableNaturalSort } from '../generic/Table/reactTableNaturalSort'
import usePersistUserTablePreferences from '../generic/Table/usePersistUserTablePreferences'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { pluralize } from '../../library/strings/pluralize'

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

const CopyManagementRegimesModal = ({ isOpen, onDismiss, addCopiedMRsToManagementRegimeTable }) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const { isAppOnline } = useOnlineStatus()
  const isMounted = useIsMounted()
  const { currentUser } = useCurrentUser()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRowsIds, setSelectedRowsIds] = useState([])
  const [managementRegimeRecords, setManagementRegimeRecords] = useState([])

  const _getManagementRegimeRecords = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId && isOpen) {
      databaseSwitchboardInstance
        .getManagementRegimesExcludedInCurrentProject(projectId)
        .then((managementRegimesResponse) => {
          if (isMounted.current) {
            setManagementRegimeRecords(managementRegimesResponse.results)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.siteRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isAppOnline, isMounted, isOpen])

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
          id,
          name,
          est_year,
          open_access,
          periodic_closure,
          size_limits,
          gear_restriction,
          access_restriction,
          species_restriction,
          no_take,
        }) => ({
          id,
          name,
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
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser.id}-copyManagementRegimesTable`,
    defaultValue: tableDefaultPrefs,
  })

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
    state: { pageIndex, sortBy, selectedRowIds },
    toggleAllRowsSelected,
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
      // Disables requirement to hold shift to enable multi-sort
      isMultiSortEvent: () => true,
    },
    useSortBy,
    usePagination,
    useRowSelect,
  )

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const _updateSelectedRows = useEffect(() => {
    const rowIds = Object.keys(selectedRowIds)

    setSelectedRowsIds(rowIds)
  }, [selectedRowIds])

  const copySelectedManagementRegimes = () => {
    setIsLoading(true)

    databaseSwitchboardInstance
      .copyManagementRegimesToProject(projectId, selectedRowsIds)
      .then((response) => {
        console.log(response)
        const copiedManagementRegimesCount = response.length
        const copiedManagementRegimesMsg = pluralize(
          copiedManagementRegimesCount,
          'management regime',
          'management regimes',
        )

        toast.success(
          ...getToastArguments(`Add ${copiedManagementRegimesCount} ${copiedManagementRegimesMsg}`),
        )
        addCopiedMRsToManagementRegimeTable(response)
        setIsLoading(false)
        toggleAllRowsSelected(false)
        onDismiss()
      })
  }

  const table = managementRegimeRecords.length && (
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
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonPrimary onClick={copySelectedManagementRegimes}>
        <IconSend />
        Copy selected MRs to project
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <>
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        title="Copy Management Regimes"
        mainContent={table}
        footerContent={footerContent}
      />
      {isLoading && <LoadingModal />}
    </>
  )
}

CopyManagementRegimesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  addCopiedMRsToManagementRegimeTable: PropTypes.func.isRequired,
}

export default CopyManagementRegimesModal
