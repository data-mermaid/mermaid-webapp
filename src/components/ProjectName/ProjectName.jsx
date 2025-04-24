import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
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
  const [projectName, setProjectName] = useState('')
  const [isTestProject, setIsTestProject] = useState(false)
  const isMounted = useIsMounted()
  const { projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { currentUser } = useCurrentUser()
  const { mermaidExploreLink, isExploreLaunchEnabledForUser } = useExploreLaunchFeature({
    currentUser,
  })

  const _getProjectName = useEffect(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getProject(projectId).then((projectResponse) => {
        if (isMounted.current) {
          setProjectName(projectResponse?.name)
          setIsTestProject(projectResponse?.status < 90)
        }
      })
    }
  }, [databaseSwitchboardInstance, isMounted, projectId])

  const handleExploreButtonClick = () => {
    if (!projectName) {
      toast.error(...getToastArguments(language.error.noProjectMermaidExplore))
      return
    }

    window.open(`${mermaidExploreLink}/?project=${projectName}`, '_blank')
  }

  const mermaidExploreButton = isExploreLaunchEnabledForUser ? (
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
    <ProjectNameLink href={`${mermaidExploreLink}/?project=${projectName}`} target="_blank">
      <IconGlobe />
      <span>{language.pages.goToDashboard}</span>
    </ProjectNameLink>
  )

  return (
    <ProjectNameWrapper>
      <ProjectNameHeader>{projectName}</ProjectNameHeader>
      {!isTestProject ? mermaidExploreButton : null}
    </ProjectNameWrapper>
  )
}

export default ProjectName
