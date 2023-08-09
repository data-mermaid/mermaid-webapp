import { useParams } from 'react-router-dom'
import PropTypes, { string } from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'

import { Column, FilterItems, ToolBarItemsRow } from '../../generic/positioning'
import { H2 } from '../../generic/text'
import { hoverState } from '../../../library/styling/mediaQueries'
import { IconDownload } from '../../icons'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import MethodsFilterDropDown from '../../MethodsFilterDropDown/MethodsFilterDropDown'
import FilterIndicatorPill from '../../generic/FilterIndicatorPill/FilterIndicatorPill'
import theme from '../../../theme'

const DropdownItemStyle = styled.button`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  ${hoverState(css`
    background-color: ${theme.color.secondaryHover};
  `)}
`

const SubmittedToolbarSection = ({
  name,
  handleGlobalFilterChange,
  handleMethodsColumnFilterChange,
  searchFilterValue,
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
            handleGlobalFilterChange={handleGlobalFilterChange}
            value={searchFilterValue}
            disabled={disabled}
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
  searchFilterValue: undefined,
  methodFilterValue: [],
  disabled: false,
  methodFilteredRowLength: null,
  searchFilteredRowLength: null,
  isMethodFilterEnabled: false,
  isSearchFilterEnabled: false,
}

SubmittedToolbarSection.propTypes = {
  name: PropTypes.string.isRequired,
  handleGlobalFilterChange: PropTypes.func.isRequired,
  handleMethodsColumnFilterChange: PropTypes.func.isRequired,
  searchFilterValue: PropTypes.string,
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
