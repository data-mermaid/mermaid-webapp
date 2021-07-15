import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import theme from '../../../theme'
import { mediaQueryPhoneOnly } from '../../../library/styling/mediaQueries'
import { H2 } from '../../generic/text'
import { Row, Column } from '../../generic/positioning'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import language from '../../../language'

import { IconDownload } from '../../icons'

const TemporarySpanStyling = styled.span`
  color: grey;
  padding: 0.5rem 1rem;
`

const DropdownItemStyle = styled.span`
  padding: 0.5rem 1rem;
`

const inputStyles = css`
  padding: ${theme.spacing.small};
  width: 50%;
  ${mediaQueryPhoneOnly(css`
    padding: ${theme.spacing.xsmall};
  `)}
`

const FilterLabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  margin-right: 10px;
  > input {
    ${inputStyles}
  }
`

const ToolbarRowWrapper = styled(Row)`
  align-items: flex-end;
`

const DataToolbarSection = ({ filterInputValue, handleFilterChange }) => {
  const [value, setValue] = useState(filterInputValue)

  const onInputFilterChange = useAsyncDebounce((inputValue) => {
    handleFilterChange(inputValue || undefined)
  }, 1000)

  const label = (
    <>
      <IconDownload /> Export To CSV
    </>
  )

  return (
    <>
      <H2>Submitted</H2>
      <ToolbarRowWrapper>
        <FilterLabelWrapper htmlFor="filter_projects">
          {language.pages.submittedTable.filterToolbarText}
          <input
            type="text"
            id="filter_projects"
            value={value || ''}
            onChange={(event) => {
              setValue(event.target.value)
              onInputFilterChange(event.target.value)
            }}
          />
        </FilterLabelWrapper>
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
      </ToolbarRowWrapper>
    </>
  )
}

DataToolbarSection.propTypes = {
  filterInputValue: PropTypes.string.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
}

export default DataToolbarSection
