import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import React from 'react'
import colorHelper from 'color'
import theme from '../../theme'
import Logo from '../../assets/mermaid-logo.svg'
import { ButtonThatLooksLikeLink } from '../generic/buttons'
import { IconBell, IconMenu, IconDown } from '../icons'
import {
  hoverState,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { RowSpaceBetween } from '../generic/positioning'
import HideShow from '../generic/HideShow'
import OfflineHide from '../generic/OfflineHide'

/**
 * Mermaid Header
 */

const StyledHeader = styled('header')`
  background-color: ${theme.color.headerColor};
  display: flex;
  justify-content: space-between;
  color: ${theme.color.white};
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 102;
  height: ${theme.spacing.headerHeight};
  img {
    height: calc(${theme.spacing.headerHeight} - 10px);
    padding: 0 ${theme.spacing.small};
    margin-top: 5px;
    ${mediaQueryTabletLandscapeOnly(css`
      height: calc(${theme.spacing.headerHeight} - 15px);
      margin-top: 7px;
    `)}
  }
`
const linkStyles = css`
  color: ${theme.color.white};
  cursor: pointer;
  border-bottom: solid ${theme.spacing.borderLarge} transparent;
  text-decoration: none;
  position: relative;
  margin: 0 ${theme.spacing.small};
  padding: ${theme.spacing.small};
  ${hoverState(
    css`
      border-bottom: solid 3px ${theme.color.callout};
    `,
  )}
  &:active {
    /* background: ${theme.color.black.mix(colorHelper('white'), 0.2)}; */
  }
`
const BellButtonThatLooksLikeLink = styled(ButtonThatLooksLikeLink)`
  ${linkStyles}
`
const dropdownLinkStyles = css`
  ${linkStyles};
  border-width: 0 0 3px 0;
  background: none;
  display: block;
  margin: 0;
  padding: ${theme.spacing.small} ${theme.spacing.large};
  width: 100%;
  ${hoverState(
    css`
      &:after {
        content: '';
        position: absolute;
        width: 20px;
        height: ${theme.spacing.borderSmall};
        background: ${theme.color.callout};
        bottom: 0;
        left: ${theme.spacing.large};
      }
      border-color: transparent;
    `,
  )}
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
      top: calc(${theme.spacing.headerHeight} + ${theme.spacing.small});
      right: 0;
      background-color: ${theme.color.headerDropdownMenuBackground};
      border-radius: 8px 0 8px 8px;
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
      background-color: ${theme.color.headerDropdownMenuBackground};
      border-radius: 8px 0 8px 8px;
    }
    a,
    div p,
    button {
      display: block;
      text-decoration: none;
      color: ${theme.color.white};
      text-align: right;
      padding: ${theme.spacing.small} ${theme.spacing.medium};
      margin: 0;
      width: 100%;
      white-space: nowrap;
      font-size: smaller;
    }
    .mobileMenu {
      top: ${theme.spacing.headerHeight};
      right: 0;
    }
    .loggedInAs {
      background: ${theme.color.primaryColor};
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
const GlobalLinks = () => (
  <>
    <StyledNavLink to="/projects">Projects</StyledNavLink>
    <OfflineHide>
      <StyledNavLink to="/#">Reports</StyledNavLink>
    </OfflineHide>
    <StyledNavLink to="/#">Reference</StyledNavLink>
    <OfflineHide>
      <StyledNavLink to="/#">Global Dashboard</StyledNavLink>
    </OfflineHide>
  </>
)

const Header = ({ logout, currentUser }) => {
  const UserMenuDropDownContent = () => (
    <OfflineHide>
      <Link to="/#">Profile</Link>
      <UserMenuButton type="button" onClick={logout}>
        Logout
      </UserMenuButton>
    </OfflineHide>
  )

  return (
    <StyledHeader>
      <Link to="/projects">
        <img src={Logo} alt="MERMAID Logo" />
      </Link>
      <GlobalNav>
        <div className="desktop">
          <GlobalLinks />
          <BellButtonThatLooksLikeLink>
            <IconBell />
          </BellButtonThatLooksLikeLink>
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
  logout: PropTypes.func,
}
Header.defaultProps = {
  currentUser: undefined,
  logout: () => {},
}

export default Header
