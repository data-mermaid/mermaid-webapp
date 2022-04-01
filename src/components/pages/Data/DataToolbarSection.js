import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import theme from '../../../theme'
import { H2 } from '../../generic/text'
import { Column, ToolBarRow } from '../../generic/positioning'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import { hoverState } from '../../../library/styling/mediaQueries'

import { IconDownload } from '../../icons'

const TemporarySpanStyling = styled.span`
  color: grey;
  padding: 0.5rem 1rem;
`

const DropdownItemStyle = styled.button`
  padding: 0.5rem 1rem;
  cursor: pointer;
  ${hoverState(css`
    background-color: ${theme.color.primaryHover};
    color: ${theme.color.white};
  `)}
`

const DataToolbarSection = ({ name, handleGlobalFilterChange, handleExportToCSV }) => {
  const label = (
    <>
      <IconDownload /> Export To CSV
    </>
  )

  return (
    <>
      <H2>Submitted</H2>
      <ToolBarRow>
        <FilterSearchToolbar name={name} handleGlobalFilterChange={handleGlobalFilterChange} />
        <ButtonSecondaryDropdown label={label}>
          <Column as="nav" data-testid="export-to-csv">
            <DropdownItemStyle as="span" onClick={() => handleExportToCSV('Fish Belt')}>
              Fish Belt
            </DropdownItemStyle>
            <TemporarySpanStyling>Benthic LIT</TemporarySpanStyling>
            <TemporarySpanStyling>Benthic PIT</TemporarySpanStyling>
            <TemporarySpanStyling>Habitat Complexity</TemporarySpanStyling>
            <TemporarySpanStyling>Colonies Bleached</TemporarySpanStyling>
            <TemporarySpanStyling>Quadrat Percentage</TemporarySpanStyling>
          </Column>
        </ButtonSecondaryDropdown>
      </ToolBarRow>
    </>
  )
}

DataToolbarSection.propTypes = {
  name: PropTypes.string.isRequired,
  handleGlobalFilterChange: PropTypes.func.isRequired,
  handleExportToCSV: PropTypes.func.isRequired,
}

export default DataToolbarSection
