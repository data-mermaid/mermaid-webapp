import { useParams } from 'react-router-dom'
import PropTypes, { string } from 'prop-types'
import React, { useEffect, useState } from 'react'

import { Column, FilterItems, ToolBarItemsRow } from '../../generic/positioning'
import { H2 } from '../../generic/text'
import { IconDownload } from '../../icons'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import MethodsFilterDropDown from '../../MethodsFilterDropDown/MethodsFilterDropDown'
import FilterIndicatorPill from '../../generic/FilterIndicatorPill/FilterIndicatorPill'
import { DropdownItemStyle } from '../../generic/ButtonSecondaryDropdown/ButtonSecondaryDropdown.styles'
import SuccessExportModal from '../../SuccessExportModal/SuccessExportModal'
import { toast } from 'react-toastify'
import { ButtonSecondary } from '../../generic/buttons'

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
}) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const [isSuccessExportModalOpen, setIsSuccessExportModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const _getSupportingData = useEffect(() => {
    databaseSwitchboardInstance.getProject(projectId).then((project) => {
      console.log('Project data:', project)
    })
  }, [databaseSwitchboardInstance, projectId])

  const label = (
    <>
      <IconDownload /> Export To XLSX
    </>
  )

  const handleExportSubmitted = (protocol) => {
    setIsExporting(true)

    databaseSwitchboardInstance
      .exportSubmittedRecords({ projectId, protocol })
      .catch(() => {
        toast.error('There was an error exporting the report.')
      })
      .finally(() => {
        setIsSuccessExportModalOpen(true)
        setIsExporting(false)
      })
  }

  const clearFilters = () => {
    setMethodsFilter([])
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: '' })
    handleGlobalFilterChange('')
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
        {isExporting ? (
          <ButtonSecondary disabled={isExporting}>
            <IconDownload /> Exporting...
          </ButtonSecondary>
        ) : (
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
        )}
      </ToolBarItemsRow>
      <SuccessExportModal
        projectId={projectId}
        isOpen={isSuccessExportModalOpen}
        onDismiss={() => setIsSuccessExportModalOpen(false)}
      />
    </>
  )
}

SubmittedToolbarSection.propTypes = {
  name: PropTypes.string.isRequired,
  globalSearchText: PropTypes.string.isRequired,
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
}

export default SubmittedToolbarSection
