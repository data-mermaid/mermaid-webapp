import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import {
  mediaQueryPhoneOnly,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'
import { ButtonCallout, ButtonSecondary } from '../generic/buttons'
import { IconSortDown, IconSortUp } from '../icons'
import { Input, inputStyles } from '../generic/form'
import OfflineHide from '../generic/OfflineHide'
import NewProjectModal from './NewProjectModal'

const GlobalWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid;
  position: fixed;
  top: ${theme.spacing.headerHeight};
  background-color: ${theme.color.white};
  z-index: 99;
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

const ProjectToolBarSection = ({
  projectFilter,
  setProjectFilter,
  projectSortKey,
  setProjectSortKey,
  isProjectSortAsc,
  setIsProjectSortAsc,
  addProjectToProjectsPage,
}) => {
  const setFilter = (event) => {
    setProjectFilter(event.target.value)
  }

  const { isAppOnline } = useOnlineStatus()

  const setSortBy = (event) => {
    setProjectSortKey(event.target.value)
  }

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)

  return (
    <GlobalWrapper>
      <RowWrapper>
        <HeaderStyle>Projects</HeaderStyle>
        <OfflineHide>
          <ButtonCallout
            onClick={() => setIsNewProjectModalOpen(true)}
            aria-label="New Project"
            disabled={!isAppOnline}
          >
            <span>New Project</span>
          </ButtonCallout>
          <NewProjectModal
            isOpen={isNewProjectModalOpen}
            onDismiss={() => setIsNewProjectModalOpen(false)}
            addProjectToProjectsPage={addProjectToProjectsPage}
          />
        </OfflineHide>
      </RowWrapper>
      <FilterRowWrapper>
        <FilterLabelWrapper htmlFor="filter_projects" value={projectFilter} onChange={setFilter}>
          Filter Projects By Name or Country
          <Input type="text" id="filter_projects" />
        </FilterLabelWrapper>
        <SortByLabelWrapper htmlFor="sort_by">
          Sort By
          <select id="sort_by" onChange={setSortBy} value={projectSortKey}>
            <option value="name">Project Name</option>
            <option value="countries">Country</option>
            <option value="num_sites">Number of Sites</option>
            <option value="updated_on">Last Updated Date</option>
          </select>
        </SortByLabelWrapper>
        <ButtonSecondary
          aria-label="sort-projects"
          onClick={() => setIsProjectSortAsc(!isProjectSortAsc)}
        >
          {isProjectSortAsc ? <IconSortDown /> : <IconSortUp />}
        </ButtonSecondary>
      </FilterRowWrapper>
    </GlobalWrapper>
  )
}

export default ProjectToolBarSection

ProjectToolBarSection.propTypes = {
  projectFilter: PropTypes.string.isRequired,
  setProjectFilter: PropTypes.func.isRequired,
  projectSortKey: PropTypes.string.isRequired,
  setProjectSortKey: PropTypes.func.isRequired,
  isProjectSortAsc: PropTypes.bool.isRequired,
  setIsProjectSortAsc: PropTypes.func.isRequired,
  addProjectToProjectsPage: PropTypes.func.isRequired,
}
