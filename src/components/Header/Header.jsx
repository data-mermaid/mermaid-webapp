import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import {
  BiggerIconBell,
  BiggerIconMenu,
  LoggedInAs,
  LogoImg,
  MediumIconExcel,
  NotificationIndicator,
  StyledHeader,
  StyledNavLink,
  UserButton,
} from './Header.styles'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { IconGlobe, IconLanguage, IconLibraryBooks } from '../icons'
import { useBellNotifications } from '../../App/BellNotificationContext'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { UserIcon } from '../UserIcon/UserIcon'
import BellNotificationDropDown from '../BellNotificationDropDown/BellNotificationDropDown'
import HideShow from '../generic/HideShow'
import MermaidCollectLogo from '../../assets/mermaid-collect-logo.svg'
import OfflineHide from '../generic/OfflineHide'
import ProfileModal from '../ProfileModal'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n.ts'
import styles from './Header.module.scss'

const handleLanguageSelect = (lng) => {
  i18n.changeLanguage(lng)
}

const LanguageMenuTool = () => {
  const { t } = useTranslation()
  return (
    <OfflineHide>
      <HideShow
        closeOnClickWithin={true}
        button={
          <button className={styles['header__button']}>
            <div className={styles['icon-wrapper']}>
              <IconLanguage />
              {t('languages.language')}
            </div>
          </button>
        }
        contents={
          <div className={styles['user-nav']}>
            <button
              className={styles['user-nav--link']}
              onClick={() => handleLanguageSelect('cimode')}
            >
              Token QA
            </button>
            <button className={styles['user-nav--link']} onClick={() => handleLanguageSelect('en')}>
              {t('languages.english')}
            </button>
            <button className={styles['user-nav--link']} onClick={() => handleLanguageSelect('id')}>
              {t('languages.indonesian')}
            </button>
          </div>
        }
      />
    </OfflineHide>
  )
}

const GlobalLinks = ({ isAppOnline }) => {
  const { t } = useTranslation()
  const isDevelopmentEnvironment = import.meta.env.VITE_ENVIRONMENT !== 'production'

  const handleReferenceMouseOver = (event) => {
    // we add a hack so when online the reference spreadsheet isnt pulled from an outdated cache.
    // (eg a user has just added a new fish species and it has been approved, but the service worker has cached the old one)
    // we use a hover event instead of click so devs can confirm the strategy, and the hover behaviour shows the href in the
    // browser bottom left corner that will
    // be followed onClick (instead of a stale one from the last click)

    event.target.href = isAppOnline
      ? `${import.meta.env.VITE_MERMAID_REFERENCE_LINK}?nocache=${Date.now()}`
      : import.meta.env.VITE_MERMAID_REFERENCE_LINK
  }

  return (
    <div style={{ display: 'flex' }}>
      <StyledNavLink as={Link} to="/projects" data-testid="projects-link">
        <div className={styles['icon-wrapper']}>
          <IconLibraryBooks />
        </div>
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
        <div className={styles['icon-wrapper']}>
          <MediumIconExcel />
        </div>
        {t('reference')}
      </StyledNavLink>
      <OfflineHide>
        <StyledNavLink
          href={import.meta.env.VITE_MERMAID_EXPLORE_LINK}
          target="_blank"
          rel="noreferrer"
          data-testid="mermaid-explore-link"
        >
          <div className={styles['icon-wrapper']}>
            <IconGlobe />
          </div>
          {t('mermaid_explore')}
        </StyledNavLink>
      </OfflineHide>
      {/*Language is available in local and dev environment to confirm comprehensive tokenization.
      Submenu items do not currently populate mobile.*/}
      {isDevelopmentEnvironment && <LanguageMenuTool />}
    </div>
  )
}

const Header = ({ logout = () => {}, currentUser = undefined }) => {
  const { t } = useTranslation()
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
      <button
        className={styles['user-nav--link']}
        onClick={openProfileModal}
        data-testid="profile-button"
      >
        {t('profile.profile')}
      </button>
      <button className={styles['user-nav--link']} onClick={logout} data-testid="logout-button">
        {t('buttons.logout')}
      </button>
    </OfflineHide>
  )

  const userIconButton = (
    <UserButton aria-label={t('buttons.user_account_dropdown')}>
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
        <Link to="/projects" id="gtm-collect-logo">
          <LogoImg id="gtm-collect-logo-img" src={MermaidCollectLogo} alt={t('mermaid_logo')} />
        </Link>
        <nav>
          <div className={styles['desktop-global-nav']}>
            <GlobalLinks isAppOnline={isAppOnline} />
            {isAppOnline && (
              <HideShow
                closeOnClickWithin={false}
                id="gtm-bell-notifications-hideshow"
                button={
                  <button className={styles['header__button']} id="gtm-bell-notifications">
                    <BiggerIconBell id="gtm-bell-notifications-icon" />
                    {notifications.length && <NotificationIndicator>&bull;</NotificationIndicator>}
                  </button>
                }
                contents={<BellNotificationDropDown />}
              />
            )}
            <HideShow
              closeOnClickWithin={true}
              button={userIconButton}
              contents={
                <div className={styles['user-nav']}>
                  {currentUser && (
                    <LoggedInAs>
                      {t('profile.logged_in_as')} {userDisplayName}
                    </LoggedInAs>
                  )}
                  <UserMenuDropDownContent />
                </div>
              }
            />
          </div>
          <div className={styles['mobile-global-nav']}>
            {isAppOnline && (
              <HideShow
                button={
                  <button className={styles['header__button']}>
                    <BiggerIconBell />
                    {notifications.length && <NotificationIndicator>&bull;</NotificationIndicator>}
                  </button>
                }
                contents={<BellNotificationDropDown />}
              />
            )}
            <HideShow
              button={
                <button className={styles['header__button']}>
                  <BiggerIconMenu />
                </button>
              }
              contents={
                <div className={styles['user-nav']}>
                  <GlobalLinks isAppOnline={isAppOnline} />
                  {currentUser && (
                    <LoggedInAs>
                      {t('profile.logged_in_as')} {userDisplayName}
                    </LoggedInAs>
                  )}
                  <UserMenuDropDownContent />
                </div>
              }
            />
          </div>
        </nav>
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
