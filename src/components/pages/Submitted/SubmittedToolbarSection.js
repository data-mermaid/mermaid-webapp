import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'

import { Column, ToolBarRow } from '../../generic/positioning'
import { H2 } from '../../generic/text'
import { hoverState } from '../../../library/styling/mediaQueries'
import { IconDownload } from '../../icons'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
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

const SubmittedToolbarSection = ({ name, handleGlobalFilterChange, filterValue, disabled }) => {
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

  return (
    <>
      <H2>Submitted</H2>
      <ToolBarRow>
        <FilterSearchToolbar
          name={name}
          handleGlobalFilterChange={handleGlobalFilterChange}
          value={filterValue}
          disabled={disabled}
        />
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
      </ToolBarRow>
    </>
  )
}

SubmittedToolbarSection.defaultProps = {
  filterValue: undefined,
  disabled: false,
}

SubmittedToolbarSection.propTypes = {
  name: PropTypes.string.isRequired,
  handleGlobalFilterChange: PropTypes.func.isRequired,
  filterValue: PropTypes.string,
  disabled: PropTypes.bool,
}

export default SubmittedToolbarSection
