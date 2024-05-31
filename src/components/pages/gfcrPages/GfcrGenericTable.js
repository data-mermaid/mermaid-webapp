import React from 'react'
import PropTypes from 'prop-types'
import {
  GenericStickyTableTextWrapTh,
  StickyTableOverflowWrapper,
  TableNavigation,
  Td,
  Th,
  Tr,
} from '../../generic/Table/table'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import PageSelector from '../../generic/Table/PageSelector'

const GfcrGenericTable = ({
  getTableProps,
  headerGroups,
  getTableBodyProps,
  page,
  prepareRow,
  onPageSizeChange,
  isSearchFilterEnabled,
  previousDisabled,
  nextDisabled,
  currentPageIndex,
  pageSize,
  pageCount,
  unfilteredRowLength,
  searchFilteredRowsLength,
  onPreviousClick,
  onNextClick,
  onGoToPage,
}) => {
  const tableProps = getTableProps()

  return (
    <>
      <StickyTableOverflowWrapper>
        <GenericStickyTableTextWrapTh key={tableProps.key} {...tableProps}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <Tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const isMultiSortColumn = headerGroup.headers.some(
                    (header) => header.sortedIndex > 0,
                  )
                  const ThClassName = column.parent ? column.parent.id : undefined

                  return (
                    <Th
                      {...column.getHeaderProps({
                        ...getTableColumnHeaderProps(column),
                      })}
                      align={column.align}
                      key={column.id}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                      isMultiSortColumn={isMultiSortColumn}
                      className={ThClassName}
                    >
                      <span>{column.render('Header')}</span>
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
                <Tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td key={cell.id} {...cell.getCellProps()} align={cell.column.align}>
                        {cell.render('Cell')}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </tbody>
        </GenericStickyTableTextWrapTh>
      </StickyTableOverflowWrapper>
      <TableNavigation>
        <PageSizeSelector
          onChange={onPageSizeChange}
          pageSize={pageSize}
          pageSizeOptions={[15, 50, 100]}
          pageType="site"
          unfilteredRowLength={unfilteredRowLength}
          searchFilteredRowLength={searchFilteredRowsLength}
          isSearchFilterEnabled={isSearchFilterEnabled}
        />
        <PageSelector
          onPreviousClick={onPreviousClick}
          previousDisabled={previousDisabled}
          onNextClick={onNextClick}
          nextDisabled={nextDisabled}
          onGoToPage={onGoToPage}
          currentPageIndex={currentPageIndex}
          pageCount={pageCount}
        />
      </TableNavigation>
    </>
  )
}

GfcrGenericTable.propTypes = {
  getTableProps: PropTypes.func.isRequired,
  headerGroups: PropTypes.array.isRequired,
  getTableBodyProps: PropTypes.func.isRequired,
  page: PropTypes.array.isRequired,
  prepareRow: PropTypes.func.isRequired,
  isSearchFilterEnabled: PropTypes.bool.isRequired,
  previousDisabled: PropTypes.bool.isRequired,
  nextDisabled: PropTypes.bool.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  searchFilteredRowsLength: PropTypes.number,
  unfilteredRowLength: PropTypes.number.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  onPreviousClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onGoToPage: PropTypes.func.isRequired,
}

export default GfcrGenericTable
