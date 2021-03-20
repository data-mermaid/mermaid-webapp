import { Link } from 'react-router-dom'
import { usePagination, useSortBy, useTable } from 'react-table'
import React, { useMemo } from 'react'

import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import SubLayout2 from '../../SubLayout2'
import { mermaidDataPropType } from '../../../library/mermaidData/useMermaidData'
import { H3 } from '../../generic/text'
import { RowSpaceBetween } from '../../generic/positioning'

import AddSampleUnitButton from './AddSampleUnitButton'

import { Table, Tr, Th, Td } from '../../generic/Table/table'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import PageSelector from '../../generic/Table/PageSelector'

const TopBar = () => (
  <>
    <H3>Collect Records</H3>
    <RowSpaceBetween>
      <div>Future filter</div> <AddSampleUnitButton />
    </RowSpaceBetween>
  </>
)

const Collect = ({ mermaidData }) => {
  const { collectRecords } = mermaidData
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
        Header: 'size',
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
      collectRecords.map(({ id, data }) => ({
        method: (
          <Link to={`${currentProjectPath}/collecting/${data.protocol}/${id}`}>
            {mermaidData.getCollectRecordMethodLabel(data.protocol)}
          </Link>
        ),
        site: mermaidData.getSite(data.sample_event.site).name,
        management: mermaidData.getManagementRegime(
          data.sample_event.management,
        ).name,
        sampleUnitNumber: 'wip',
        size: 'wip',
        depth: 'wip',
        sampleDate: 'wip',
        observers: 'wip',
        status: 'wip',
        synced: 'wip',
      })),
    [collectRecords, currentProjectPath, mermaidData],
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
    <SubLayout2
      // content={<CollectRecordList mermaidData={mermaidData} />}
      toolbar={<TopBar />}
      content={table}
    />
  )
}

Collect.propTypes = {
  mermaidData: mermaidDataPropType.isRequired,
}

export default Collect
