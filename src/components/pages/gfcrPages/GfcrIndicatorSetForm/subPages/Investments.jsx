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
import {
  TableContentToolbar,
  StyledTableContentWrapper,
  StyledTableAnchor,
} from './subPages.styles'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import GfcrGenericTable from '../../GfcrGenericTable'
import InvestmentModal from '../modals/InvestmentModal'
import formattedCurrencyAmount from '../../../../../library/formatCurrencyAmount'

const tableLanguage = language.pages.gfcrInvestmentsTable

const Investments = ({
  indicatorSet,
  setIndicatorSet,
  choices,
  onSubmit,
  setSelectedNavItem,
  displayHelp,
}) => {
  const { currentUser } = useCurrentUser()
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [investmentBeingEdited, setInvestmentBeingEdited] = useState()

  const investments = useMemo(() => {
    return indicatorSet.finance_solutions.flatMap((fs) => fs.investment_sources)
  }, [indicatorSet.finance_solutions])

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Business / Finance Solution',
        accessor: 'finance_solution',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: 'Investment Source',
        accessor: 'investment_source',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Investment Type',
        accessor: 'investment_type',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Investment Amount',
        accessor: 'investment_amount',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
    ],
    [],
  )

  const handleEditInvestment = useCallback(
    (event) => {
      event.preventDefault()
      const investment = investments.find((inv) => inv.id === event.target.id)

      setInvestmentBeingEdited(investment)
      setIsModalOpen(true)
    },
    [investments],
  )

  const tableCellData = useMemo(() => {
    if (!choices || !investments) {
      return
    }

    // eslint-disable-next-line consistent-return
    return investments.map((investment) => {
      const { id, finance_solution, investment_source, investment_type, investment_amount } =
        investment

      const investmentSourceName = choices.investmentsources.data?.find(
        (investmentSourceChoice) => investmentSourceChoice.id === investment_source,
      ).name
      const investmentTypeName = choices.investmenttypes.data?.find(
        (investmentTypeChoice) => investmentTypeChoice.id === investment_type,
      )?.name

      const formattedInvestmentAmount = formattedCurrencyAmount(investment_amount)

      return {
        finance_solution: (
          <StyledTableAnchor id={id} onClick={(event) => handleEditInvestment(event)}>
            {indicatorSet.finance_solutions.find((fs) => fs.id === finance_solution).name}
          </StyledTableAnchor>
        ),
        investment_source: investmentSourceName,
        investment_type: investmentTypeName,
        investment_amount: `${formattedInvestmentAmount}`,
      }
    })
  }, [choices, handleEditInvestment, indicatorSet, investments])

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
    key: `${currentUser && currentUser.id}-gfcrInvestmentsTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback(
    (rows, id, query) => {
      const keys = [
        'values.finance_solution.props.children',
        'values.investment_source',
        'values.investment_type',
        'values.investment_amount',
      ]

      const queryTerms = splitSearchQueryStrings(query)
      const filteredRows =
        !queryTerms || !queryTerms.length ? rows : getTableFilteredRows(rows, keys, queryTerms)

      const filteredRowNames = filteredRows.map((row) => row.original.name)
      const filteredInvestments = investments.filter((investment) =>
        filteredRowNames.includes(investment.finance_solution),
      )

      setSearchFilteredRowsLength(filteredInvestments.length)

      return filteredRows
    },
    [investments],
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

  const handleAddInvestment = (event) => {
    event.preventDefault()
    setIsModalOpen(true)
  }

  const handleInvestmentModalDismiss = (resetForm) => {
    resetForm()
    setInvestmentBeingEdited()
    setIsModalOpen(false)
  }

  const toolbarButtons = (
    <>
      <StyledToolbarButtonWrapper>
        <ButtonSecondary
          onClick={(event) => handleAddInvestment(event)}
          disabled={!indicatorSet.finance_solutions.length}
        >
          <IconPlus /> {tableLanguage.add}
        </ButtonSecondary>
      </StyledToolbarButtonWrapper>
    </>
  )

  const table = investments.length ? (
    <GfcrGenericTable
      getTableProps={getTableProps}
      headerGroups={headerGroups}
      getTableBodyProps={getTableBodyProps}
      page={page}
      prepareRow={prepareRow}
      onPageSizeChange={handleRowsNumberChange}
      pageSize={pageSize}
      unfilteredRowLength={investments.length}
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
            disabled={investments.length === 0}
            globalSearchText={globalFilter || ''}
            handleGlobalFilterChange={handleGlobalFilterChange}
          />
          <ToolbarButtonWrapper>{toolbarButtons}</ToolbarButtonWrapper>
        </ToolBarRow>
      </TableContentToolbar>
      <StyledTableContentWrapper>{table}</StyledTableContentWrapper>
      <InvestmentModal
        isOpen={isModalOpen}
        investment={investmentBeingEdited}
        indicatorSet={indicatorSet}
        setIndicatorSet={setIndicatorSet}
        financeSolutions={indicatorSet.finance_solutions}
        choices={choices}
        onDismiss={handleInvestmentModalDismiss}
        onSubmit={onSubmit}
        displayHelp={displayHelp}
      />
    </>
  )
}

Investments.propTypes = {
  indicatorSet: PropTypes.object,
  setIndicatorSet: PropTypes.func.isRequired,
  choices: choicesPropType.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setSelectedNavItem: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default Investments
