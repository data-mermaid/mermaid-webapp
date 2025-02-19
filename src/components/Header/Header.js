import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useLayoutEffect, useState } from 'react'

import {
  UserButton,
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
  UserCircle,
} from './Header.styles'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { IconGlobe, IconLibraryBooks } from '../icons'
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
  const currentUserFirstInitial = currentUser?.first_name?.charAt(0).toUpperCase()
  const currentUserLastInitial = currentUser?.last_name?.charAt(0).toUpperCase()
  const isProfileImageButtonShowing = currentUser?.picture && !hasImageError
  const isInitialsButtonShowing = currentUserFirstInitial || currentUserLastInitial

  useLayoutEffect(
    function resetImageErrorWhenUserPictureChanges() {
      // we clear the error before (re)rendering the image tag (which may or may not trigger an error)
      setHasImageError(false)
    },
    [currentUser],
  )

  const handleImageError = () => {
    setHasImageError(true)
  }

  const UserMenuDropDownContent = () => (
    <OfflineHide>
      <UserMenuButton onClick={openProfileModal}>Profile</UserMenuButton>
      <UserMenuButton onClick={logout}>Logout</UserMenuButton>
    </OfflineHide>
  )

  const profileImageButton = isProfileImageButtonShowing ? (
    <UserButton aria-label="User account dropdown">
      <CurrentUserImg src={currentUser?.picture} alt="User picture" onError={handleImageError} />
    </UserButton>
  ) : null
  const initialsButton =
    isInitialsButtonShowing && !isProfileImageButtonShowing ? (
      <UserButton aria-label="User account dropdown">
        <UserCircle>
          {currentUserFirstInitial}
          {currentUserLastInitial}
        </UserCircle>
      </UserButton>
    ) : null

  const fallbackButton = (
    <UserButton aria-label="User account dropdown">
      <BiggerIconUser />
    </UserButton>
  )

  const userIconButton = profileImageButton || initialsButton || fallbackButton

  const userDisplayName = currentUser?.first_name || currentUser?.full_name || currentUser?.email

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
              button={userIconButton}
              contents={
                <UserMenu>
                  {currentUser && <LoggedInAs>Logged in as {userDisplayName}</LoggedInAs>}
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
                  {currentUser && <LoggedInAs>Logged in as {userDisplayName}</LoggedInAs>}
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
