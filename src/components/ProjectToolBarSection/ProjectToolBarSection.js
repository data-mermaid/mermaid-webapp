import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'

const GlobalWrapper = styled.div`
  padding: 10px 40px;
`

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 10px;
`

const HeaderStyle = styled.div`
  flex-grow: 1;
  font-size: 30px;
`

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  margin-right: 10px;
`

const SortByWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;

  & > select {
    height: 21px;
  }
`

/**
 * Describe your component
 */
const ProjectToolBarSection = () => {
  return (
    <GlobalWrapper>
      <RowWrapper>
        <HeaderStyle>PROJECTS</HeaderStyle>
        <div>New Project Button</div>
      </RowWrapper>
      <RowWrapper>
        <FilterWrapper>
          <label>Filter Projects By Name or Country</label>
          <input type="text" id="filter_projects" />
        </FilterWrapper>
        <SortByWrapper>
          <label>Sort By</label>
          <select id="sort_by">
            <option value="Projects">Project Name</option>
            <option value="Country">Country</option>
            <option value="NumberOfSites">Number of Sites</option>
            <option value="LastUpdated">Last Updated Dates</option>
          </select>
        </SortByWrapper>
        <div>Sort Button</div>
      </RowWrapper>
    </GlobalWrapper>
  )
}

// ProjectToolBarSection.propTypes = {}

export default ProjectToolBarSection
