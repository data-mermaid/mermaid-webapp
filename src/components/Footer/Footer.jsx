import React, { useState, useRef, useEffect } from 'react'
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
import { useTranslation } from 'react-i18next'

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
        <OfflineToggle id="offline-toggle-switch" />
        <CssToggle />
        <span>
          {isAppOnline ? t('status.online') : t('status.offline')}
        </span>
      </StyledToggleLabel>
      <FooterNav>
        <HelpContainer ref={dropdownRef}>
          <TextLink type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {t('footer.help_pdf')}
          </TextLink>
          {isDropdownOpen && (
            <HelpLinksWrapper>
              <li>
                <a href="MERMAID-user-docs-EN-min.pdf" target="_blank" rel="noreferrer">
                  {t('footer.english')}
                </a>
              </li>

              <li value="Bahasa Indonesia">
                <a href="MERMAID-user-docs-ID-min.pdf" target="_blank">
                  {t('footer.bahasa_indonesia')}
                </a>
              </li>
            </HelpLinksWrapper>
          )}
        </HelpContainer>
        <OfflineHide>
          <a href="https://datamermaid.org/terms-of-service" target="_blank" rel="noreferrer">
            {t('footer.terms')}
          </a>
          <a href="https://datamermaid.org/contact-us" target="_blank" rel="noreferrer">
            {t('footer.contact')}
          </a>
          <a href="https://datamermaid.org/partners-and-teams/" target="_blank" rel="noreferrer">
            {t('footer.credits')}
          </a>
        </OfflineHide>
        <VersionWrapper>{versionNumber}</VersionWrapper>
      </FooterNav>
    </StyledFooter>
  )
}

Footer.propTypes = {}

export default Footer
