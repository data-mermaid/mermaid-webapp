import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import { H2 } from '../generic/text'
import {
  mediaQueryTabletLandscapeOnly,
  mediaQueryPhoneOnly,
} from '../../library/styling/mediaQueries'
import { NavLinkThatLooksLikeButtonIcon } from '../generic/links'
import { IconHome } from '../icons'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../library/useIsMounted'

const ProjectNameWrapper = styled('div')`
  background: ${theme.color.white};
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  h2 {
    overflow-x: scroll;
    white-space: nowrap;
    padding: ${theme.spacing.medium} 0;
    height: 100%;
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
    grid-template-columns: ${(props) =>
        props.theme.spacing.sideNavWidthTabletLandscapeOnly} 1fr;
    h2 {
      padding-left: ${(props) => props.theme.spacing.medium};
    }
  `)}
  ${mediaQueryPhoneOnly(css`
    grid-template-columns: ${(props) =>
        props.theme.spacing.sideNavWidthPhoneOnly} 1fr;
    h2 {
      font-size: smaller;
      padding: ${theme.spacing.small} ${theme.spacing.xsmall}
        ${theme.spacing.small} 0;
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
// const StyledIconHome = styled(IconHome)``
const ProjectName = () => {
  const [projectName, setProjectName] = useState('')
  const isMounted = useIsMounted()
  const { projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const _getProjectName = useEffect(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance
        .getProject(projectId)
        .then((projectResponse) => {
          if (isMounted.current) { setProjectName(projectResponse.name) }
        })
    }
  }, [databaseSwitchboardInstance, isMounted, projectId])

  return (
    <ProjectNameWrapper>
      <NavLinkThatLooksLikeButtonIcon to="/">
        <IconHome />
      </NavLinkThatLooksLikeButtonIcon>
      <H2>{projectName}</H2>
    </ProjectNameWrapper>
  )
}

export default ProjectName
