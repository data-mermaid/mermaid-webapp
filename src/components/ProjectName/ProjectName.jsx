import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import theme from '../../theme'
import language from '../../language'
import { mediaQueryPhoneOnly, hoverState } from '../../library/styling/mediaQueries'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../library/useIsMounted'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { useExploreLaunchFeature } from '../../library/useExploreLaunchFeature'
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
    window.open(`${mermaidExploreLink}/?project=${projectName}`, '_blank')
  }

  return (
    <ProjectNameWrapper>
      <ProjectNameHeader>{projectName}</ProjectNameHeader>
      {!isTestProject ? (
        <MuiTooltip
          title={language.pages.gotoExplore(isExploreLaunchEnabledForUser, 'this project')}
          placement="top"
          arrow
        >
          <IconButton
            type="button"
            aria-label="View Mermaid Explore"
            onClick={handleExploreButtonClick}
          >
            <BiggerIconGlobe />
          </IconButton>
        </MuiTooltip>
      ) : null}
    </ProjectNameWrapper>
  )
}

export default ProjectName
