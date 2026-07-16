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
import { useTranslation } from 'react-i18next'
import { ToolBarRow } from '../../../../generic/positioning'
import FilterSearchToolbar from '../../../../FilterSearchToolbar/FilterSearchToolbar'
import {
  TableContentToolbar,
  StyledTableContentWrapper,
  StyledTableAnchor,
} from './subPages.styles'
import FinanceSolutionModal from '../modals/FinanceSolutionModal'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import GfcrGenericTable from '../../GfcrGenericTable'
import IconCheckLabel from './IconCheckLabel'

const FinanceSolutions = ({ indicatorSet, setIndicatorSet, choices, displayHelp }) => {
  const { t } = useTranslation()

  const businessFinanceSolutionNameHeaderText = t(
    'gfcr.forms.finance_solutions.business_finance_solution_name',
  )
  const fsTypeHeaderText = t('gfcr.forms.finance_solutions.fs_type')
  const sectorHeaderText = t('gfcr.forms.finance_solutions.sector')
  const usedAnIncubatorHeaderText = t('gfcr.forms.finance_solutions.used_an_incubator')
  const gender2xCriteriaHeaderText = t('gfcr.forms.finance_solutions.gender_program_criteria')
  const localEnterpriseHeaderText = t('gfcr.forms.finance_solutions.local_enterprise')
  const sustainableFinanceMechanismsHeaderText = t(
    'gfcr.forms.finance_solutions.sustainable_finance_mechanisms',
  )
  const geographicalCoverageHeaderText = t('gfcr.forms.finance_solutions.geographical_coverage')
  const tafNameHeaderText = t('gfcr.forms.finance_solutions.taf_name')
  const numberOfSolutionsSupportedByHeaderText = t(
    'gfcr.forms.finance_solutions.number_of_solutions_supported_by',
  )

  const { currentUser } = useCurrentUser()
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [financeSolutionBeingEdited, setFinanceSolutionBeingEdited] = useState()

  const tableColumns = useMemo(
    () => [
      {
        Header: businessFinanceSolutionNameHeaderText,
        accessor: 'name',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: fsTypeHeaderText,
        accessor: 'fs_type',
        sortType: reactTableNaturalSort,
      },
      {
        Header: sectorHeaderText,
        accessor: 'sector',
        sortType: reactTableNaturalSort,
      },
      {
        Header: geographicalCoverageHeaderText,
        accessor: 'geographical_coverage',
        sortType: reactTableNaturalSort,
      },
      {
        Header: usedAnIncubatorHeaderText,
        accessor: 'used_an_incubator',
        sortType: reactTableNaturalSort,
      },
      {
        Header: tafNameHeaderText,
        accessor: 'taf_name',
        sortType: reactTableNaturalSort,
      },
      {
        Header: gender2xCriteriaHeaderText,
        accessor: 'gender_smart',
        sortType: reactTableNaturalSort,
        align: 'center',
      },
      {
        Header: localEnterpriseHeaderText,
        accessor: 'local_enterprise',
        sortType: reactTableNaturalSort,
        align: 'center',
      },
      {
        Header: numberOfSolutionsSupportedByHeaderText,
        accessor: 'number_of_solutions_supported_by',
        sortType: reactTableNaturalSort,
      },
      {
        Header: sustainableFinanceMechanismsHeaderText,
        accessor: 'sustainable_finance_mechanisms',
        sortType: reactTableNaturalSort,
      },
    ],
    [
      businessFinanceSolutionNameHeaderText,
      fsTypeHeaderText,
      sectorHeaderText,
      geographicalCoverageHeaderText,
      usedAnIncubatorHeaderText,
      tafNameHeaderText,
      gender2xCriteriaHeaderText,
      localEnterpriseHeaderText,
      numberOfSolutionsSupportedByHeaderText,
      sustainableFinanceMechanismsHeaderText,
    ],
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

    // eslint-disable-next-line consistent-return
    return indicatorSet.finance_solutions.map((indicatorSet) => {
      const {
        id,
        name,
        fs_type,
        sector,
        geographical_coverage,
        used_an_incubator,
        taf_name,
        gender_smart,
        local_enterprise,
        number_of_solutions_supported_by,
        sustainable_finance_mechanisms,
      } = indicatorSet

      const fsTypeName = choices.financesolutiontypes?.data?.find(
        (fsTypeChoice) => fsTypeChoice.id === fs_type,
      )?.name
      const sectorName = choices.sectors.data?.find(
        (sectorChoice) => sectorChoice.id === sector,
      )?.name
      const geographicalCoverageName = choices.geographicalcoverage?.data?.find(
        (geographicalCoverageChoice) => geographicalCoverageChoice.id === geographical_coverage,
      )?.name
      const incubatorName = choices.incubatortypes.data?.find(
        (incubatorTypeChoice) => incubatorTypeChoice.id === used_an_incubator,
      )?.name
      const sustainableFinanceMechanismNames = sustainable_finance_mechanisms.map((mechanism) => {
        return choices.sustainablefinancemechanisms.data?.find(
          // eslint-disable-next-line max-nested-callbacks
          (sfmChoice) => sfmChoice.id === mechanism,
        )?.name
      })

      return {
        name: (
          <StyledTableAnchor id={id} onClick={(event) => handleEditFinanceSolution(event)}>
            {name}
          </StyledTableAnchor>
        ),
        fs_type: fsTypeName,
        sector: sectorName,
        geographical_coverage: geographicalCoverageName,
        used_an_incubator: incubatorName ? incubatorName : 'None',
        taf_name,
        gender_smart: <IconCheckLabel isCheck={!!gender_smart} />,
        local_enterprise: <IconCheckLabel isCheck={!!local_enterprise} />,
        number_of_solutions_supported_by,
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
        'values.fs_type',
        'values.sector',
        'values.geographical_coverage',
        'values.used_an_incubator',
        'values.taf_name',
        'values.gender_smart',
        'values.local_enterprise',
        'values.number_of_solutions_supported_by',
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
          <IconPlus /> {t('gfcr.forms.finance_solutions.add')}
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
      mainText={t('gfcr.forms.finance_solutions.no_finance_solutions')}
      subText={t('gfcr.forms.finance_solutions.select_add_finance_solution')}
    />
  )

  return (
    <>
      <TableContentToolbar>
        <ToolBarRow>
          <FilterSearchToolbar
            name={t('filters.by_finance_solution')}
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
