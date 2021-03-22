import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import React from 'react'
import colorHelper from 'color'
import Logo from '../../assets/mermaid-logo.svg'
import { IconMenu, IconDown } from '../icons'
import {
  mediaQueryForTabletLandscapeUp,
  hoverState,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'

import { currentUserPropType } from '../../library/mermaidData/useMermaidData'
import { RowSpaceBetween } from '../generic/positioning'
import HideShow from '../generic/HideShow'

/**
 * Mermaid Header
 */

const StyledHeader = styled(RowSpaceBetween)`
  background-color: ${(props) => props.theme.color.black};
  color: ${(props) => props.theme.color.white};
  align-items: flex-start;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 10;
  height: ${(props) => props.theme.spacing.headerHeight};
  img {
    height: calc(${(props) => props.theme.spacing.headerHeight} - 10px);
    padding: 0 ${(props) => props.theme.spacing.small};
    margin-top: 5px;
    ${mediaQueryTabletLandscapeOnly(css`
      img {
        height: calc(${(props) => props.theme.spacing.headerHeight} - 15px);
      }
    `)}
  }
`
const linkStyles = css`
  color: ${(props) => props.theme.color.white};
  cursor: pointer;
  border-bottom: solid 4px transparent;
  text-decoration: none;
  margin: 0;
  padding: ${(props) => props.theme.spacing.small};
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
`
const dropdownLinkStyles = css`
  ${linkStyles};
  border-width: 0 0 4px 0;
  background: none;
  display: block;
  color: ${(props) => props.theme.color.white};
  padding: ${(props) => props.theme.spacing.small}
    ${(props) => props.theme.spacing.large};
  width: 100%;
`
const StyledNavLink = styled(Link)`
  ${linkStyles}
`
const GlobalNav = styled('nav')`
  .desktop {
    div,
    div p {
      display: inline-block;
    }
    div p {
      ${linkStyles}
    }
    .desktopUserMenu {
      position: absolute;
      top: ${(props) => props.theme.spacing.headerHeight};
      right: 0;
      background-color: ${(props) => props.theme.color.black};
      border-style: solid;
      border-width: 0 1px 1px 1px;
      border-color: ${(props) => props.theme.color.border};
      a {
        ${dropdownLinkStyles}
      }
    }
  }
  .mobile {
    display: none;
    button.trigger {
      border: none;
      font-size: larger;
      background: none;
    }
    .menuDropdown {
      background-color: ${(props) => props.theme.color.black};
    }
    a,
    div p,
    button {
      display: block;
      text-decoration: none;
      color: ${(props) => props.theme.color.white};
      text-align: right;
      padding: ${(props) => props.theme.spacing.small}
        ${(props) => props.theme.spacing.medium};
      margin: 0;
      width: 100%;
      white-space: nowrap;
      font-size: smaller;
    }
    .mobileMenu {
      top: ${(props) => props.theme.spacing.headerHeight};
      right: 0;
    }
    .loggedInAs {
      background: ${(props) => props.theme.color.primaryColor};
    }
  }
  ${mediaQueryTabletLandscapeOnly(css`
    .desktop {
      display: none;
    }
    .mobile {
      display: block;
    }
  `)}
`
const UserMenuButton = styled.button`
  ${dropdownLinkStyles}
`

const Header = ({ logout, isOnline, currentUser }) => {
  const GlobalLinks = () => (
    <>
      <StyledNavLink to="/projects">Projects</StyledNavLink>
      <StyledNavLink to="/#">Reports</StyledNavLink>
      <StyledNavLink to="/#">Reference</StyledNavLink>
      <StyledNavLink to="/#">Global Dashboard</StyledNavLink>
    </>
  )
  const UserMenuDropDownContent = () => (
    <div>
      {isOnline && (
        <>
          <Link to="/#">Profile</Link>
          <UserMenuButton type="button" onClick={logout}>
            Logout
          </UserMenuButton>
        </>
      )}
    </div>
  )

  return (
    <StyledHeader>
      <Link to="/projects">
        <img className="mermaid-logo" src={Logo} alt="MERMAID Logo" />
      </Link>
      <GlobalNav>
        <div className="desktop">
          <GlobalLinks />
          <HideShow
            button={
              <p>
                {currentUser && currentUser.first_name} <IconDown />
              </p>
            }
            contents={
              <div className="desktopUserMenu">
                <UserMenuDropDownContent />
              </div>
            }
          />
        </div>
        <div className="mobile">
          <HideShow
            button={
              <button className="trigger" type="button">
                <IconMenu />
              </button>
            }
            contents={
              <div className="menuDropdown">
                <GlobalLinks />
                <p className="loggedInAs">
                  Logged in as {currentUser && currentUser.first_name}
                </p>
                <div className="mobileUserMenu">
                  <UserMenuDropDownContent />
                </div>
              </div>
            }
          />
        </div>
      </GlobalNav>
    </StyledHeader>
  )
}

Header.propTypes = {
  currentUser: currentUserPropType,
  isOnline: PropTypes.bool.isRequired,
  logout: PropTypes.func,
}
Header.defaultProps = {
  currentUser: undefined,
  logout: () => {},
}

export default Header
