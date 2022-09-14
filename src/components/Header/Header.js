import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Logo from '../../assets/mermaid-logo.svg'
import { IconDown } from '../icons'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import HideShow from '../generic/HideShow'
import OfflineHide from '../generic/OfflineHide'
import {
  AvatarWrapper,
  GlobalNav,
  HeaderButtonThatLooksLikeLink,
  StyledHeader,
  LogoImg,
  CurrentUserImg,
  BiggerIconUser,
  StyledNavLink,
  NotificationIndicator,
  UserMenuButton,
  UserMenu,
  BiggerIconBell,
  BiggerIconMenu,
  LoggedInAs,
} from './Header.styles'
import ProfileModal from '../ProfileModal'
import BellNotificationDropDown from '../BellNotificationDropDown/BellNotificationDropDown'
import { useBellNotifications } from '../../App/BellNotificationContext'
import { useOnlineStatus } from '../../library/onlineStatusContext'

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
  const { notifications } = useBellNotifications()
  const { isAppOnline } = useOnlineStatus()

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
        <AvatarWrapper>
          <CurrentUserImg src={currentUser.picture} alt="" />
        </AvatarWrapper>
      )
    }

    // First name
    if (currentUser && currentUser.first_name) {
      return (
        <AvatarWrapper>
          {currentUser && currentUser.first_name} <IconDown />
        </AvatarWrapper>
      )
    }

    // Full name
    if (currentUser && currentUser.full_name) {
      return (
        <AvatarWrapper>
          {currentUser && currentUser.full_name} <IconDown />
        </AvatarWrapper>
      )
    }

    // User icon
    return (
      <AvatarWrapper>
        <BiggerIconUser />
      </AvatarWrapper>
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
          <LogoImg src={Logo} alt="MERMAID Logo" />
        </Link>
        <GlobalNav>
          <div className="desktop">
            <GlobalLinks />
            {isAppOnline && (
              <HideShow
                closeOnClickWithin={false}
                button={
                  <HeaderButtonThatLooksLikeLink>
                    <BiggerIconBell />
                    {notifications?.results?.length ? (
                      <NotificationIndicator>&bull;</NotificationIndicator>
                    ) : undefined}
                  </HeaderButtonThatLooksLikeLink>
                }
                contents={<BellNotificationDropDown />}
              />
            )}
            <HideShow
              closeOnClickWithin={true}
              button={getUserButton()}
              contents={
                <UserMenu>
                  {currentUser && <LoggedInAs>Logged in as {getUserDisplayName()}</LoggedInAs>}
                  <UserMenuDropDownContent />
                </UserMenu>
              }
            />
          </div>
          <div className="mobile">
            {isAppOnline && (
              <HideShow
                button={
                  <HeaderButtonThatLooksLikeLink>
                    <BiggerIconBell />
                    {notifications?.results?.length ? (
                      <NotificationIndicator>&bull;</NotificationIndicator>
                    ) : undefined}
                  </HeaderButtonThatLooksLikeLink>
                }
                contents={<BellNotificationDropDown />}
              />
            )}
            <HideShow
              button={
                <HeaderButtonThatLooksLikeLink>
                  <BiggerIconMenu />
                </HeaderButtonThatLooksLikeLink>
              }
              contents={
                <UserMenu>
                  <GlobalLinks />
                  {currentUser && <LoggedInAs>Logged in as {getUserDisplayName()}</LoggedInAs>}
                  <UserMenuDropDownContent />
                </UserMenu>
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
