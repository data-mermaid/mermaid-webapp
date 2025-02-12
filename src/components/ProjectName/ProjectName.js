import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import language from '../../language'
import { mediaQueryPhoneOnly, hoverState } from '../../library/styling/mediaQueries'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../library/useIsMounted'
import { IconGlobe } from '../icons'

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
const ProjectName = () => {
  const [projectName, setProjectName] = useState('')
  const [isTestProject, setIsTestProject] = useState(false)
  const isMounted = useIsMounted()
  const { projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const mermaidDashboardLink = process.env.REACT_APP_MERMAID_DASHBOARD_LINK

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

  return (
    <ProjectNameWrapper>
      <ProjectNameHeader>{projectName}</ProjectNameHeader>
      {!isTestProject ? (
        <ProjectNameLink href={`${mermaidDashboardLink}/?project=${projectName}`} target="_blank">
          <IconGlobe />
          <span>{language.pages.goToDashboard}</span>
        </ProjectNameLink>
      ) : null}
    </ProjectNameWrapper>
  )
}

export default ProjectName
