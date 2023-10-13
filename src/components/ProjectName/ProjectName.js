import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import {
  mediaQueryTabletLandscapeOnly,
  mediaQueryPhoneOnly,
} from '../../library/styling/mediaQueries'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../library/useIsMounted'
import { IconGlobe } from '../icons'

const ProjectNameWrapper = styled('div')`
  background: ${theme.color.white};
  display: flex;
  align-items: center;
  h2 {
    padding: ${theme.spacing.medium};
    min-height: 60px;
    margin: 0;
  }
  a {
    border: none;
    background: none;
    text-align: center;
    padding-bottom: 0.2em;
    svg {
      width: 2rem;
      height: 2rem;
      background-color: rgb(19, 18, 74);
      color: #fff;
    }
  }
  ${mediaQueryTabletLandscapeOnly(css`
    h2 {
      padding-left: ${(props) => props.theme.spacing.medium};
    }
  `)}
  ${mediaQueryPhoneOnly(css`
    h2 {
      padding: ${theme.spacing.small};
    }
    a {
      font-size: initial;
      svg {
        width: ${(props) => props.theme.typography.defaultIconSize};
        height: ${(props) => props.theme.typography.defaultIconSize};
      }
    }
  `)}
`

const ProjectNameLink = styled('a')`
  display: flex;
  align-items: center;
  height: 2em;
  width: 2em;
`
const ProjectName = () => {
  const [projectName, setProjectName] = useState('')
  const isMounted = useIsMounted()
  const { projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const mermaidDashboardLink = process.env.REACT_APP_MERMAID_DASHBOARD_LINK

  const _getProjectName = useEffect(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getProject(projectId).then((projectResponse) => {
        if (isMounted.current) {
          setProjectName(projectResponse?.name)
        }
      })
    }
  }, [databaseSwitchboardInstance, isMounted, projectId])

  return (
    <ProjectNameWrapper>
      <h2>{projectName}</h2>
      <ProjectNameLink
        href={`${mermaidDashboardLink}/?project=${projectName}`}
        target="_blank"
        rel="noreferrer"
      >
        <IconGlobe />
      </ProjectNameLink>
    </ProjectNameWrapper>
  )
}

export default ProjectName
