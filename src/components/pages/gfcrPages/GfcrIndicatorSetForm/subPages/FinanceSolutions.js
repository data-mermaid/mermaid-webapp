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
import FinanceSolutionModal from '../modals/FinanceSolutionModal'
import { StyledTableAnchor } from './subPages.styles'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import GfcrGenericTable from '../../GfcrGenericTable'
import IconCheckLabel from './IconCheckLabel'

const tableLanguage = language.pages.gfcrFinanceSolutionsTable

const FinanceSolutions = ({ indicatorSet, setIndicatorSet, choices, displayHelp }) => {
  const { currentUser } = useCurrentUser()
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [financeSolutionBeingEdited, setFinanceSolutionBeingEdited] = useState()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Business / Finance Solution Name',
        accessor: 'name',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: 'Sector',
        accessor: 'sector',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Used An Incubator',
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
        Header: 'Local Enterprise',
        accessor: 'local_enterprise',
        sortType: reactTableNaturalSort,
        align: 'center',
      },
      {
        Header: 'Sustainable Finance Mechanisms',
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
        (financeSolution) => financeSolution.id === event.target.id,
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
        id,
        name,
        sector,
        used_an_incubator,
        gender_smart,
        local_enterprise,
        sustainable_finance_mechanisms,
      } = indicatorSet

      const sectorName = choices.sectors.data?.find(
        (sectorChoice) => sectorChoice.id === sector,
      ).name
      const incubatorName = choices.incubatortypes.data?.find(
        (incubatorTypeChoice) => incubatorTypeChoice.id === used_an_incubator,
      )?.name
      const sustainableFinanceMechanismNames = sustainable_finance_mechanisms.map((mechanism) => {
        return choices.sustainablefinancemechanisms.data?.find(
          (sfmChoice) => sfmChoice.id === mechanism,
        ).name
      })

      return {
        name: (
          <StyledTableAnchor id={id} onClick={(event) => handleEditFinanceSolution(event)}>
            {name}
          </StyledTableAnchor>
        ),
        sector: sectorName,
        used_an_incubator: incubatorName ? incubatorName : 'None',
        gender_smart: <IconCheckLabel isCheck={!!gender_smart} />,
        local_enterprise: <IconCheckLabel isCheck={!!local_enterprise} />,
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

      const filteredRowNames = filteredRows.map((row) => row.original.id)
      const filteredFinanceSolutions = indicatorSet.finance_solutions.filter((financeSolution) =>
        filteredRowNames.includes(financeSolution.id),
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
          <IconPlus /> {tableLanguage.add}
        </ButtonSecondary>
      </StyledToolbarButtonWrapper>
    </>
  )

  const table = indicatorSet.finance_solutions.length ? (
    <GfcrGenericTable
      getTableProps={getTableProps}
      headerGroups={headerGroups}
      getTableBodyProps={getTableBodyProps}
      page={page}
      prepareRow={prepareRow}
      onPageSizeChange={handleRowsNumberChange}
      pageSize={pageSize}
      unfilteredRowLength={indicatorSet.finance_solutions.length}
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
      subText={tableLanguage.noDataSubText}
    />
  )

  return (
    <>
      <TableContentToolbar>
        <ToolBarRow>
          <FilterSearchToolbar
            name={tableLanguage.filterToolbarText}
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
        indicatorSet={indicatorSet}
        setIndicatorSet={setIndicatorSet}
        choices={choices}
        onDismiss={handleFinanceSolutionModalDismiss}
        displayHelp={displayHelp}
      />
    </>
  )
}

FinanceSolutions.propTypes = {
  indicatorSet: PropTypes.object.isRequired,
  setIndicatorSet: PropTypes.func.isRequired,
  choices: choicesPropType.isRequired,
  displayHelp: PropTypes.bool,
}

export default FinanceSolutions
