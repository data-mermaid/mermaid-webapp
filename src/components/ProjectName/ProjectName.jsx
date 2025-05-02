import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled, { css } from 'styled-components'
import theme from '../../theme'
import language from '../../language'
import { mediaQueryPhoneOnly, hoverState } from '../../library/styling/mediaQueries'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../library/useIsMounted'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { useExploreLaunchFeature } from '../../library/useExploreLaunchFeature'
import { getToastArguments } from '../../library/getToastArguments'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { IconGlobe } from '../icons'
import { MuiTooltip } from '../generic/MuiTooltip'
import { IconButton } from '../generic/buttons'

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

const ProjectNameLink = styled('a')`
  padding: 0 ${theme.spacing.small};
  font-size: ${theme.typography.smallFontSize};
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.small};
  white-space: nowrap;
  text-decoration: none;
  border: solid 1px ${theme.color.border};
  opacity: 0.7;
  ${hoverState(css`
    background: ${theme.color.secondaryHover};
  `)}
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
  const { currentUser } = useCurrentUser()
  const { mermaidExploreLink, isExploreLaunchEnabledForUser } = useExploreLaunchFeature({
    currentUser,
  })
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
    const { name, bbox } = project
    const queryParams = new URLSearchParams({ project: name })

    if (bbox) {
      queryParams.append('bbox', `${bbox.xmin},${bbox.ymin},${bbox.xmax},${bbox.ymax}`)
    }

    window.open(`${mermaidExploreLink}/?${queryParams.toString()}`, '_blank')
  }

  const renderExploreButton = () => {
    const isTestProject = project?.status < 90

    if (!isAppOnline || isTestProject) {
      return null
    }

    const exploreButtonContent = isExploreLaunchEnabledForUser ? (
      <MuiTooltip title={language.pages.gotoExplore('this project')} placement="top" arrow>
        <IconButton
          type="button"
          aria-label="View MERMAID Explore"
          onClick={handleExploreButtonClick}
        >
          <BiggerIconGlobe />
        </IconButton>
      </MuiTooltip>
    ) : (
      <ProjectNameLink href={`${mermaidExploreLink}/?project=${project?.name}`} target="_blank">
        <IconGlobe />
        <span>{language.pages.goToDashboard}</span>
      </ProjectNameLink>
    )

    return exploreButtonContent
  }

  return (
    <ProjectNameWrapper>
      <ProjectNameHeader>{project?.name}</ProjectNameHeader>
      {renderExploreButton()}
    </ProjectNameWrapper>
  )
}

export default ProjectName
