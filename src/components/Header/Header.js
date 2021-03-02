import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import React, { useMemo } from 'react'
import colorHelper from 'color'
import ButtonMenu from '../generic/ButtonMenu'
import {
  mediaQueryForTabletLandscapeUp,
  hoverState,
  mediaQueryPhoneOnly,
} from '../../library/styling/mediaQueries'
import { RowSpaceBetween, RowRight } from '../generic/positioning'

/**
 * Mermaid Header
 */

const StyledHeader = styled(RowSpaceBetween)`
  background-color: ${(props) => props.theme.color.black};
  color: ${(props) => props.theme.color.white};
  align-items: flex-start;
  img {
    height: 36px;
    padding-top: ${(props) => props.theme.spacing.small};
    padding-left: ${(props) => props.theme.spacing.small};
    &.desktop-logo {
      display: none;
    }
    &.mobile-logo {
      display: block;
    }
    ${mediaQueryForTabletLandscapeUp(css`
      &.desktop-logo {
        display: block;
      }
      &.mobile-logo {
        display: none;
      }
    `)}
  }
`
const StyledNavLink = styled(Link)`
  color: ${(props) => props.theme.color.white};
  border-bottom: solid 4px transparent;
  text-decoration: none;
  margin: 0;
  padding: ${(props) => props.theme.spacing.small};
  opacity: 0.8;
  ${hoverState(
    css`
      border-bottom: solid 4px ${(props) => props.theme.color.white};
      opacity: 1;
    `,
  )}
  &:active {
    background: ${(props) =>
      props.theme.color.black.mix(colorHelper('white'), 0.2)};
  }
  ${mediaQueryPhoneOnly(css`
    font-size: smaller;
    padding: ${(props) => props.theme.spacing.small}
      ${(props) => props.theme.spacing.xsmall};
  `)}
`

const Header = ({ logout, isOnline }) => {
  const userMenuItems = useMemo(
    () => (isOnline ? [{ label: 'Logout', onClick: logout }] : []),
    [isOnline, logout],
  )

  return (
    <StyledHeader>
      <Link to="/projects">
        <img
          className="desktop-logo"
          src="./mermaid-logo.svg"
          alt="MERMAID Logo"
        />
        <img
          className="mobile-logo"
          src="./mermaid-logo-only.svg"
          alt="MERMAID Logo"
        />
      </Link>
      <RowRight as="nav">
        <StyledNavLink to="/projects">Projects</StyledNavLink>
        <StyledNavLink to="/#">Reports</StyledNavLink>
        <StyledNavLink to="/#">Reference</StyledNavLink>
        <StyledNavLink to="/#">Global Dashboard</StyledNavLink>
        <ButtonMenu label="Fake User" items={userMenuItems} />
      </RowRight>
    </StyledHeader>
  )
}

Header.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  logout: PropTypes.func,
}
Header.defaultProps = {
  logout: () => {},
}

export default Header
