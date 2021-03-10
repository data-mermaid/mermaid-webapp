import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { H2 } from '../generic/text'
import { Row } from '../generic/positioning'
import { NavLinkButtonishIcon } from '../generic/links'
import { IconHome } from '../icons'

/**
 * Describe your component
 */

const ProjectNameWrapper = styled(Row)`
  align-items: center;
  padding: 0px 10px;
  border-bottom: thin solid grey;
`

const ProjectName = ({ pageTitle }) => {
  return (
    <ProjectNameWrapper>
      <NavLinkButtonishIcon to="/">
        <IconHome />
      </NavLinkButtonishIcon>
      <H2>{pageTitle}</H2>
    </ProjectNameWrapper>
  )
}

ProjectName.propTypes = {
  pageTitle: PropTypes.string.isRequired,
}

export default ProjectName
