import React, { useState, useRef, useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'
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
            <span data-testid="status-online">
              <Trans i18nKey="status_online" components={{ strong: <strong /> }} />
            </span>
          ) : (
            <span data-testid="status-offline">
              <Trans i18nKey="status_offline" components={{ strong: <strong /> }} />
            </span>
          )}
        </span>
      </StyledToggleLabel>
      <FooterNav>
        <HelpContainer ref={dropdownRef}>
          <TextLink
            id="gtm-help-pdf-dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label={t('help_dropdown')}
            data-testid="help-documents-dropdown"
          >
            {t('help_documents')} ▲
          </TextLink>
          {isDropdownOpen && (
            <HelpLinksWrapper>
              <li>
                <a
                  href="/MERMAID-quick-start-guide-EN.pdf"
                  target="_blank"
                  id="gtm-help-pdf-english"
                  rel="noreferrer"
                >
                  {t('languages.english')}
                </a>
              </li>

              <li>
                <a
                  href="/MERMAID-quick-start-guide-ID.pdf"
                  target="_blank"
                  id="gtm-help-pdf-indonesian"
                  rel="noreferrer"
                >
                  {t('languages.bahasa_indonesia')}
                </a>
              </li>
            </HelpLinksWrapper>
          )}
        </HelpContainer>
        <OfflineHide>
          <a
            href="https://datamermaid.org/terms-of-service"
            target="_blank"
            rel="noreferrer"
            data-testid="terms-link"
          >
            {t('terms')}
          </a>
          <a
            href="https://datamermaid.org/contact-us"
            target="_blank"
            rel="noreferrer"
            data-testid="contact-link"
          >
            {t('contact')}
          </a>
          <a
            href="https://datamermaid.org/about-mermaid"
            target="_blank"
            rel="noreferrer"
            data-testid="credits-link"
          >
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
