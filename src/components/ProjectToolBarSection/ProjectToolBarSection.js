import React from 'react'
import styled from 'styled-components/macro'
import { ButtonPrimary } from '../generic/buttons'
import { IconSortDown } from '../icons'

const GlobalWrapper = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid;
`

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 10px;
`

const HeaderStyle = styled.h1`
  flex-grow: 1;
  font-size: 30px;
  text-transform: uppercase;
`

const FilterLabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  margin-right: 10px;
`

const SortByLabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  margin-right: 10px;

  & > select {
    height: 21px;
  }
`

const ProjectToolBarSection = () => {
  return (
    <GlobalWrapper>
      <RowWrapper>
        <HeaderStyle>Projects</HeaderStyle>
        <ButtonPrimary>New Project</ButtonPrimary>
      </RowWrapper>
      <RowWrapper>
        <FilterLabelWrapper htmlFor="filter_projects">
          <div>Filter Projects By Name or Country</div>
          <input type="text" id="filter_projects" />
        </FilterLabelWrapper>
        <SortByLabelWrapper htmlFor="sort_by">
          <div>Sort By</div>
          <select id="sort_by">
            <option value="Projects">Project Name</option>
            <option value="Country">Country</option>
            <option value="NumberOfSites">Number of Sites</option>
            <option value="LastUpdated">Last Updated Dates</option>
          </select>
        </SortByLabelWrapper>
        <ButtonPrimary>
          <IconSortDown />
        </ButtonPrimary>
      </RowWrapper>
    </GlobalWrapper>
  )
}

export default ProjectToolBarSection
