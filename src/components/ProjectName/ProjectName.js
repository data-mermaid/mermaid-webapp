import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { H2 } from '../generic/text'
import { Row } from '../generic/positioning'
import { NavLinkSidebar } from '../generic/links'
import { IconHome } from '../icons'

/**
 * Describe your component
 */

const ProjectNameWrapper = styled(Row)`
  align-items: center;
  padding: 0px 10px;
  border-bottom: thin solid grey;
`

const ProjectName = ({ routePaths }) => {
  const hasOnlyOneRoute = routePaths.length === 1

  return (
    !hasOnlyOneRoute && (
      <ProjectNameWrapper as="nav">
        <NavLinkSidebar to="/">
          <IconHome />
        </NavLinkSidebar>
        <H2>Project Name</H2>
      </ProjectNameWrapper>
    )
  )
}

ProjectName.propTypes = {
  routePaths: PropTypes.arrayOf(
    PropTypes.shape({ path: PropTypes.string, name: PropTypes.string }),
  ).isRequired,
}

export default ProjectName
