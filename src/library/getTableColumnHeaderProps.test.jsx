import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { useSortBy, useTable } from 'react-table'
import { getTableColumnHeaderProps } from './getTableColumnHeaderProps'

// A column with no accessor cannot be sorted, which is how the copy modals declare their
// checkbox column. react-table drives the click handler off the same `canSort` flag.
const columns = [
  { Header: 'Select', id: 'selection' },
  { Header: 'Name', accessor: 'name' },
]

const data = [{ name: 'Site A' }, { name: 'Site B' }]

const SortableTable = () => {
  const { getTableProps, headerGroups } = useTable({ columns, data }, useSortBy)

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(getTableColumnHeaderProps(column))}
                key={column.getHeaderProps().key}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
    </table>
  )
}

test('a sortable column header gets a sort tooltip', () => {
  render(<SortableTable />)

  expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('title')
})

test('a column that cannot be sorted gets no sort tooltip', () => {
  render(<SortableTable />)

  expect(screen.getByRole('columnheader', { name: 'Select' })).not.toHaveAttribute('title')
})
