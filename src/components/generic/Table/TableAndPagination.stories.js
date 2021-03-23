import { usePagination, useSortBy, useTable } from 'react-table'
import React from 'react'
import { action } from '@storybook/addon-actions'
import PageSelector from './PageSelector'
import { Table, Td, Th, Tr } from './table'
import PageSizeSelectorComponent from './PageSizeSelector'
import { reactTableNaturalSort } from './reactTableNaturalSort'

export default {
  title: 'TableAndPagination',
}

export const PageSizeSelector = () => {
  return (
    <PageSizeSelectorComponent
      onChange={action('on change')}
      pageSize={2}
      pageSizeOptions={[1, 2, 50, 437]}
    />
  )
}
export const PageSelectorWith8OrLessPages = () => (
  <PageSelector
    currentPageIndex={0}
    nextDisabled={false}
    onGoToPage={action('page click')}
    onNextClick={action('next click')}
    onPreviousClick={action('prev click')}
    pageCount={8}
    previousDisabled={false}
  />
)

export const PageSelectorWithMoreThan8Pages = () => (
  <PageSelector
    currentPageIndex={0}
    nextDisabled={false}
    onGoToPage={action('page click')}
    onNextClick={action('next click')}
    onPreviousClick={action('prev click')}
    pageCount={9}
    previousDisabled={false}
  />
)

// eslint-disable-next-line react/prop-types
const WiredUpPageSelector = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Column 1',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Column 2',
        accessor: 'col2',
      },
    ],
    [],
  )

  const {
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable({ columns, data, initialState: { pageSize: 1 } }, usePagination)

  return (
    <PageSelector
      onPreviousClick={previousPage}
      previousDisabled={!canPreviousPage}
      onNextClick={nextPage}
      nextDisabled={!canNextPage}
      onGoToPage={gotoPage}
      currentPageIndex={pageIndex}
      pageCount={pageOptions.length}
    />
  )
}

export const PageSelectorWith8OrLessPagesUsingHook = () => (
  <WiredUpPageSelector
    data={[
      {
        col1: 'Hello',
        col2: 'World',
      },
      {
        col1: 'react-table',
        col2: 'rocks',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
    ]}
  />
)

export const PageSelectorWithMoreThan8PagesUsingHook = () => (
  <WiredUpPageSelector
    data={[
      {
        col1: 'Hello',
        col2: 'World',
      },
      {
        col1: 'react-table',
        col2: 'rocks',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
      {
        col1: 'OTHER STUFF',
        col2: 'MEOW',
      },
      {
        col1: 'OTHER STUFF',
        col2: 'MEOW',
      },
      {
        col1: 'OTHER STUFF',
        col2: 'MEOW',
      },
      {
        col1: 'OTHER STUFF',
        col2: 'MEOW',
      },
    ]}
  />
)

export const SortablePaginatedTable = () => {
  const data = React.useMemo(
    () => [
      {
        col1: 'zoo',
        col2: '1',
      },
      {
        col1: 'cars',
        col2: 'Grrrreat',
      },
      {
        col1: '1',
        col2: 'Good',
      },
      {
        col1: '11',
        col2: 'Bats',
      },
      {
        col1: '111',
        col2: 'bats',
      },
      {
        col1: '2',
        col2: 'bars',
      },
      {
        col1: 'cats',
        col2: 'Avalanche',
      },
      {
        col1: '11111',
        col2: 'avalanche',
      },
      {
        col1: 'Cats',
        col2: 'owl',
      },
      {
        col1: 'Cart',
        col2: '999',
      },
      {
        col1: 'Cars',
        col2: '9',
      },
      {
        col1: 'Foo',
        col2: '20',
      },
    ],
    [],
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Sort Naturally with Manual Sort Function',
        accessor: 'col1', // accessor is the "key" in the data
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Default React Tables Sort (weird)',
        accessor: 'col2',
      },
    ],
    [],
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
    { columns, data, initialState: { pageSize: 5 } },
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => {
    setPageSize(Number(e.target.value))
  }

  return (
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
                  return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                })}
              </Tr>
            )
          })}
        </tbody>
      </Table>
      <PageSelector
        onPreviousClick={previousPage}
        previousDisabled={!canPreviousPage}
        onNextClick={nextPage}
        nextDisabled={!canNextPage}
        onGoToPage={gotoPage}
        currentPageIndex={pageIndex}
        pageCount={pageOptions.length}
      />

      <PageSizeSelector
        onChange={handleRowsNumberChange}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 15]}
      />
    </>
  )
}
