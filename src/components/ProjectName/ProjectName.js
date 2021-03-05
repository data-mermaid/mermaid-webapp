import React from 'react'
import styled from 'styled-components/macro'
import { H2 } from '../generic/text'
import { Row } from '../generic/positioning'
import { NavLinkSidebar } from '../generic/links'
import { IconHome } from '../icons'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'

/**
 * Describe your component
 */

const ProjectNameWrapper = styled(Row)`
  align-items: center;
  padding: 0px 10px;
  border-bottom: thin solid grey;
`

const ProjectName = () => {
  const { projectId } = useCurrentProjectPath()

  return (
    <ProjectNameWrapper>
      <NavLinkSidebar to="/">
        <IconHome />
      </NavLinkSidebar>
      <H2>{projectId}</H2>
    </ProjectNameWrapper>
  )
}

export default ProjectName
