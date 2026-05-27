import { Link, useParams } from 'react-router'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { ContentPageLayout } from '../../../Layout'
import FilterSearchToolbar from '../../../FilterSearchToolbar/FilterSearchToolbar'
import { getIsUserAdminForProject } from '../../../../App/currentUserProfileHelpers'
import { getToastArguments } from '../../../../library/getToastArguments'
import { H2 } from '../../../generic/text'
import { IconPlus, IconDownload } from '../../../icons'
import { useTranslation } from 'react-i18next'
import PageUnavailable from '../../PageUnavailable'
import { ButtonSecondary, ToolbarButtonWrapper } from '../../../generic/buttons'
import { Column, ToolBarRow } from '../../../generic/positioning'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useDocumentTitle from '../../../../library/useDocumentTitle'
import useIsMounted from '../../../../library/useIsMounted'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
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

  const [searchText, setSearchText] = useState('')

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
        field: 'title',
        headerName: titleHeaderText,
        flex: 1,
        renderCell: (params) =>
          isAdminUser ? (
            <Link to={`${currentProjectPath}/gfcr/${params.id}`}>{params.value}</Link>
          ) : (
            <span>{params.value}</span>
          ),
      },
      {
        field: 'indicator_set_type',
        headerName: typeHeaderText,
        width: 150,
      },
      {
        field: 'report_date',
        headerName: reportingDateHeaderText,
        width: 200,
      },
    ],
    [titleHeaderText, typeHeaderText, reportingDateHeaderText, isAdminUser, currentProjectPath],
  )

  const tableCellData = useMemo(() => {
    return gfcrIndicatorSets.map((indicatorSet) => {
      const { id, title, indicator_set_type, report_date } = indicatorSet

      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }
      const currentLocale = navigator.language
      const localizedDate = new Date(report_date).toLocaleDateString(currentLocale, dateOptions)

      return {
        id,
        title: title || untitledText,
        indicator_set_type: indicator_set_type === 'report' ? reportText : targetText,
        report_date: localizedDate,
      }
    })
  }, [gfcrIndicatorSets, untitledText, reportText, targetText])

  const handleGlobalFilterChange = (value) => setSearchText(value)

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
      rows={tableCellData}
      columns={tableColumns}
      filterModel={{ items: [], quickFilterValues: searchText ? [searchText] : [] }}
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
                globalSearchText={searchText}
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
