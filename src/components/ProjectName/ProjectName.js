import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import { H2 } from '../generic/text'
import {
  mediaQueryTabletLandscapeOnly,
  mediaQueryPhoneOnly,
} from '../../library/styling/mediaQueries'
import { NavLinkThatLooksLikeButtonIcon } from '../generic/links'
import { IconHome } from '../icons'

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
const ProjectName = ({ pageTitle }) => {
  return (
    <ProjectNameWrapper>
      <NavLinkThatLooksLikeButtonIcon to="/">
        <IconHome />
      </NavLinkThatLooksLikeButtonIcon>
      <H2>{pageTitle}</H2>
    </ProjectNameWrapper>
  )
}

ProjectName.propTypes = {
  pageTitle: PropTypes.string.isRequired,
}

export default ProjectName
