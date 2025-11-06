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
      <StyledToggleLabel
        htmlFor="offline-toggle-switch"
        data-testid="offline-toggle-switch-label"
        aria-label={t('toggle_offline_mode')}
      >
        <OfflineToggle id="offline-toggle-switch" />
        <CssToggle />
        <span
          /* eslint-disable-next-line react/no-danger */
          dangerouslySetInnerHTML={{
            __html: isAppOnline ? t('online_status') : t('offline_status'),
          }}
        />
      </StyledToggleLabel>
      <FooterNav>
        <HelpContainer ref={dropdownRef}>
          <TextLink type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {t('help_dropdown')}
          </TextLink>
          {isDropdownOpen && (
            <HelpLinksWrapper>
              <li>
                <a
                  href="https://datamermaid.org/assets/attachments/mermaid-quick-start-guide-1756475523.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('help_english')}
                </a>
              </li>

              <li value="Bahasa Indonesia">
                <a href="MERMAID-user-docs-ID-min.pdf" target="_blank">
                  {t('help_bahasa')}
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
