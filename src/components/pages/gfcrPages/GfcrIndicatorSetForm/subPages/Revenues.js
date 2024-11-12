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
import { IconPlus } from '../../../../icons'
import { ButtonSecondary, ToolbarButtonWrapper } from '../../../../generic/buttons'
import PageUnavailable from '../../../PageUnavailable'
import language from '../../../../../language'
import { ToolBarRow } from '../../../../generic/positioning'
import FilterSearchToolbar from '../../../../FilterSearchToolbar/FilterSearchToolbar'
import { TableContentToolbar, StyledTableContentWrapper } from './subPages.styles'
import { StyledTableAnchor } from './subPages.styles'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import GfcrGenericTable from '../../GfcrGenericTable'
import IconCheckLabel from './IconCheckLabel'
import RevenueModal from '../modals/RevenueModal'

const tableLanguage = language.pages.gfcrRevenuesTable

const Revenues = ({ indicatorSet, setIndicatorSet, choices, setSelectedNavItem, displayHelp }) => {
  const { currentUser } = useCurrentUser()
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [revenueBeingEdited, setRevenueBeingEdited] = useState()

  const revenues = useMemo(() => {
    return indicatorSet.finance_solutions.flatMap((fs) => fs.revenues)
  }, [indicatorSet.finance_solutions])

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Business / Finance Solution',
        accessor: 'finance_solution',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: 'Revenue Type',
        accessor: 'revenue_type',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Sustainable Revenue Stream',
        accessor: 'sustainable_revenue_stream',
        sortType: reactTableNaturalSort,
        align: 'center',
      },
      {
        Header: 'Revenue Amount',
        accessor: 'revenue_amount',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
    ],
    [],
  )

  const handleEditRevenue = useCallback(
    (event) => {
      event.preventDefault()
      const revenue = revenues.find((rev) => rev.id === event.target.id)

      setRevenueBeingEdited(revenue)
      setIsModalOpen(true)
    },
    [revenues],
  )

  const tableCellData = useMemo(() => {
    if (!choices || !revenues) {
      return
    }

    return revenues.map((revenue) => {
      const { id, finance_solution, revenue_type, sustainable_revenue_stream, revenue_amount } =
        revenue

      const revenueTypeName = choices.revenuetypes.data?.find(
        (revenueTypeChoice) => revenueTypeChoice.id === revenue_type,
      ).name

      return {
        finance_solution: (
          <StyledTableAnchor id={id} onClick={(event) => handleEditRevenue(event)}>
            {indicatorSet.finance_solutions.find((fs) => fs.id === finance_solution).name}
          </StyledTableAnchor>
        ),
        revenue_type: revenueTypeName,
        sustainable_revenue_stream: <IconCheckLabel isCheck={!!sustainable_revenue_stream} />,
        revenue_amount: `$${revenue_amount}`,
      }
    })
  }, [choices, handleEditRevenue, indicatorSet.finance_solutions, revenues])

  const tableDefaultPrefs = useMemo(() => {
    return {
      sortBy: [
        {
          id: 'finance_solution',
          desc: false,
        },
      ],
      globalFilter: '',
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser && currentUser.id}-gfcrRevenuesTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback(
    (rows, id, query) => {
      const keys = [
        'values.finance_solution.props.children',
        'values.revenue_type',
        'values.sustainable_revenue_stream',
        'values.revenue_amount',
      ]

      const queryTerms = splitSearchQueryStrings(query)
      const filteredRows =
        !queryTerms || !queryTerms.length ? rows : getTableFilteredRows(rows, keys, queryTerms)

      const filteredRowNames = filteredRows.map((row) => row.original.name)
      const filteredRevenues = revenues.filter((investment) =>
        filteredRowNames.includes(investment.finance_solution),
      )

      setSearchFilteredRowsLength(filteredRevenues.length)

      return filteredRows
    },
    [revenues],
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

  const handleAddRevenue = (event) => {
    event.preventDefault()
    setIsModalOpen(true)
  }

  const handleRevenueModalDismiss = (resetForm) => {
    resetForm()
    setRevenueBeingEdited()
    setIsModalOpen(false)
  }

  const toolbarButtons = (
    <>
      <StyledToolbarButtonWrapper>
        <ButtonSecondary
          onClick={(event) => handleAddRevenue(event)}
          disabled={!indicatorSet.finance_solutions.length}
        >
          <IconPlus /> {tableLanguage.add}
        </ButtonSecondary>
      </StyledToolbarButtonWrapper>
    </>
  )

  const table = revenues.length ? (
    <GfcrGenericTable
      getTableProps={getTableProps}
      headerGroups={headerGroups}
      getTableBodyProps={getTableBodyProps}
      page={page}
      prepareRow={prepareRow}
      onPageSizeChange={handleRowsNumberChange}
      pageSize={pageSize}
      unfilteredRowLength={revenues.length}
      searchFilteredRowLength={searchFilteredRowsLength}
      isSearchFilterEnabled={!!globalFilter?.length}
      onPreviousClick={previousPage}
      previousDisabled={!canPreviousPage}
      onNextClick={nextPage}
      nextDisabled={!canNextPage}
      onGoToPage={gotoPage}
      currentPageIndex={pageIndex}
      pageCount={pageOptions.length}
    />
  ) : (
    <PageUnavailable
      mainText={tableLanguage.noDataMainText}
      subText={
        indicatorSet.finance_solutions.length
          ? tableLanguage.noDataSubText
          : tableLanguage.getNoFinanceSolutions(() => {
              setSelectedNavItem('finance-solutions')
            })
      }
    />
  )

  return (
    <>
      <TableContentToolbar>
        <ToolBarRow>
          <FilterSearchToolbar
            name={tableLanguage.filterToolbarText}
            disabled={revenues.length === 0}
            globalSearchText={globalFilter || ''}
            handleGlobalFilterChange={handleGlobalFilterChange}
          />
          <ToolbarButtonWrapper>{toolbarButtons}</ToolbarButtonWrapper>
        </ToolBarRow>
      </TableContentToolbar>
      <StyledTableContentWrapper>{table}</StyledTableContentWrapper>
      <RevenueModal
        isOpen={isModalOpen}
        revenue={revenueBeingEdited}
        financeSolutions={indicatorSet.finance_solutions}
        choices={choices}
        onDismiss={handleRevenueModalDismiss}
        indicatorSet={indicatorSet}
        setIndicatorSet={setIndicatorSet}
        displayHelp={displayHelp}
      />
    </>
  )
}

Revenues.propTypes = {
  indicatorSet: PropTypes.object.isRequired,
  setIndicatorSet: PropTypes.func.isRequired,
  choices: choicesPropType.isRequired,
  setSelectedNavItem: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default Revenues
