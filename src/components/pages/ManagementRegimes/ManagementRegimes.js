import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState } from 'react'

import { usePagination, useSortBy, useTable } from 'react-table'
import { ContentPageLayout } from '../../Layout'
import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import { H2 } from '../../generic/text'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import { RowSpaceBetween } from '../../generic/positioning'
import language from '../../../language'
import { IconCheck, IconPlus, IconCopy, IconDownload } from '../../icons'
import {
  Table,
  Tr,
  Th,
  Td,
  TableOverflowWrapper,
  TableNavigation,
} from '../../generic/Table/table'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import { ButtonSecondary } from '../../generic/buttons'

const TopBar = () => (
  <>
    <H2>Management Regimes</H2>
    <RowSpaceBetween>
      <div>Future filter</div>{' '}
      <div>
        <ButtonSecondary>
          <IconPlus /> New MR
        </ButtonSecondary>
        <ButtonSecondary>
          <IconCopy /> Copy MRs from other projects
        </ButtonSecondary>
        <ButtonSecondary>
          <IconDownload /> Export MRs
        </ButtonSecondary>
      </div>
    </RowSpaceBetween>
  </>
)
const ManagementRegimes = ({ databaseSwitchboardInstance }) => {
  const [
    managementRegimeRecordsForUiDisplay,
    setManagementRegimeRecordsForUiDisplay,
  ] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const _getManagementRegimeRecords = useEffect(() => {
    let isMounted = true

    databaseSwitchboardInstance
      .getManagementRegimeRecordsForUiDisplay()
      .then((records) => {
        if (isMounted) {
          setManagementRegimeRecordsForUiDisplay(records)
          setIsLoading(false)
        }
      })
      .catch(() => {
        toast.error(language.error.collectRecordsUnavailable)
      })

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance])

  const getIconCheckLabel = (property) => property && <IconCheck />

  const tableColumns = useMemo(
    () => [
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
      managementRegimeRecordsForUiDisplay.map(({ uiLabels }) => ({
        name: uiLabels.name,
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
    [managementRegimeRecordsForUiDisplay],
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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: { pageSize: 10 },
    },
    useSortBy,
    usePagination,
  )
  const handleRowsNumberChange = (e) => {
    setPageSize(Number(e.target.value))
  }

  const table = (
    <>
      <TableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isSorted={column.isSorted}
                    isSortedDescending={column.isSortedDesc}
                  >
                    {column.render('Header')}
                  </Th>
                ))}
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
      <TableNavigation>
        <PageSizeSelector
          onChange={handleRowsNumberChange}
          pageSize={pageSize}
          pageSizeOptions={[10, 50, 100]}
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
  )

  return (
    <ContentPageLayout
      toolbar={<TopBar />}
      content={table}
      isLoading={isLoading}
    />
  )
}

ManagementRegimes.propTypes = {
  databaseSwitchboardInstance: databaseSwitchboardPropTypes.isRequired,
}

export default ManagementRegimes
