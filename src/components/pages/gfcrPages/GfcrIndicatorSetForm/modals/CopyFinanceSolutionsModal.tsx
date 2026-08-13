import React, { useCallback, useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table'
import Modal, { RightFooter, ModalTableOverflowWrapper } from '../../../../generic/Modal'
import {
  Tr,
  Th,
  Td,
  Table,
  ViewSelectedOnly,
  CopyModalToolbarWrapper,
  CopyModalPaginationWrapper,
} from '../../../../generic/Table/table'
import { ButtonPrimary, ButtonSecondary } from '../../../../generic/buttons'
import { IconCopy } from '../../../../icons'
import { getTableColumnHeaderProps } from '../../../../../library/getTableColumnHeaderProps'
import { reactTableNaturalSort } from '../../../../generic/Table/reactTableNaturalSort'
import PageSelector from '../../../../generic/Table/PageSelector'
import FilterSearchToolbar from '../../../../FilterSearchToolbar/FilterSearchToolbar'
import { splitSearchQueryStrings } from '../../../../../library/splitSearchQueryStrings'
import { getTableFilteredRows } from '../../../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../../../library/getToastArguments'
import usePersistUserTablePreferences from '../../../../generic/Table/usePersistUserTablePreferences'
import { useCurrentUser } from '../../../../../App/CurrentUserContext'
import { useCurrentProject } from '../../../../../App/CurrentProjectContext'
import { useDatabaseSwitchboardInstance } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../../App/HttpResponseErrorHandlerContext'
import { formatReportDate } from '../../../../../library/formatDateTime'
import { stripId } from './copyHelpers'
import {
  Choices,
  FinanceSolution,
  IndicatorSet,
} from '../../../../../App/mermaidData/mermaidDataTypes'
import styles from './CopyFinanceSolutionsModal.module.scss'

export interface CopyFinanceSolutionsModalProps {
  isOpen: boolean
  onDismiss: () => void
  indicatorSet: IndicatorSet
  setIndicatorSet: (indicatorSet: IndicatorSet) => void
  choices: Choices
}

const DEFAULT_PAGE_SIZE = 7

const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }
>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef<HTMLInputElement>(null)
  const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || defaultRef

  useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = !!indeterminate
    }
  }, [resolvedRef, indeterminate])

  return <input type="checkbox" ref={resolvedRef} {...rest} />
})

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

const CopyFinanceSolutionsModal = ({
  isOpen,
  onDismiss,
  indicatorSet,
  setIndicatorSet,
  choices,
}: CopyFinanceSolutionsModalProps) => {
  const { t } = useTranslation()
  const { projectId } = useParams()
  const { currentUser } = useCurrentUser()
  const { gfcrIndicatorSets } = useCurrentProject()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const [isViewSelectedOnly, setIsViewSelectedOnly] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const indicatorSetSaveSuccessText = t('gfcr.success.indicator_set_save')
  const indicatorSetSaveFailedText = t('gfcr.errors.indicator_set_save_failed')
  const indicatorSetHeaderText = t('gfcr.forms.finance_solutions.indicator_set')
  const reportingDateHeaderText = t('gfcr.reporting_date')
  const nameHeaderText = t('gfcr.forms.finance_solutions.business_finance_solution_name')
  const fsTypeHeaderText = t('gfcr.forms.finance_solutions.fs_type')

  const copyableEntries = useMemo(() => {
    return gfcrIndicatorSets
      .filter((set) => set.id !== indicatorSet.id)
      .flatMap((set) =>
        (set.finance_solutions ?? []).map((financeSolution) => ({
          indicatorSetTitle: set.title,
          reportDate: set.report_date,
          financeSolution,
        })),
      )
  }, [gfcrIndicatorSets, indicatorSet.id])

  const tableColumns = useMemo(
    () => [
      {
        id: 'selection',
        // react-table's row/column objects aren't real component props, so react/prop-types
        // false-positives on every `row.*`/`column.*` access from here to the end of the file.
        /* eslint-disable react/prop-types */
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      {
        Header: indicatorSetHeaderText,
        accessor: 'indicatorSetTitle',
        sortType: reactTableNaturalSort,
      },
      {
        Header: reportingDateHeaderText,
        accessor: 'report_date',
        // Sorts on the raw YYYY-MM-DD value, not the localized text the Cell renders,
        // so the order stays chronological rather than alphabetical by month name.
        sortType: reactTableNaturalSort,
        Cell: ({ value }) => formatReportDate(value),
      },
      { Header: nameHeaderText, accessor: 'name', sortType: reactTableNaturalSort },
      { Header: fsTypeHeaderText, accessor: 'fs_type', sortType: reactTableNaturalSort },
    ],
    [indicatorSetHeaderText, reportingDateHeaderText, nameHeaderText, fsTypeHeaderText],
  )

  const tableCellData = useMemo(() => {
    if (!choices) {
      return []
    }

    return copyableEntries.map(({ indicatorSetTitle, reportDate, financeSolution }) => {
      const { id, name, fs_type } = financeSolution

      const fsTypeName = choices.financesolutiontypes?.data?.find(
        (fsTypeChoice) => fsTypeChoice.id === fs_type,
      )?.name

      return {
        id,
        indicatorSetTitle,
        report_date: reportDate,
        name,
        fs_type: fsTypeName,
      }
    })
  }, [choices, copyableEntries])

  const tableDefaultPrefs = useMemo(() => {
    return {
      sortBy: [{ id: 'indicatorSetTitle', desc: false }],
      globalFilter: '',
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser?.id}-copyFinanceSolutionsTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.indicatorSetTitle', 'values.name']

    const queryTerms = splitSearchQueryStrings(query)
    const filteredRows =
      !queryTerms || !queryTerms.length ? rows : getTableFilteredRows(rows, keys, queryTerms)

    return filteredRows
  }, [])

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
    selectedFlatRows,
    state: { pageIndex, sortBy, globalFilter },
    toggleAllRowsSelected,
    setGlobalFilter,
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: {
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: tableUserPrefs.sortBy,
        globalFilter: tableUserPrefs.globalFilter,
      },
      getRowId: (row) => row.id,
      globalFilter: tableGlobalFilters,
      // Disables requirement to hold shift to enable multi-sort
      isMultiSortEvent: () => true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
  )

  const handleViewSelectedOnlyChange = () => {
    setIsViewSelectedOnly(!isViewSelectedOnly)
  }

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const _setFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: globalFilter })
  }, [globalFilter, handleSetTableUserPrefs])

  const _resetToPageOneWhenViewSelectedRowsIsOn = useEffect(() => {
    if (isViewSelectedOnly) {
      gotoPage(0)
    }
  }, [isViewSelectedOnly, gotoPage])

  const handleCopySelectedFinanceSolutions = async () => {
    setIsSaving(true)

    const selectedFinanceSolutions = selectedFlatRows
      .map(
        (row) =>
          copyableEntries.find((entry) => entry.financeSolution.id === row.original.id)
            ?.financeSolution,
      )
      .filter((financeSolution): financeSolution is FinanceSolution => !!financeSolution)

    try {
      const newFinanceSolutions = selectedFinanceSolutions.map(stripId)

      const updatedIndicatorSet = {
        ...indicatorSet,
        finance_solutions: [...indicatorSet.finance_solutions, ...newFinanceSolutions],
      }

      const response = await databaseSwitchboardInstance.saveIndicatorSet(
        projectId,
        updatedIndicatorSet,
      )

      setIndicatorSet(response)
      toast.success(...getToastArguments(indicatorSetSaveSuccessText))
      toggleAllRowsSelected(false)
      setIsSaving(false)
      onDismiss()
    } catch (error) {
      setIsSaving(false)
      toast.error(...getToastArguments(indicatorSetSaveFailedText))
      handleHttpResponseError({ error })
    }
  }

  const selectedRowsPaginationSize = Math.ceil(selectedFlatRows.length / DEFAULT_PAGE_SIZE)
  const pageCount = isViewSelectedOnly ? selectedRowsPaginationSize : pageOptions.length
  const selectedRowsPageStartIndex = pageIndex * DEFAULT_PAGE_SIZE
  const selectedRowsPageEndIndex = selectedRowsPageStartIndex + DEFAULT_PAGE_SIZE
  const tableBodyRow = isViewSelectedOnly
    ? selectedFlatRows.slice(selectedRowsPageStartIndex, selectedRowsPageEndIndex)
    : page

  const table = !!tableCellData.length && (
    <>
      <ModalTableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps()

              return (
                <Tr key={headerGroupKey} {...headerGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const isMultiSortColumn = headerGroup.headers.some(
                      (header) => header.sortedIndex > 0,
                    )
                    const { key: headerKey, ...headerProps } = column.getHeaderProps(
                      getTableColumnHeaderProps(column),
                    )

                    return (
                      <Th
                        key={headerKey}
                        {...headerProps}
                        $isSortedDescending={column.isSortedDesc}
                        $sortedIndex={column.sortedIndex}
                        $isMultiSortColumn={isMultiSortColumn}
                      >
                        {column.render('Header')}
                      </Th>
                    )
                  })}
                </Tr>
              )
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {tableBodyRow.map((row) => {
              prepareRow(row)
              const { key: rowKey, ...rowProps } = row.getRowProps()

              return (
                <Tr key={rowKey} {...rowProps}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps()

                    return (
                      <Td key={cellKey} {...cellProps} $align={cell.column.align}>
                        {cell.render('Cell')}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </tbody>
        </Table>
      </ModalTableOverflowWrapper>
      <CopyModalPaginationWrapper>
        <PageSelector
          onPreviousClick={previousPage}
          previousDisabled={!canPreviousPage}
          onNextClick={nextPage}
          nextDisabled={!canNextPage}
          onGoToPage={gotoPage}
          currentPageIndex={pageIndex}
          pageCount={pageCount}
        />
      </CopyModalPaginationWrapper>
    </>
  )

  const toolbarContent = (
    <>
      <p className={styles.infoLine}>{t('gfcr.forms.finance_solutions.copy_info')}</p>
      <CopyModalToolbarWrapper>
        <FilterSearchToolbar
          id="copy-finance-solutions-filter"
          name={t('filters.by_indicator_set_or_solution_name')}
          globalSearchText={globalFilter}
          handleGlobalFilterChange={handleGlobalFilterChange}
        />
        <ViewSelectedOnly htmlFor="viewSelectedOnlyFinanceSolutions">
          <input
            id="viewSelectedOnlyFinanceSolutions"
            type="checkbox"
            checked={isViewSelectedOnly}
            onChange={handleViewSelectedOnlyChange}
          />
          {t('view_selected_only')}
        </ViewSelectedOnly>
      </CopyModalToolbarWrapper>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('buttons.cancel')}</ButtonSecondary>
      <ButtonPrimary
        disabled={!selectedFlatRows.length || isSaving}
        onClick={handleCopySelectedFinanceSolutions}
      >
        <IconCopy />
        {t('gfcr.forms.finance_solutions.copy_selected')}
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxHeight="70vh"
      title={t('gfcr.forms.finance_solutions.copy')}
      mainContent={table}
      footerContent={footerContent}
      toolbarContent={toolbarContent}
    />
  )
}

export default CopyFinanceSolutionsModal
