import React from 'react'
import styled, { css } from 'styled-components/macro'
import {
  mediaQueryPhoneOnly,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSortDown } from '../icons'

const GlobalWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid;
  position: fixed;
  top: 4.2rem;
  background-color: ${(props) => props.theme.color.white};
  z-index: 9;
  ${mediaQueryPhoneOnly(css`
    font-size: smaller;
  `)}
`

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  width: ${(props) => props.theme.spacing.width};
  max-width: ${(props) => props.theme.spacing.maxWidth};
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.medium} 0;
  ${mediaQueryTabletLandscapeOnly(css`
    width: 100%;
    padding: ${(props) => props.theme.spacing.medium};
  `)}
`

const HeaderStyle = styled.h1`
  flex-grow: 1;
  ${(props) => props.theme.typography.upperCase};
  margin: 0;
`
const inputStyles = css`
  padding: ${(props) => props.theme.spacing.small};
  ${mediaQueryPhoneOnly(css`
    padding: ${(props) => props.theme.spacing.xsmall};
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
const ResponsiveButtonSecondary = styled(ButtonSecondary)`
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
        <ButtonPrimary>New Project</ButtonPrimary>
      </RowWrapper>
      <RowWrapper>
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
        <ResponsiveButtonSecondary>
          <IconSortDown />
        </ResponsiveButtonSecondary>
      </RowWrapper>
    </GlobalWrapper>
  )
}

export default ProjectToolBarSection
