import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import {
  UserButton,
  GlobalNav,
  HeaderButtonThatLooksLikeLink,
  StyledHeader,
  LogoImg,
  StyledNavLink,
  NotificationIndicator,
  UserMenuButton,
  UserMenu,
  BiggerIconBell,
  MediumIconExcel,
  BiggerIconMenu,
  LoggedInAs,
  HeaderIconWrapper,
} from './Header.styles'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { IconGlobe, IconLibraryBooks } from '../icons'
import { useBellNotifications } from '../../App/BellNotificationContext'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { UserIcon } from '../UserIcon/UserIcon'
import BellNotificationDropDown from '../BellNotificationDropDown/BellNotificationDropDown'
import HideShow from '../generic/HideShow'
import MermaidCollectLogo from '../../assets/mermaid-collect-logo.svg'
import OfflineHide from '../generic/OfflineHide'
import ProfileModal from '../ProfileModal'
import { useTranslation } from 'react-i18next'

const GlobalLinks = ({ isAppOnline }) => {
  const { t } = useTranslation()
  const handleReferenceMouseOver = (event) => {
    // we add a hack so when online the reference spreadsheet isnt pulled from an outdated cache.
    // (eg a user has just added a new fish species and it has been approved, but the service worker has cahed the old one)
    // we use a hover event instead of click so devs can confirm the strategy, and the hover behaviour shows the href in the
    // browser bottom left corner that will
    // be followed onClick (instead of a stale one from the last click)

    event.target.href = isAppOnline
      ? `${import.meta.env.VITE_MERMAID_REFERENCE_LINK}?nocache=${Date.now()}`
      : import.meta.env.VITE_MERMAID_REFERENCE_LINK
  }

  return (
    <>
      <StyledNavLink as={Link} to="/projects" data-testid="projects-link">
        <HeaderIconWrapper>
          <IconLibraryBooks />
        </HeaderIconWrapper>
        {t('projects.projects')}
      </StyledNavLink>
      <StyledNavLink
        href={import.meta.env.VITE_MERMAID_REFERENCE_LINK}
        target="_blank"
        rel="noreferrer"
        download
        onMouseOver={handleReferenceMouseOver}
        data-testid="reference-link"
      >
        <HeaderIconWrapper>
          <MediumIconExcel />
        </HeaderIconWrapper>
        {t('reference')}
      </StyledNavLink>
      <OfflineHide>
        <StyledNavLink
          href={import.meta.env.VITE_MERMAID_EXPLORE_LINK}
          target="_blank"
          rel="noreferrer"
          data-testid="mermaid-explore-link"
        >
          <HeaderIconWrapper>
            <IconGlobe />
          </HeaderIconWrapper>
          {t('mermaid_explore')}
        </StyledNavLink>
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
  const {
    first_name: currentUserFirstName,
    last_name: currentUserLastName,
    picture: currentUserImageUrl,
    email: currentUserEmail,
    full_name: currentUserFullName,
  } = currentUser ?? {}

  const UserMenuDropDownContent = () => (
    <OfflineHide>
      <UserMenuButton onClick={openProfileModal}>Profile</UserMenuButton>
      <UserMenuButton onClick={logout}>Logout</UserMenuButton>
    </OfflineHide>
  )

  const userIconButton = (
    <UserButton aria-label="User account dropdown">
      <UserIcon
        firstName={currentUserFirstName}
        lastName={currentUserLastName}
        userImageUrl={currentUserImageUrl}
      />
    </UserButton>
  )

  const userDisplayName = currentUserFirstName || currentUserFullName || currentUserEmail

  return (
    <>
      <StyledHeader>
        <Link to="/projects">
          <LogoImg src={MermaidCollectLogo} alt="MERMAID Collect Logo" />
        </Link>
        <GlobalNav>
          <div className="desktop">
            <GlobalLinks isAppOnline={isAppOnline} />
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
                  <GlobalLinks isAppOnline={isAppOnline} />
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

GlobalLinks.propTypes = {
  isAppOnline: PropTypes.bool.isRequired,
}

Header.propTypes = {
  currentUser: currentUserPropType,
  logout: PropTypes.func,
}

export default Header
