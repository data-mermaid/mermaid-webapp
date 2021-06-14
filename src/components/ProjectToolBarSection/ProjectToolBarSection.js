import React from 'react'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import {
  mediaQueryPhoneOnly,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'
import { ButtonCallout, ButtonSecondary } from '../generic/buttons'
import { IconSortDown } from '../icons'
import OfflineHide from '../generic/OfflineHide'

const GlobalWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid;
  position: fixed;
  top: ${theme.spacing.headerHeight};
  background-color: ${theme.color.white};
  z-index: 9;
  ${mediaQueryPhoneOnly(css`
    font-size: smaller;
  `)}
`

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  width: ${theme.spacing.width};
  max-width: ${theme.spacing.maxWidth};
  margin: 0 auto;
  padding: ${theme.spacing.medium} 0;
  ${mediaQueryTabletLandscapeOnly(css`
    width: 100%;
    padding: ${theme.spacing.medium};
  `)}
  ${mediaQueryPhoneOnly(css`
    font-size: smaller;
    padding: ${theme.spacing.small};
  `)}
`

const HeaderStyle = styled.h1`
  flex-grow: 1;
  ${theme.typography.upperCase};
  margin: 0;
`
const inputStyles = css`
  padding: ${theme.spacing.small};
  ${mediaQueryPhoneOnly(css`
    padding: ${theme.spacing.xsmall};
  `)}
`

const FilterLabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  margin-right: 10px;
  > input {
    ${inputStyles}
  }
`
const FilterRowWrapper = styled(RowWrapper)`
  ${mediaQueryPhoneOnly(css`
    button {
      display: none;
    }
  `)}
`
const SortByLabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  > select {
    ${inputStyles}
  }
  ${mediaQueryPhoneOnly(css`
    display: none;
  `)}
`

/**
 * Describe your component
 */

const ProjectToolBarSection = () => {
  return (
    <GlobalWrapper>
      <RowWrapper>
        <HeaderStyle>Projects</HeaderStyle>
        <OfflineHide>
          <ButtonCallout>New Project</ButtonCallout>
        </OfflineHide>
      </RowWrapper>
      <FilterRowWrapper>
        <FilterLabelWrapper htmlFor="filter_projects">
          Filter Projects By Name or Country
          <input type="text" id="filter_projects" />
        </FilterLabelWrapper>
        <SortByLabelWrapper htmlFor="sort_by">
          Sort By
          <select id="sort_by">
            <option value="Projects">Project Name</option>
            <option value="Country">Country</option>
            <option value="NumberOfSites">Number of Sites</option>
            <option value="LastUpdated">Last Updated Dates</option>
          </select>
        </SortByLabelWrapper>
        <ButtonSecondary aria-label="sort-projects">
          <IconSortDown />
        </ButtonSecondary>
      </FilterRowWrapper>
    </GlobalWrapper>
  )
}

export default ProjectToolBarSection
