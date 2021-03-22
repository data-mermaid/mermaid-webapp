import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import { H2 } from '../generic/text'
import {
  mediaQueryTabletLandscapeOnly,
  mediaQueryPhoneOnly,
} from '../../library/styling/mediaQueries'
import { NavLinkButtonishIcon } from '../generic/links'
import { IconHome } from '../icons'

const ProjectNameWrapper = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  ${mediaQueryTabletLandscapeOnly(css`
    grid-template-columns: ${theme.spacing.sideNavWidthTabletLandscapeOnly} 1fr;
  `)}
  ${mediaQueryPhoneOnly(css`
    grid-template-columns: ${theme.spacing.sideNavWidthPhoneOnly} 1fr;
  `)}
  align-items: center;
  border-bottom: 1px solid ${theme.color.border};
  h2 {
    overflow-x: scroll;
    white-space: nowrap;
    padding: ${theme.spacing.medium} ${theme.spacing.small}
      ${theme.spacing.medium} 0;
    height: 100%;
    margin: 0;
  }
  a {
    font-size: larger;
    border: none;
    background: none;
  }
  ${mediaQueryPhoneOnly(css`
    h2 {
      font-size: smaller;
      padding: ${theme.spacing.small} ${theme.spacing.xsmall}
        ${theme.spacing.small} 0;
    }
    a {
      font-size: initial;
    }
  `)}
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
