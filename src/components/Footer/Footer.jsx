import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  StyledFooter,
  StyledToggleLabel,
  FooterNav,
  VersionWrapper,
  CssToggle,
  HelpLinksWrapper,
  HelpContainer,
} from './Footer.styles'
import { TextLink } from '../generic/links'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { versionNumber } from '../../version'
import OfflineHide from '../generic/OfflineHide'
import OfflineToggle from '../OfflineToggle'

const Footer = () => {
  const { t } = useTranslation()
  const { isAppOnline } = useOnlineStatus()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutsideDropdown)

    return () => {
      document.removeEventListener('click', handleClickOutsideDropdown)
    }
  }, [isDropdownOpen])

  return (
    <StyledFooter>
      <StyledToggleLabel htmlFor="offline-toggle-switch" data-testid="offline-toggle-switch-label">
        <OfflineToggle id="offline-toggle-switch" aria-label={t('offline_toggle')} />
        <CssToggle />
        <span>
          {isAppOnline ? (
            <span dangerouslySetInnerHTML={{ __html: t('status_online') }} />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: t('status_offline') }} />
          )}
        </span>
      </StyledToggleLabel>
      <FooterNav>
        <HelpContainer ref={dropdownRef}>
          <TextLink
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label={t('help_dropdown')}
          >
            {t('help_documents')}
          </TextLink>
          {isDropdownOpen && (
            <HelpLinksWrapper>
              <li>
                <a href="/MERMAID-quick-start-guide-EN.pdf" target="_blank" rel="noreferrer">
                  {t('languages.english')}
                </a>
              </li>

              <li>
                <a href="/MERMAID-quick-start-guide-ID.pdf" target="_blank" rel="noreferrer">
                  {t('languages.bahasa_indonesia')}
                </a>
              </li>
            </HelpLinksWrapper>
          )}
        </HelpContainer>
        <OfflineHide>
          <a href="https://datamermaid.org/terms-of-service" target="_blank" rel="noreferrer">
            {t('terms')}
          </a>
          <a href="https://datamermaid.org/contact-us" target="_blank" rel="noreferrer">
            {t('contact')}
          </a>
          <a href="https://datamermaid.org/partners-and-teams/" target="_blank" rel="noreferrer">
            {t('credits')}
          </a>
        </OfflineHide>
        <VersionWrapper>{versionNumber}</VersionWrapper>
      </FooterNav>
    </StyledFooter>
  )
}

Footer.propTypes = {}

export default Footer
