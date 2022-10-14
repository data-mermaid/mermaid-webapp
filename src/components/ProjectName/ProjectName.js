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

const ProjectNameWrapper = styled('div')`
  background: ${theme.color.white};
  h2 {
    padding: ${theme.spacing.medium};
    min-height: 55px;
    margin: 0;
  }
  a {
    border: none;
    background: none;
    text-align: center;
    svg {
      width: ${(props) => props.theme.typography.largeIconSize};
      height: ${(props) => props.theme.typography.largeIconSize};
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
const ProjectName = () => {
  const [projectName, setProjectName] = useState('')
  const isMounted = useIsMounted()
  const { projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

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
    </ProjectNameWrapper>
  )
}

export default ProjectName
