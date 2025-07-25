import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import theme from '../../theme'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import {
  mediaQueryPhoneOnly,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'
import { ButtonCallout, IconButton } from '../generic/buttons'
import { Input, inputStyles } from '../generic/form'
import OfflineHide from '../generic/OfflineHide'
import ProjectModal from '../ProjectCard/ProjectModal'
import { MuiTooltip } from '../generic/MuiTooltip'
import { IconGlobe } from '../icons'
import { useTranslation } from 'react-i18next'

const GlobalWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid;
  position: fixed;
  top: ${theme.spacing.headerHeight};
  background-color: ${theme.color.white};
  z-index: ${theme.zIndex.nestedStickyPageHeader};
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

const BiggerIconGlobe = styled(IconGlobe)`
  width: ${theme.typography.mediumIconSize};
  height: ${theme.typography.mediumIconSize};
`

const ProjectToolBarSection = ({
  projectFilter,
  setProjectFilter,
  projectSortKey,
  setProjectSortKey,
  setIsProjectSortAsc,
  addProjectToProjectsPage,
  handleExploreButtonClick,
}) => {
  const { isAppOnline } = useOnlineStatus()
  const { t } = useTranslation()

  const setFilter = (event) => {
    setProjectFilter(event.target.value)
  }

  const setSortBy = (event) => {
    setProjectSortKey(event.target.value)
    if (event.target.value === 'updated_on') {
      setIsProjectSortAsc(false)
    }
    if (event.target.value === 'name') {
      setIsProjectSortAsc(true)
    }
    if (event.target.value === 'countries') {
      setIsProjectSortAsc(true)
    }
  }

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)

  return (
    <GlobalWrapper>
      <RowWrapper>
        <HeaderStyle>
          {t('projects.projects')}
          {isAppOnline && (
            <MuiTooltip title={t('go_to_explore_projects')} placement="top" arrow>
              <IconButton
                type="button"
                aria-label={t('go_to_explore_projects')}
                onClick={handleExploreButtonClick}
              >
                <BiggerIconGlobe />
              </IconButton>
            </MuiTooltip>
          )}
        </HeaderStyle>
        <OfflineHide>
          <ButtonCallout
            onClick={() => setIsNewProjectModalOpen(true)}
            aria-label={t('projects.new_project')}
            disabled={!isAppOnline}
          >
            <span>{t('projects.new_project')}</span>
          </ButtonCallout>
          <ProjectModal
            isOpen={isNewProjectModalOpen}
            onDismiss={() => setIsNewProjectModalOpen(false)}
            project={null}
            addProjectToProjectsPage={addProjectToProjectsPage}
          />
        </OfflineHide>
      </RowWrapper>
      <FilterRowWrapper>
        <FilterLabelWrapper htmlFor="filter_projects" value={projectFilter} onChange={setFilter}>
          {t('projects.filter_projects')}
          <Input type="text" id="filter_projects" />
        </FilterLabelWrapper>
        <SortByLabelWrapper htmlFor="sort_by">
          {t('projects.sort_by')}
          <select id="sort_by" onChange={setSortBy} value={projectSortKey}>
            <option value="updated_on">{t('projects.last_updated_date')}</option>
            <option value="name">{t('projects.project_name')}</option>
            <option value="countries">{t('projects.country')}</option>
          </select>
        </SortByLabelWrapper>
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
  setIsProjectSortAsc: PropTypes.func.isRequired,
  addProjectToProjectsPage: PropTypes.func.isRequired,
  handleExploreButtonClick: PropTypes.func.isRequired,
}
