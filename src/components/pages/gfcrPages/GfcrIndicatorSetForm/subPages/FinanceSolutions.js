import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
} from '../../../../generic/Table/reactTableNaturalSort'
import usePersistUserTablePreferences from '../../../../generic/Table/usePersistUserTablePreferences'
import { useCurrentUser } from '../../../../../App/CurrentUserContext'
import { splitSearchQueryStrings } from '../../../../../library/splitSearchQueryStrings'
import { getTableFilteredRows } from '../../../../../library/getTableFilteredRows'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { PAGE_SIZE_DEFAULT } from '../../../../../library/constants/constants'
import { StyledToolbarButtonWrapper } from '../../Gfcr/Gfcr.styles'
import { IconCheck, IconClose, IconPlus } from '../../../../icons'
import { ButtonSecondary, ToolbarButtonWrapper } from '../../../../generic/buttons'
import {
  GenericStickyTableTextWrapTh,
  StickyTableOverflowWrapper,
  TableNavigation,
  Td,
  Th,
  Tr,
} from '../../../../generic/Table/table'
import PageSizeSelector from '../../../../generic/Table/PageSizeSelector'
import PageSelector from '../../../../generic/Table/PageSelector'
import PageUnavailable from '../../../PageUnavailable'
import language from '../../../../../language'
import { H2 } from '../../../../generic/text'
import { ToolBarRow } from '../../../../generic/positioning'
import FilterSearchToolbar from '../../../../FilterSearchToolbar/FilterSearchToolbar'
import { getTableColumnHeaderProps } from '../../../../../library/getTableColumnHeaderProps'
import { TableContentToolbar, StyledTableContentWrapper } from './subPages.styles'
import FinanceSolutionModal from '../modals/FinanceSolutionModal'
import { StyledTableAnchor } from './subPages.styles'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'

const getTable = (getTableProps, headerGroups, getTableBodyProps, page, prepareRow) => {
  return (
    <StickyTableOverflowWrapper>
      <GenericStickyTableTextWrapTh {...getTableProps()}>
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
                      ...{ style: { textAlign: column.align } },
                    })}
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
  )
}

const getIconCheckLabel = (property) => (property ? <IconCheck /> : <IconClose color="red" />)

const FinanceSolutions = ({ indicatorSet, choices, onSubmit }) => {
  const { currentUser } = useCurrentUser()
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [financeSolutionBeingEdited, setFinanceSolutionBeingEdited] = useState()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Finance solution business name',
        accessor: 'name',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: 'Sector',
        accessor: 'sector',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Used an incubator',
        accessor: 'used_an_incubator',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Gender 2X Criteria',
        accessor: 'gender_smart',
        sortType: reactTableNaturalSort,
        align: 'center',
      },
      {
        Header: 'Local enterprise',
        accessor: 'local_enterprise',
        sortType: reactTableNaturalSort,
        align: 'center',
      },
      {
        Header: 'Sustainable finance mechanisms',
        accessor: 'sustainable_finance_mechanisms',
        sortType: reactTableNaturalSort,
      },
    ],
    [],
  )

  const handleEditFinanceSolution = useCallback(
    (event) => {
      event.preventDefault()
      const financeSolution = indicatorSet.finance_solutions.find(
        (financeSolution) => financeSolution.name === event.target.innerText,
      )

      setFinanceSolutionBeingEdited(financeSolution)
      setIsModalOpen(true)
    },
    [indicatorSet.finance_solutions],
  )

  const tableCellData = useMemo(() => {
    if (!choices) {
      return
    }

    return indicatorSet.finance_solutions.map((indicatorSet) => {
      const {
        name,
        sector,
        used_an_incubator,
        gender_smart,
        local_enterprise,
        sustainable_finance_mechanisms,
      } = indicatorSet

      const sectorNames = choices.sectors.data?.find(
        (sectorChoice) => sectorChoice.id === sector,
      ).name
      const incubatorNames = choices.incubatortypes.data?.find(
        (incubatorTypeChoice) => incubatorTypeChoice.id === used_an_incubator,
      ).name
      const sustainableFinanceMechanismNames = sustainable_finance_mechanisms.map((mechanism) => {
        return choices.sustainablefinancemechanisms.data?.find(
          (sfmChoice) => sfmChoice.id === mechanism,
        ).name
      })

      return {
        ...indicatorSet,
        name: (
          <StyledTableAnchor onClick={(event) => handleEditFinanceSolution(event)}>
            {name}
          </StyledTableAnchor>
        ),
        sector: sectorNames,
        used_an_incubator: incubatorNames,
        gender_smart: getIconCheckLabel(gender_smart),
        local_enterprise: getIconCheckLabel(local_enterprise),
        sustainable_finance_mechanisms: sustainableFinanceMechanismNames.join(', '),
      }
    })
  }, [choices, handleEditFinanceSolution, indicatorSet.finance_solutions])

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
    key: `${currentUser && currentUser.id}-gfcrFinanceSolutionsTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback(
    (rows, id, query) => {
      const keys = [
        'values.name.props.children',
        'values.sector',
        'values.used_an_incubator',
        'values.gender_smart',
        'values.local_enterprise',
        'values.sustainable_finance_mechanisms',
      ]

      const queryTerms = splitSearchQueryStrings(query)
      const filteredRows =
        !queryTerms || !queryTerms.length ? rows : getTableFilteredRows(rows, keys, queryTerms)

      const filteredRowNames = filteredRows.map((row) => row.original.name)
      const filteredFinanceSolutions = indicatorSet.finance_solutions.filter((financeSolution) =>
        filteredRowNames.includes(financeSolution.name),
      )

      setSearchFilteredRowsLength(filteredFinanceSolutions.length)

      return filteredRows
    },
    [indicatorSet.finance_solutions],
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
    state: { pageIndex, pageSize, sortBy, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: {
        pageSize: tableUserPrefs.pageSize ? tableUserPrefs.pageSize : PAGE_SIZE_DEFAULT,
        sortBy: tableUserPrefs.sortBy,
        globalFilter: tableUserPrefs.globalFilter,
      },
      globalFilter: tableGlobalFilters,
      // Disables requirement to hold shift to enable multi-sort
      isMultiSortEvent: () => true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => {
    setPageSize(Number(e.target.value))
  }

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const _setFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: globalFilter })
  }, [globalFilter, handleSetTableUserPrefs])

  const _setPageSizePrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'pageSize', currentValue: pageSize })
  }, [pageSize, handleSetTableUserPrefs])

  const handleAddFinanceSolution = (event) => {
    event.preventDefault()
    setIsModalOpen(true)
  }

  const handleFinanceSolutionModalDismiss = (resetForm) => {
    resetForm()
    setFinanceSolutionBeingEdited()
    setIsModalOpen(false)
  }

  const toolbarButtons = (
    <>
      <StyledToolbarButtonWrapper>
        <ButtonSecondary onClick={(event) => handleAddFinanceSolution(event)}>
          <IconPlus /> Add Finance Solution
        </ButtonSecondary>
      </StyledToolbarButtonWrapper>
    </>
  )

  const table = indicatorSet.finance_solutions.length ? (
    <div>
      {getTable(getTableProps, headerGroups, getTableBodyProps, page, prepareRow)}
      <TableNavigation>
        <PageSizeSelector
          onChange={handleRowsNumberChange}
          pageSize={pageSize}
          pageSizeOptions={[15, 50, 100]}
          pageType="site"
          unfilteredRowLength={indicatorSet.finance_solutions.length}
          searchFilteredRowLength={searchFilteredRowsLength}
          isSearchFilterEnabled={!!globalFilter?.length}
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
    </div>
  ) : (
    <PageUnavailable
      mainText={language.pages.gfcrFinanceSolutionsTable.noDataMainText}
      subText={language.pages.gfcrFinanceSolutionsTable.noDataSubText}
    />
  )

  return (
    <>
      <TableContentToolbar>
        <H2>{language.pages.gfcrFinanceSolutionsTable.title}</H2>
        <ToolBarRow>
          <FilterSearchToolbar
            name={language.pages.gfcrFinanceSolutionsTable.filterToolbarText}
            disabled={indicatorSet.finance_solutions.length === 0}
            globalSearchText={globalFilter || ''}
            handleGlobalFilterChange={handleGlobalFilterChange}
          />
          <ToolbarButtonWrapper>{toolbarButtons}</ToolbarButtonWrapper>
        </ToolBarRow>
      </TableContentToolbar>
      <StyledTableContentWrapper>{table}</StyledTableContentWrapper>
      <FinanceSolutionModal
        isOpen={isModalOpen}
        financeSolution={financeSolutionBeingEdited}
        choices={choices}
        onDismiss={handleFinanceSolutionModalDismiss}
        onSubmit={onSubmit}
      />
    </>
  )
}

FinanceSolutions.propTypes = {
  indicatorSet: PropTypes.object.isRequired,
  choices: choicesPropType.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default FinanceSolutions
