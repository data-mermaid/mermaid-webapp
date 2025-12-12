import { Link, useParams } from 'react-router-dom'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'

import { ContentPageLayout } from '../../../Layout'
import FilterSearchToolbar from '../../../FilterSearchToolbar/FilterSearchToolbar'
import { getIsUserAdminForProject } from '../../../../App/currentUserProfileHelpers'
import { getTableFilteredRows } from '../../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../../library/getToastArguments'
import { H2 } from '../../../generic/text'
import { IconPlus, IconDownload } from '../../../icons'
import { useTranslation } from 'react-i18next'
import PageUnavailable from '../../PageUnavailable'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
} from '../../../generic/Table/reactTableNaturalSort'
import { splitSearchQueryStrings } from '../../../../library/splitSearchQueryStrings'
import { ButtonSecondary, ToolbarButtonWrapper } from '../../../generic/buttons'
import { Column, ToolBarRow } from '../../../generic/positioning'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useDocumentTitle from '../../../../library/useDocumentTitle'
import useIsMounted from '../../../../library/useIsMounted'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import usePersistUserTablePreferences from '../../../generic/Table/usePersistUserTablePreferences'
import { PAGE_SIZE_DEFAULT } from '../../../../library/constants/constants'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { StyledToolbarButtonWrapper } from './Gfcr.styles'
import ButtonSecondaryDropdown from '../../../generic/ButtonSecondaryDropdown'
import { DropdownItemStyle } from '../../../generic/ButtonSecondaryDropdown/ButtonSecondaryDropdown.styles'
import { useCurrentProject } from '../../../../App/CurrentProjectContext'
import GfcrGenericTable from '../GfcrGenericTable'
import NewIndicatorSetModal from './NewIndicatorSetModal'

const Gfcr = () => {
  const { t } = useTranslation()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const currentProjectPath = useCurrentProjectPath()
  const { gfcrIndicatorSets, setGfcrIndicatorSets } = useCurrentProject()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const { isAppOnline } = useOnlineStatus()
  const { currentUser } = useCurrentUser()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const gfcrTitleText = t('gfcr.gfcr')
  const filterToolbarText = t('filters.by_title_date')
  const reportText = t('gfcr.report')
  const targetText = t('gfcr.target')
  const titleHeaderText = t('title')
  const typeHeaderText = t('type')
  const reportingDateHeaderText = t('gfcr.reporting_date')
  const untitledText = t('gfcr.untitled')
  const noIndicatorText = t('gfcr.no_indicator_sets')
  const noIndicatorInfoText = t('gfcr.no_indicator_info')
  const indicatorSetsUnavailableText = t('gfcr.errors.indicator_sets_unavailable')

  const [isLoading, setIsLoading] = useState(true)
  const [isNewIndicatorSetModalOpen, setIsNewIndicatorSetModalOpen] = useState(false)
  const [newIndicatorSetType, setNewIndicatorSetType] = useState()
  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)

  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)

  useDocumentTitle(`${gfcrTitleText} - ${t('mermaid')}`)
  const [isExporting, setIsExporting] = useState(false)

  const _getIndicatorSets = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (databaseSwitchboardInstance && isAppOnline) {
      Promise.all([databaseSwitchboardInstance.getIndicatorSets(projectId)])
        .then(([indicatorSetsResponse]) => {
          if (isMounted.current) {
            setGfcrIndicatorSets(indicatorSetsResponse)
          }

          setIsLoading(false)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(indicatorSetsUnavailableText))
            },
          })

          setIsLoading(false)
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    handleHttpResponseError,
    projectId,
    setGfcrIndicatorSets,
    isAppOnline,
    indicatorSetsUnavailableText,
  ])

  const tableColumns = useMemo(
    () => [
      {
        Header: titleHeaderText,
        accessor: 'title',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: typeHeaderText,
        accessor: 'indicator_set_type',
        sortType: reactTableNaturalSort,
      },
      {
        Header: reportingDateHeaderText,
        accessor: 'report_date',
        sortType: reactTableNaturalSort,
      },
    ],
    [titleHeaderText, typeHeaderText, reportingDateHeaderText],
  )

  const tableCellData = useMemo(() => {
    return gfcrIndicatorSets.map((indicatorSet) => {
      const { id, title, indicator_set_type, report_date } = indicatorSet

      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }
      const currentLocale = navigator.language
      const localizedDate = new Date(report_date).toLocaleDateString(currentLocale, dateOptions)

      return {
        title: isAdminUser ? (
          <Link to={`${currentProjectPath}/gfcr/${id}`}>{title}</Link>
        ) : (
          <span>{title || untitledText}</span>
        ),
        indicator_set_type: (
          <span>{indicator_set_type === 'report' ? reportText : targetText}</span>
        ),
        report_date: <span>{localizedDate}</span>,
      }
    })
  }, [gfcrIndicatorSets, isAdminUser, currentProjectPath, untitledText, reportText, targetText])

  const tableDefaultPrefs = useMemo(() => {
    return {
      sortBy: [
        {
          id: 'title',
          desc: false,
        },
      ],
      globalFilter: '',
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser && currentUser.id}-gfcrTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback(
    (rows, id, query) => {
      const keys = ['values.title.props.children', 'values.report_date']

      const queryTerms = splitSearchQueryStrings(query)
      const filteredRows =
        !queryTerms || !queryTerms.length ? rows : getTableFilteredRows(rows, keys, queryTerms)

      const filteredRowIds = filteredRows.map((row) => row.original.id)
      const filteredIndicatorSets = gfcrIndicatorSets.filter((indicatorSet) =>
        filteredRowIds.includes(indicatorSet.id),
      )

      setSearchFilteredRowsLength(filteredIndicatorSets.length)

      return filteredRows
    },
    [gfcrIndicatorSets],
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

  const createDropdownLabel = (
    <>
      <IconPlus /> {t('gfcr.create_new')}
    </>
  )

  const handleNewIndicatorSet = (type) => {
    setNewIndicatorSetType(type)
    setIsNewIndicatorSetModalOpen(true)
  }

  const handleExportClick = () => {
    setIsExporting(true)

    databaseSwitchboardInstance
      .exportData(projectId)
      .catch(() => {
        toast.error(t('toasts.export_error'))
      })
      .finally(() => {
        setIsExporting(false)
      })
  }

  const toolbarButtons = (
    <>
      <StyledToolbarButtonWrapper>
        <ButtonSecondaryDropdown label={createDropdownLabel} disabled={!isAdminUser}>
          <Column as="nav" data-testid="export-to-csv">
            <DropdownItemStyle as="button" onClick={() => handleNewIndicatorSet('report')}>
              {reportText}
            </DropdownItemStyle>
            <DropdownItemStyle as="button" onClick={() => handleNewIndicatorSet('target')}>
              {targetText}
            </DropdownItemStyle>
          </Column>
        </ButtonSecondaryDropdown>
        <ButtonSecondary
          to=""
          disabled={!gfcrIndicatorSets.length || isExporting}
          onClick={handleExportClick}
        >
          <IconDownload /> {isExporting ? t('gfcr.exporting') : t('buttons.export_to_xlsx')}
        </ButtonSecondary>
      </StyledToolbarButtonWrapper>
      <NewIndicatorSetModal
        indicatorSetType={newIndicatorSetType}
        isOpen={isNewIndicatorSetModalOpen}
        onDismiss={(resetForm) => {
          resetForm()
          setIsNewIndicatorSetModalOpen(false)
          setNewIndicatorSetType()
        }}
      />
    </>
  )

  const table = gfcrIndicatorSets.length ? (
    <GfcrGenericTable
      getTableProps={getTableProps}
      headerGroups={headerGroups}
      getTableBodyProps={getTableBodyProps}
      page={page}
      prepareRow={prepareRow}
      onPageSizeChange={handleRowsNumberChange}
      pageSize={pageSize}
      unfilteredRowLength={gfcrIndicatorSets.length}
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
    <PageUnavailable mainText={noIndicatorText} subText={noIndicatorInfoText} />
  )

  return (
    <ContentPageLayout
      toolbar={
        <>
          <H2>{gfcrTitleText}</H2>
          {isAppOnline && (
            <ToolBarRow>
              <FilterSearchToolbar
                name={filterToolbarText}
                disabled={gfcrIndicatorSets.length === 0}
                globalSearchText={globalFilter || ''}
                handleGlobalFilterChange={handleGlobalFilterChange}
              />

              <ToolbarButtonWrapper>{toolbarButtons}</ToolbarButtonWrapper>
            </ToolBarRow>
          )}
        </>
      }
      content={
        isAppOnline ? table : <PageUnavailable mainText={t('offline.page_unavailable_offline')} />
      }
      isPageContentLoading={isLoading}
    />
  )
}

export default Gfcr
