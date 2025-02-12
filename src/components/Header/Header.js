import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

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
  WhatsNewLink,
  UserMenu,
  BiggerIconBell,
  MediumIconExcel,
  MediumIconOpenInNew,
  BiggerIconMenu,
  LoggedInAs,
  HeaderIconWrapper,
} from './Header.styles'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { IconDown, IconGlobe, IconLibraryBooks } from '../icons'
import { useBellNotifications } from '../../App/BellNotificationContext'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import BellNotificationDropDown from '../BellNotificationDropDown/BellNotificationDropDown'
import HideShow from '../generic/HideShow'
import Logo from '../../assets/mermaid-logo.svg'
import OfflineHide from '../generic/OfflineHide'
import ProfileModal from '../ProfileModal'

const GlobalLinks = () => {
  const { isAppOnline } = useOnlineStatus()
  const mermaidDashboardLink = process.env.REACT_APP_MERMAID_DASHBOARD_LINK
  const mermaidWhatsNewLink = process.env.REACT_APP_MERMAID_WHATS_NEW_LINK

  const handleReferenceMouseOver = (event) => {
    // we add a hack so when online the reference spreadsheet isnt pulled from an outdated cache.
    // (eg a user has just added a new fish species and it has been approved, but the service worker has cahed the old one)
    // we use a hover event instead of click so devs can confirm the strategy, and the hover behaviour shows the href in the
    // browser bottom left corner that will
    // be followed onClick (instead of a stale one from the last click)
    // eslint-disable-next-line no-param-reassign
    event.target.href = isAppOnline
      ? `${process.env.REACT_APP_MERMAID_REFERENCE_LINK}?nocache=${Date.now()}`
      : process.env.REACT_APP_MERMAID_REFERENCE_LINK
  }

  return (
    <>
      <StyledNavLink as={Link} to="/projects">
        <HeaderIconWrapper>
          <IconLibraryBooks />
        </HeaderIconWrapper>
        Projects
      </StyledNavLink>
      <StyledNavLink
        href={process.env.REACT_APP_MERMAID_REFERENCE_LINK}
        target="_blank"
        rel="noreferrer"
        download
        onMouseOver={handleReferenceMouseOver}
      >
        <HeaderIconWrapper>
          <MediumIconExcel />
        </HeaderIconWrapper>
        Reference&nbsp;
      </StyledNavLink>
      <OfflineHide>
        <StyledNavLink href={mermaidDashboardLink} target="_blank" rel="noreferrer">
          <HeaderIconWrapper>
            <IconGlobe />
          </HeaderIconWrapper>
          Global Dashboard
        </StyledNavLink>

        <WhatsNewLink href={mermaidWhatsNewLink} target="_blank" rel="noreferrer">
          What&apos;s new&nbsp;
          <div>
            <MediumIconOpenInNew />
          </div>
        </WhatsNewLink>
      </OfflineHide>
    </>
  )
}

const Header = ({ logout = () => {}, currentUser = undefined }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const openProfileModal = () => setIsProfileModalOpen(true)
  const closeProfileModal = () => setIsProfileModalOpen(false)
  const { notifications } = useBellNotifications()
  const { isAppOnline } = useOnlineStatus()
  const [hasImageError, setHasImageError] = useState(false)

  const UserMenuDropDownContent = () => (
    <OfflineHide>
      <UserMenuButton onClick={openProfileModal}>Profile</UserMenuButton>
      <UserMenuButton onClick={logout}>Logout</UserMenuButton>
    </OfflineHide>
  )

  const handleImageError = () => {
    setHasImageError(true)
  }

  const getUserButton = () => {
    // Avatar with user image
    if (currentUser && currentUser.picture && !hasImageError) {
      return (
        <AvatarWrapper>
          <CurrentUserImg src={currentUser.picture} alt="" onError={handleImageError} />
        </AvatarWrapper>
      )
    }

    // Avatar with fallback image
    if (currentUser && currentUser.picture && hasImageError) {
      return (
        <AvatarWrapper>
          <BiggerIconUser />
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
                    {notifications.length ? (
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
                    {notifications.length ? (
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

export default Header
