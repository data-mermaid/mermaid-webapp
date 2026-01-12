import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import theme from '../../theme'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../library/useIsMounted'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { openExploreLinkWithBbox } from '../../library/openExploreLinkWithBbox'
import { IconGlobe } from '../icons'
import { MuiTooltip } from '../generic/MuiTooltip'
import { useTranslation } from 'react-i18next'
import buttonStyles from '../../style/buttons.module.scss'
import labelStyles from '../../style/labels.module.scss'

const ProjectNameWrapper = styled('div')`
  background: ${theme.color.white};
  display: flex;
  align-items: center;
  padding: ${theme.spacing.medium};
  ${mediaQueryPhoneOnly(css`
    padding: ${theme.spacing.small};
  `)}
`
const ProjectNameHeader = styled('h2')`
  display: inline;
  margin: 0 ${theme.spacing.small} 0 0;
`

const BiggerIconGlobe = styled(IconGlobe)`
  width: ${theme.typography.mediumIconSize};
  height: ${theme.typography.mediumIconSize};
`

const ProjectName = () => {
  const isMounted = useIsMounted()
  const { projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { t } = useTranslation()
  const [project, setProject] = useState({})

  // getProjectName
  useEffect(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getProject(projectId).then((projectResponse) => {
        if (isMounted.current) {
          setProject(projectResponse)
        }
      })
    }
  }, [databaseSwitchboardInstance, isMounted, projectId])

  const isDemoProject = project?.is_demo

  const handleExploreButtonClick = () => {
    if (!project) {
      return
    }

    const queryParamObject = {
      project: project.name,
      bbox: project.bbox,
    }

    openExploreLinkWithBbox(queryParamObject)
  }

  const tooltipText = isDemoProject
    ? 'projects.demo_explore_unavailable'
    : 'go_to_explore_this_project'

  return (
    <ProjectNameWrapper>
      <ProjectNameHeader>{project?.name}</ProjectNameHeader>
      {isAppOnline && (
        <MuiTooltip title={t(tooltipText)} placement="top" arrow>
          <span>
            <button
              className={buttonStyles['icon-button']}
              type="button"
              aria-label={tooltipText}
              onClick={handleExploreButtonClick}
              disabled={isDemoProject}
            >
              <BiggerIconGlobe />
            </button>
          </span>
        </MuiTooltip>
      )}
      {isDemoProject && (
        <div className={[labelStyles.pill, labelStyles.pill__demo].join(' ')}>
          {t('projects.demo')}
        </div>
      )}
    </ProjectNameWrapper>
  )
}

export default ProjectName
