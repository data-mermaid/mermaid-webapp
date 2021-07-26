import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { H2 } from '../../generic/text'
import { Column, RowBottom } from '../../generic/positioning'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'

import { IconDownload } from '../../icons'

const TemporarySpanStyling = styled.span`
  color: grey;
  padding: 0.5rem 1rem;
`

const DropdownItemStyle = styled.span`
  padding: 0.5rem 1rem;
`

const DataToolbarSection = ({ filterInputValue, handleFilterChange }) => {
  const label = (
    <>
      <IconDownload /> Export To CSV
    </>
  )

  return (
    <>
      <H2>Submitted</H2>
      <RowBottom>
        <FilterSearchToolbar
          filterInputValue={filterInputValue}
          handleFilterChange={handleFilterChange}
        />
        <ButtonSecondaryDropdown label={label}>
          <Column as="nav" data-testid="export-to-csv">
            <DropdownItemStyle>Fish Belt</DropdownItemStyle>
            <TemporarySpanStyling>Benthic LIT</TemporarySpanStyling>
            <TemporarySpanStyling>Benthic PIT</TemporarySpanStyling>
            <TemporarySpanStyling>Habitat Complexity</TemporarySpanStyling>
            <TemporarySpanStyling>Colonies Bleached</TemporarySpanStyling>
            <TemporarySpanStyling>Quadrat Percentage</TemporarySpanStyling>
          </Column>
        </ButtonSecondaryDropdown>
      </RowBottom>
    </>
  )
}

DataToolbarSection.propTypes = {
  filterInputValue: PropTypes.string.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
}

export default DataToolbarSection
