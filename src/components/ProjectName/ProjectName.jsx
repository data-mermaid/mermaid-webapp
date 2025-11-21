import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { styled, css } from 'styled-components'
import theme from '../../theme'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../library/useIsMounted'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { openExploreLinkWithBbox } from '../../library/openExploreLinkWithBbox'
import { PROJECT_CODES } from '../../library/constants/constants'
import { IconGlobe } from '../icons'
import { MuiTooltip } from '../generic/MuiTooltip'
import { IconButton } from '../generic/buttons'
import { useTranslation } from 'react-i18next'

const ProjectNameWrapper = styled('div')`
  background: ${theme.color.white};
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

  const _getProjectName = useEffect(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getProject(projectId).then((projectResponse) => {
        if (isMounted.current) {
          setProject(projectResponse)
        }
      })
    }
  }, [databaseSwitchboardInstance, isMounted, projectId])

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

  const renderExploreButton = () => {
    const isTestProject = project?.status === PROJECT_CODES.status.test

    if (!isAppOnline || isTestProject) {
      return null
    }

    return (
      <MuiTooltip title={t('go_to_explore_this_project')} placement="top" arrow>
        <IconButton
          type="button"
          aria-label={t('go_to_explore_this_project')}
          onClick={handleExploreButtonClick}
        >
          <BiggerIconGlobe />
        </IconButton>
      </MuiTooltip>
    )
  }

  return (
    <ProjectNameWrapper>
      <ProjectNameHeader>{project?.name}</ProjectNameHeader>
      {renderExploreButton()}
    </ProjectNameWrapper>
  )
}

export default ProjectName
