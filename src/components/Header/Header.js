import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import React, { useState } from 'react'
import theme from '../../theme'
import Logo from '../../assets/mermaid-logo.svg'
import { ButtonThatLooksLikeLink } from '../generic/buttons'
import { IconBell, IconMenu, IconDown, IconUser } from '../icons'
import { hoverState, mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import HideShow from '../generic/HideShow'
import OfflineHide from '../generic/OfflineHide'
import ProfileModal from '../ProfileModal'

const StyledHeader = styled('header')`
  background-color: ${theme.color.headerColor};
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  /* color: ${theme.color.white}; */
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
  height: ${theme.spacing.headerHeight};
  cursor: pointer;
  border-bottom: solid ${theme.spacing.borderLarge} transparent;
  text-decoration: none;
  position: relative;
  margin: 0 ${theme.spacing.small};
  display: inline-block;
  padding: 0;
  line-height: ${theme.spacing.headerHeight};
  ${hoverState(
    css`
      border-bottom: solid 3px ${theme.color.callout};
    `,
  )}
`
const HeaderButtonThatLooksLikeLink = styled(ButtonThatLooksLikeLink)`
  ${linkStyles}
`
const dropdownLinkStyles = css`
  ${linkStyles};
  border-width: 0 0 3px 0;
  background: none;
  display: inline-block;
  margin: 0;
  padding: ${theme.spacing.small} ${theme.spacing.large};
  width: 100%;
  ${hoverState(
    css`
      &:after {
        content: '';
        position: absolute;
        width: 55px;
        height ${theme.spacing.borderSmall};
        background: ${theme.color.callout};
        bottom: 0;
        left: ${theme.spacing.large};
      }
      border-color: transparent;
    `,
  )}
`
const StyledNavLink = styled('a')`
  ${linkStyles}
  ${(props) =>
    props.disabledLink &&
    css`
      color: ${theme.color.disabledText};
      pointer-events: none;
    `} 
  }
  `

const GlobalNav = styled('nav')`
  .desktop {
    display: flex;
    align-items: stretch;
    div,
    div p {
      display: inline-block;
    }
    div p {
      ${linkStyles}
    }
    .desktopUserMenu,
    .mobileUserMenu {
      position: absolute;
      top: calc(${theme.spacing.headerHeight} + ${theme.spacing.small});
      right: 0;
      background-color: ${theme.color.headerDropdownMenuBackground};
      border-radius: 8px 0 8px 8px;
    }
  }
  .mobile {
    display: none;
    align-items: stretch;
    button.trigger {
      border: none;
      font-size: larger;
      background: none;
    }
    .menuDropdown {
      background-color: ${theme.color.headerDropdownMenuBackground};
      border-radius: 8px 0 8px 8px;
      top: calc(${theme.spacing.headerHeight} + 1px);
      right: 1px;
      position: absolute;
    }
    a,
    div p,
    button {
      display: block;
      text-decoration: none;
      text-align: right;
      padding: ${theme.spacing.small} ${theme.spacing.medium};
      margin: 0;
      width: 100%;
      white-space: nowrap;
      font-size: smaller;
      line-height: 1;
      &:hover {
        border: none;
        &:after {
          display: none;
        }
      }
    }
    .loggedInAs {
      margin-bottom: ${theme.spacing.xlarge};
      background: ${theme.color.primaryColor};
      color: ${theme.color.white};
    }
  }
  ${mediaQueryTabletLandscapeOnly(css`
    .desktop {
      display: none;
    }
    .mobile {
      display: flex;
    }
  `)}
`
const UserMenuButton = styled.button`
  ${dropdownLinkStyles}
  display: flex;
  flex-direction: row-reverse;
`

const GlobalLinks = () => (
  <>
    <StyledNavLink href="/projects">Projects</StyledNavLink>
    <OfflineHide>
      <StyledNavLink href="/#" disabledLink>
        Reports
      </StyledNavLink>
    </OfflineHide>

    <StyledNavLink
      href="https://dev-collect.datamermaid.org/#/reference/home"
      target="_blank"
      rel="noreferrer"
    >
      Reference
    </StyledNavLink>
    <OfflineHide>
      <StyledNavLink href="https://dashboard.datamermaid.org/" target="_blank" rel="noreferrer">
        Global Dashboard
      </StyledNavLink>
    </OfflineHide>
  </>
)

const Header = ({ logout, currentUser }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const openProfileModal = () => setIsProfileModalOpen(true)
  const closeProfileModal = () => setIsProfileModalOpen(false)

  const UserMenuDropDownContent = () => (
    <OfflineHide>
      <UserMenuButton onClick={openProfileModal}>Profile</UserMenuButton>
      <UserMenuButton onClick={logout}>Logout</UserMenuButton>
    </OfflineHide>
  )

  const getUserButton = () => {
    // Avatar
    if (currentUser && currentUser.picture) {
      return (
        <p>
          <img src={currentUser.picture} alt="" />
        </p>
      )
    }

    // First name
    if (currentUser && currentUser.first_name) {
      return (
        <p>
          {currentUser && currentUser.first_name} <IconDown />
        </p>
      )
    }

    // Full name
    if (currentUser && currentUser.full_name) {
      return (
        <p>
          {currentUser && currentUser.full_name} <IconDown />
        </p>
      )
    }

    // User icon
    return (
      <p>
        <IconUser />
      </p>
    )
  }

  const getUserDisplayName = () => {
    if (currentUser && currentUser.first_name) {
      return currentUser.first_name
    }

    if (currentUser && currentUser.first_name) {
      return currentUser.full_name
    }

    return currentUser.email
  }

  return (
    <>
      <StyledHeader>
        <Link to="/projects">
          <img src={Logo} alt="MERMAID Logo" />
        </Link>
        <GlobalNav>
          <div className="desktop">
            <GlobalLinks />
            <HeaderButtonThatLooksLikeLink>
              <IconBell />
            </HeaderButtonThatLooksLikeLink>
            <HideShow
              button={getUserButton()}
              contents={
                <div className="desktopUserMenu">
                  <UserMenuDropDownContent />
                </div>
              }
            />
          </div>
          <div className="mobile">
            <HeaderButtonThatLooksLikeLink>
              <IconBell />
            </HeaderButtonThatLooksLikeLink>
            <HideShow
              button={
                <HeaderButtonThatLooksLikeLink>
                  <IconMenu />
                </HeaderButtonThatLooksLikeLink>
              }
              contents={
                <div className="menuDropdown">
                  <GlobalLinks />
                  {currentUser && <p className="loggedInAs">Logged in as {getUserDisplayName()}</p>}
                  <div className="mobileUserMenu">
                    <UserMenuDropDownContent />
                  </div>
                </div>
              }
            />
          </div>
        </GlobalNav>
      </StyledHeader>
      <ProfileModal isOpen={isProfileModalOpen} onDismiss={closeProfileModal} />
    </>
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
