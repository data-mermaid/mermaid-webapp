import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes, { string } from 'prop-types'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { getDataSharingPolicyLabel } from '../../../library/getDataSharingPolicyLabel'
import { getSampleEventCount } from '../../../library/getSampleEventCount'
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
  const [projectDataPolicy, setProjectDataPolicy] = useState({})
  const [isSuccessExportModalOpen, setIsSuccessExportModalOpen] = useState(false)
  const [exportingDataPolicy, setExportingDataPolicy] = useState('')
  const [protocolSampleEventCount, setProtocolSampleEventCount] = useState(0)

  const _getSupportingData = useEffect(() => {
    databaseSwitchboardInstance.getProject(projectId).then((project) => {
      setProjectDataPolicy({
        fishbelt: project.data_policy_beltfish,
        benthicpit: project.data_policy_benthicpit,
        benthiclit: project.data_policy_benthiclit,
        benthicpqt: project.data_policy_benthicpqt,
        bleachingqc: project.data_policy_bleachingqc,
        habitatcomplexity: project.data_policy_habitatcomplexity,
      })
    })
  }, [databaseSwitchboardInstance, projectId])

  const label = (
    <>
      <IconDownload /> Export To XLSX
    </>
  )

  const handleExportSubmitted = (protocol) => {
    const dataPolicyLabel = getDataSharingPolicyLabel(projectDataPolicy[protocol])
    const sampleEventCount = getSampleEventCount(submittedRecordsForUiDisplay, protocol)

    setExportingDataPolicy(dataPolicyLabel)
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
    setExportingDataPolicy('')
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
            <DropdownItemStyle as="button" onClick={() => handleExportSubmitted('fishbelt')}>
              Fish Belt
            </DropdownItemStyle>
            <DropdownItemStyle as="button" onClick={() => handleExportSubmitted('benthicpit')}>
              Benthic PIT
            </DropdownItemStyle>
            <DropdownItemStyle as="button" onClick={() => handleExportSubmitted('benthiclit')}>
              Benthic LIT
            </DropdownItemStyle>
            <DropdownItemStyle as="button" onClick={() => handleExportSubmitted('benthicpqt')}>
              Benthic Photo Quadrat
            </DropdownItemStyle>
            <DropdownItemStyle as="button" onClick={() => handleExportSubmitted('bleachingqc')}>
              Bleaching
            </DropdownItemStyle>
            <DropdownItemStyle
              as="button"
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
        exportingDataPolicy={exportingDataPolicy}
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
      protocol: PropTypes.string,
    }),
  ).isRequired,
}

export default SubmittedToolbarSection
