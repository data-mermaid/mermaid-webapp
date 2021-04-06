import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { usePagination, useSortBy, useTable } from 'react-table'
import React, { useEffect, useMemo, useState } from 'react'

import { databaseGatewayPropTypes } from '../../../App/mermaidData/DatabaseGateway'
import { H3 } from '../../generic/text'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import { RowSpaceBetween } from '../../generic/positioning'
import {
  Table,
  Tr,
  Th,
  Td,
  TableOverflowWrapper,
} from '../../generic/Table/table'
import AddSampleUnitButton from './AddSampleUnitButton'
import language from '../../../language'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import ContentPageLayout from '../../ContentPageLayout'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'

const TopBar = () => (
  <>
    <H3>Collect Records</H3>
    <RowSpaceBetween>
      <div>Future filter</div> <AddSampleUnitButton />
    </RowSpaceBetween>
  </>
)

const Collect = ({ databaseGatewayInstance }) => {
  const [collectRecordsForUiDisplay, setCollectRecordsForUiDisplay] = useState(
    [],
  )
  const [isLoading, setIsLoading] = useState(true)

  const _getCollectRecords = useEffect(() => {
    databaseGatewayInstance
      .getCollectRecordsForUIDisplay()
      .then((records) => {
        setCollectRecordsForUiDisplay(records)
        setIsLoading(false)
      })
      .catch(() => {
        toast.error(language.error.collectRecordsUnavailable)
      })
  }, [databaseGatewayInstance])

  const currentProjectPath = useCurrentProjectPath()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Method',
        accessor: 'method',
        sortType: (rowA, rowB, columnId) => {
          // this sort is different, because the data values will be children of react nodes
          return rowA.original[columnId].props.children.localeCompare(
            rowB.original[columnId].props.children,
            'en',
            { numeric: true, caseFirst: 'upper' },
          )
        },
      },
      {
        Header: 'Site',
        accessor: 'site',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Management',
        accessor: 'management',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Sample Unit #',
        accessor: 'sampleUnitNumber',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Size',
        accessor: 'size',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Depth (m)',
        accessor: 'depth',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Sample Date',
        accessor: 'sampleDate',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Observers',
        accessor: 'observers',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Status',
        accessor: 'status',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Synced',
        accessor: 'synced',
        sortType: reactTableNaturalSort,
      },
    ],
    [],
  )

  const tableCellData = useMemo(
    () =>
      collectRecordsForUiDisplay.map(({ id, data, uiLabels }) => ({
        method: (
          <Link to={`${currentProjectPath}/collecting/${data.protocol}/${id}`}>
            {uiLabels.protocol}
          </Link>
        ),
        site: uiLabels.site,
        management: uiLabels.management,
        sampleUnitNumber: 'wip',
        size: 'wip',
        depth: 'wip',
        sampleDate: 'wip',
        observers: 'wip',
        status: 'wip',
        synced: 'wip',
      })),
    [collectRecordsForUiDisplay, currentProjectPath],
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
      <RowSpaceBetween>
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
      </RowSpaceBetween>
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

Collect.propTypes = {
  databaseGatewayInstance: databaseGatewayPropTypes.isRequired,
}

export default Collect
