import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import Logo from '../../assets/mermaid-logo.svg'
import { IconBell, IconMenu, IconDown, IconUser } from '../icons'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import HideShow from '../generic/HideShow'
import OfflineHide from '../generic/OfflineHide'
import { GlobalNav, HeaderButtonThatLooksLikeLink, StyledHeader, StyledNavLink, UserMenuButton, NotificationCard, NotificationCardWrapper } from './Header.styles'

const GlobalLinks = () => (
  <>
    <StyledNavLink href="/projects">Projects</StyledNavLink>
    <OfflineHide>
      <StyledNavLink href="/#" disabled>
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
  const UserMenuDropDownContent = () => (
    <OfflineHide>
      <Link to="/#">Profile</Link>
      <UserMenuButton type="button" onClick={logout}>
        Logout
      </UserMenuButton>
    </OfflineHide>
  )

  const BellNotificationDropDownContent = () => (
    <NotificationCardWrapper>
      <NotificationCard>card goes here</NotificationCard>
    </NotificationCardWrapper>
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
    <StyledHeader>
      <Link to="/projects">
        <img src={Logo} alt="MERMAID Logo" />
      </Link>
      <GlobalNav>
        <div className="desktop">
          <GlobalLinks />
          {/* <HeaderButtonThatLooksLikeLink> */}
          <HideShow
            button={<p><IconBell /></p>}
            contents={
              <div className="desktopUserMenu">
                <BellNotificationDropDownContent />
              </div>
            }
          />
          {/* </HeaderButtonThatLooksLikeLink> */}
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
          <HideShow
            button={
              <HeaderButtonThatLooksLikeLink>
                <IconBell />
              </HeaderButtonThatLooksLikeLink>
            }
            contents={
              <div className="menuDropdown">
                <div className="mobileUserMenu">
                  < BellNotificationDropDownContent />
                </div>
              </div>
            }
          />
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
