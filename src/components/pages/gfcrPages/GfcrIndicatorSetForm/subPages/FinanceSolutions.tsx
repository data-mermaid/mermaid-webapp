import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
} from '../../../../generic/Table/reactTableNaturalSort'
import usePersistUserTablePreferences from '../../../../generic/Table/usePersistUserTablePreferences'
import { useCurrentUser } from '../../../../../App/CurrentUserContext'
import { useCurrentProject } from '../../../../../App/CurrentProjectContext'
import { splitSearchQueryStrings } from '../../../../../library/splitSearchQueryStrings'
import { getTableFilteredRows } from '../../../../../library/getTableFilteredRows'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { PAGE_SIZE_DEFAULT } from '../../../../../library/constants/constants'
import { IconCopy, IconPlus } from '../../../../icons'
import { ButtonSecondary, ToolbarButtonWrapper } from '../../../../generic/buttons'
import { MuiTooltip } from '../../../../generic/MuiTooltip'
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
import CopyFinanceSolutionsModal from '../modals/CopyFinanceSolutionsModal'
import GfcrGenericTable from '../../GfcrGenericTable'
import IconCheckLabel from './IconCheckLabel'
import {
  isGenderSmartApplicable,
  isLocalEnterpriseApplicable,
  isNumberOfSolutionsSupportedApplicable,
  isUsedAnIncubatorApplicable,
} from '../modals/financeSolutionFieldVisibility'
import {
  Choices,
  FinanceSolution,
  IndicatorSet,
} from '../../../../../App/mermaidData/mermaidDataTypes'
import styles from './FinanceSolutions.module.scss'

interface FinanceSolutionsProps {
  indicatorSet: IndicatorSet
  setIndicatorSet: (indicatorSet: IndicatorSet) => void
  choices: Choices
  displayHelp?: boolean
}

const FinanceSolutions = ({
  indicatorSet,
  setIndicatorSet,
  choices,
  displayHelp,
}: FinanceSolutionsProps) => {
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
  const numberOfSolutionsSupportedHeaderText = t(
    'gfcr.forms.finance_solutions.number_of_solutions_supported_table_header',
  )

  const copyFinanceSolutionText = t('gfcr.forms.finance_solutions.copy')
  const noCopyTargetsText = t('gfcr.forms.finance_solutions.no_copy_targets')
  const noIncubatorText = t('gfcr.forms.finance_solutions.no_incubator')

  const { currentUser } = useCurrentUser()
  const { gfcrIndicatorSets } = useCurrentProject()
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [financeSolutionBeingEdited, setFinanceSolutionBeingEdited] = useState<
    FinanceSolution | undefined
  >()
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false)

  const hasCopyTargets = gfcrIndicatorSets
    .filter((otherIndicatorSet) => otherIndicatorSet.id !== indicatorSet.id)
    .some((otherIndicatorSet) => otherIndicatorSet.finance_solutions?.length > 0)

  // A column is hidden when it is blank for every row. For the applicability
  // driven columns (the yes/no columns, "used an incubator" and "number of
  // solutions supported") "blank" means the field does not apply to any row's
  // type (see decision on M1981); for the text columns it means no value was
  // entered.
  const columnHasData = useMemo(() => {
    const financeSolutions = indicatorSet.finance_solutions

    return {
      sector: financeSolutions.some((financeSolution) => !!financeSolution.sector),
      geographical_coverage: financeSolutions.some(
        (financeSolution) => !!financeSolution.geographical_coverage,
      ),
      used_an_incubator: financeSolutions.some((financeSolution) =>
        isUsedAnIncubatorApplicable(financeSolution.fs_type),
      ),
      taf_name: financeSolutions.some((financeSolution) => !!financeSolution.taf_name),
      local_enterprise: financeSolutions.some((financeSolution) =>
        isLocalEnterpriseApplicable(financeSolution.fs_type),
      ),
      gender_smart: financeSolutions.some((financeSolution) =>
        isGenderSmartApplicable(financeSolution.fs_type),
      ),
      number_of_solutions_supported_by: financeSolutions.some((financeSolution) =>
        isNumberOfSolutionsSupportedApplicable(financeSolution.fs_type),
      ),
      sustainable_finance_mechanisms: financeSolutions.some(
        (financeSolution) => financeSolution.sustainable_finance_mechanisms?.length > 0,
      ),
    }
  }, [indicatorSet.finance_solutions])

  const tableColumns = useMemo(() => {
    const columns = [
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
        Header: localEnterpriseHeaderText,
        accessor: 'local_enterprise',
        sortType: reactTableNaturalSort,
        align: 'center',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) =>
          typeof value === 'boolean' ? <IconCheckLabel isCheck={value} /> : null,
      },
      {
        Header: gender2xCriteriaHeaderText,
        accessor: 'gender_smart',
        sortType: reactTableNaturalSort,
        align: 'center',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) =>
          typeof value === 'boolean' ? <IconCheckLabel isCheck={value} /> : null,
      },
      {
        Header: numberOfSolutionsSupportedHeaderText,
        accessor: 'number_of_solutions_supported_by',
        sortType: reactTableNaturalSort,
      },
      {
        Header: sustainableFinanceMechanismsHeaderText,
        accessor: 'sustainable_finance_mechanisms',
        sortType: reactTableNaturalSort,
      },
    ]

    // Drop any column that columnHasData marks as blank for every row. Columns
    // not listed in columnHasData (e.g. name, fs_type) are always shown.
    return columns.filter(
      (column) => !(column.accessor in columnHasData) || columnHasData[column.accessor],
    )
  }, [
    businessFinanceSolutionNameHeaderText,
    fsTypeHeaderText,
    sectorHeaderText,
    geographicalCoverageHeaderText,
    usedAnIncubatorHeaderText,
    tafNameHeaderText,
    localEnterpriseHeaderText,
    gender2xCriteriaHeaderText,
    numberOfSolutionsSupportedHeaderText,
    sustainableFinanceMechanismsHeaderText,
    columnHasData,
  ])

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
    return indicatorSet.finance_solutions.map((financeSolution) => {
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
      } = financeSolution

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
        used_an_incubator: isUsedAnIncubatorApplicable(fs_type)
          ? incubatorName || noIncubatorText
          : null,
        taf_name,
        local_enterprise: isLocalEnterpriseApplicable(fs_type) ? !!local_enterprise : null,
        gender_smart: isGenderSmartApplicable(fs_type) ? !!gender_smart : null,
        number_of_solutions_supported_by: isNumberOfSolutionsSupportedApplicable(fs_type)
          ? number_of_solutions_supported_by
          : null,
        sustainable_finance_mechanisms: sustainableFinanceMechanismNames.join(', '),
      }
    })
  }, [choices, handleEditFinanceSolution, indicatorSet.finance_solutions, noIncubatorText])

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
    setFinanceSolutionBeingEdited(undefined)
    setIsModalOpen(false)
  }

  const handleOpenCopyModal = (event) => {
    event.preventDefault()
    setIsCopyModalOpen(true)
  }

  const handleCopyModalDismiss = () => {
    setIsCopyModalOpen(false)
  }

  const toolbarButtons = (
    <div className={styles.toolbarButtons}>
      <ButtonSecondary onClick={(event) => handleAddFinanceSolution(event)}>
        <IconPlus /> {t('gfcr.forms.finance_solutions.add')}
      </ButtonSecondary>
      <MuiTooltip title={hasCopyTargets ? '' : noCopyTargetsText}>
        <span className={styles.copyButtonTooltipWrapper}>
          <ButtonSecondary
            onClick={(event) => handleOpenCopyModal(event)}
            disabled={!hasCopyTargets}
            style={!hasCopyTargets ? { pointerEvents: 'none' } : undefined}
          >
            <IconCopy /> {copyFinanceSolutionText}
          </ButtonSecondary>
        </span>
      </MuiTooltip>
    </div>
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
      searchFilteredRowsLength={searchFilteredRowsLength}
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
      <CopyFinanceSolutionsModal
        isOpen={isCopyModalOpen}
        indicatorSet={indicatorSet}
        setIndicatorSet={setIndicatorSet}
        choices={choices}
        onDismiss={handleCopyModalDismiss}
      />
    </>
  )
}

export default FinanceSolutions
