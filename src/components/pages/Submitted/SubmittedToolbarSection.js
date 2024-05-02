import { useParams } from 'react-router-dom'
import PropTypes, { string } from 'prop-types'
import React from 'react'

import { Column, FilterItems, ToolBarItemsRow } from '../../generic/positioning'
import { H2 } from '../../generic/text'
import { IconDownload } from '../../icons'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import MethodsFilterDropDown from '../../MethodsFilterDropDown/MethodsFilterDropDown'
import FilterIndicatorPill from '../../generic/FilterIndicatorPill/FilterIndicatorPill'
import { DropdownItemStyle } from '../../generic/ButtonSecondaryDropdown/ButtonSecondaryDropdown.styles'

const SubmittedToolbarSection = ({
  name,
  globalSearchText,
  handleGlobalFilterChange,
  handleMethodsColumnFilterChange,
  methodFilterValue,
  disabled,
  unfilteredRowLength,
  methodFilteredRowLength,
  searchFilteredRowLength,
  isSearchFilterEnabled,
  isMethodFilterEnabled,
  setMethodsFilter,
  handleSetTableUserPrefs,
}) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()

  const label = (
    <>
      <IconDownload /> Export To XLSX
    </>
  )

  const handleExportSubmitted = (protocol) => {
    databaseSwitchboardInstance.exportSubmittedRecords({ projectId, protocol })
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
    </>
  )
}

SubmittedToolbarSection.defaultProps = {
  methodFilterValue: [],
  disabled: false,
  methodFilteredRowLength: null,
  searchFilteredRowLength: null,
  isMethodFilterEnabled: false,
  isSearchFilterEnabled: false,
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
