import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Logo from '../../assets/mermaid-logo.svg'
import { IconBell, IconMenu, IconDown, IconUser } from '../icons'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import HideShow from '../generic/HideShow'
import OfflineHide from '../generic/OfflineHide'
import { GlobalNav, HeaderButtonThatLooksLikeLink, StyledHeader, StyledNavLink, UserMenuButton } from './Header.styles'
import ProfileModal from '../ProfileModal'
import BellNotificationDropDown from '../BellNotificationDropDown/BellNotificationDropDown'

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
          <HideShow
            button={<p><IconBell /></p>}
            contents={
              <div className="desktopUserMenu">
                <BellNotificationDropDown />
              </div>
            }
          />
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
                  <BellNotificationDropDown />
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
