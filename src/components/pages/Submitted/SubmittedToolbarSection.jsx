import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes, { string } from 'prop-types'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { getSampleEventCounts } from '../../../library/getSampleEventCounts'
import { getToastArguments } from '../../../library/getToastArguments'
import { Column, FilterItems, ToolBarItemsRow } from '../../generic/positioning'
import { H2 } from '../../generic/text'
import { IconDownload } from '../../icons'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import { DropdownItemStyle } from '../../generic/ButtonSecondaryDropdown/ButtonSecondaryDropdown.styles'
import FilterIndicatorPill from '../../generic/FilterIndicatorPill/FilterIndicatorPill'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import MethodsFilterDropDown from '../../MethodsFilterDropDown/MethodsFilterDropDown'
import SuccessExportModal from '../../SuccessExportModal/SuccessExportModal'

const SubmittedToolbarSection = ({
  name,
  globalSearchText,
  handleGlobalFilterChange,
  handleMethodsColumnFilterChange,
  methodFilterValue = [],
  disabled = false,
  unfilteredRowLength,
  methodFilteredRowLength = null,
  searchFilteredRowLength = null,
  isSearchFilterEnabled = false,
  isMethodFilterEnabled = false,
  setMethodsFilter,
  handleSetTableUserPrefs,
  submittedRecordsForUiDisplay,
}) => {
  const { t } = useTranslation()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const [isSuccessExportModalOpen, setIsSuccessExportModalOpen] = useState(false)
  const [protocolSampleEventCount, setProtocolSampleEventCount] = useState(0)
  const sampleEventCounts = getSampleEventCounts(submittedRecordsForUiDisplay)

  const label = (
    <>
      <IconDownload /> Export To XLSX
    </>
  )

  const handleExportSubmitted = (protocol) => {
    const sampleEventCount = sampleEventCounts[protocol] || 0
    setProtocolSampleEventCount(sampleEventCount)

    databaseSwitchboardInstance
      .exportSubmittedRecords({ projectId, protocol })
      .then(() => {
        setIsSuccessExportModalOpen(true)
      })
      .catch(() => {
        toast.error(...getToastArguments(t('toasts.export_error')))
      })
  }

  const clearFilters = () => {
    setMethodsFilter([])
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: '' })
    handleGlobalFilterChange('')
  }

  const closeModal = () => {
    setIsSuccessExportModalOpen(false)
    setProtocolSampleEventCount(0)
  }

  return (
    <>
      <H2>Submitted</H2>
      <ToolBarItemsRow>
        <FilterItems>
          <FilterSearchToolbar
            name={name}
            disabled={disabled}
            globalSearchText={globalSearchText}
            handleGlobalFilterChange={handleGlobalFilterChange}
          />
          <MethodsFilterDropDown
            value={methodFilterValue}
            handleMethodsColumnFilterChange={handleMethodsColumnFilterChange}
            disabled={disabled}
          />
          {isSearchFilterEnabled || isMethodFilterEnabled ? (
            <FilterIndicatorPill
              unfilteredRowLength={unfilteredRowLength}
              methodFilteredRowLength={methodFilteredRowLength}
              searchFilteredRowLength={searchFilteredRowLength}
              isSearchFilterEnabled={isSearchFilterEnabled}
              isMethodFilterEnabled={isMethodFilterEnabled}
              clearFilters={clearFilters}
            />
          ) : null}
        </FilterItems>
        <ButtonSecondaryDropdown label={label}>
          <Column as="nav" data-testid="export-to-csv">
            <DropdownItemStyle
              as="button"
              disabled={!sampleEventCounts?.fishbelt}
              onClick={() => handleExportSubmitted('fishbelt')}
            >
              Fish Belt
            </DropdownItemStyle>
            <DropdownItemStyle
              as="button"
              disabled={!sampleEventCounts?.benthicpit}
              onClick={() => handleExportSubmitted('benthicpit')}
            >
              Benthic PIT
            </DropdownItemStyle>
            <DropdownItemStyle
              as="button"
              disabled={!sampleEventCounts?.benthiclit}
              onClick={() => handleExportSubmitted('benthiclit')}
            >
              Benthic LIT
            </DropdownItemStyle>
            <DropdownItemStyle
              as="button"
              disabled={!sampleEventCounts?.benthicpqt}
              onClick={() => handleExportSubmitted('benthicpqt')}
            >
              Benthic Photo Quadrat
            </DropdownItemStyle>
            <DropdownItemStyle
              as="button"
              disabled={!sampleEventCounts?.bleachingqc}
              onClick={() => handleExportSubmitted('bleachingqc')}
            >
              Bleaching
            </DropdownItemStyle>
            <DropdownItemStyle
              as="button"
              disabled={!sampleEventCounts?.habitatcomplexity}
              onClick={() => handleExportSubmitted('habitatcomplexity')}
            >
              Habitat Complexity
            </DropdownItemStyle>
          </Column>
        </ButtonSecondaryDropdown>
      </ToolBarItemsRow>
      <SuccessExportModal
        isOpen={isSuccessExportModalOpen}
        onDismiss={closeModal}
        projectId={projectId}
        protocolSampleEventCount={protocolSampleEventCount}
      />
    </>
  )
}

SubmittedToolbarSection.propTypes = {
  name: PropTypes.string.isRequired,
  globalSearchText: PropTypes.string,
  handleGlobalFilterChange: PropTypes.func.isRequired,
  handleMethodsColumnFilterChange: PropTypes.func.isRequired,
  methodFilterValue: PropTypes.arrayOf(string),
  disabled: PropTypes.bool,
  unfilteredRowLength: PropTypes.number.isRequired,
  methodFilteredRowLength: PropTypes.number,
  searchFilteredRowLength: PropTypes.number,
  isMethodFilterEnabled: PropTypes.bool,
  isSearchFilterEnabled: PropTypes.bool,
  setMethodsFilter: PropTypes.func.isRequired,
  handleSetTableUserPrefs: PropTypes.func.isRequired,
  submittedRecordsForUiDisplay: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      protocol: PropTypes.string.isRequired,
      uiLabels: PropTypes.shape({
        protocol: PropTypes.string.isRequired,
        site: PropTypes.string.isRequired,
        management: PropTypes.string.isRequired,
        size: PropTypes.string.isRequired,
        depth: PropTypes.string.isRequired,
        sampleDate: PropTypes.string.isRequired,
        observers: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
}

export default SubmittedToolbarSection
