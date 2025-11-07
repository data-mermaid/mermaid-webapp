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

const Footer = () => {
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
          {isAppOnline ? (
            <>
              You&apos;re <strong>ONLINE</strong>
            </>
          ) : (
            <>
              You&apos;re <strong>OFFLINE</strong>. Some contents may be out of date.
            </>
          )}
        </span>
      </StyledToggleLabel>
      <FooterNav>
        <HelpContainer ref={dropdownRef}>
          <TextLink type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            Help (PDF) ▲
          </TextLink>
          {isDropdownOpen && (
            <HelpLinksWrapper>
              <li>
                <a href="/MERMAID-quick-start-guide-EN.pdf" target="_blank" rel="noreferrer">
                  English
                </a>
              </li>

              <li value="Bahasa Indonesia">
                <a href="/MERMAID-quick-start-guide-ID.pdf" target="_blank" rel="noreferrer">
                  {t('help_bahasa')}
                </a>
                  Bahasa Indonesia
                </a>
              </li>
            </HelpLinksWrapper>
          )}
        </HelpContainer>
        <OfflineHide>
          <a href="https://datamermaid.org/terms-of-service" target="_blank" rel="noreferrer">
            Terms
          </a>
          <a href="https://datamermaid.org/contact-us" target="_blank" rel="noreferrer">
            Contact
          </a>
          <a href="https://datamermaid.org/partners-and-teams/" target="_blank" rel="noreferrer">
            Credits
          </a>
        </OfflineHide>
        <VersionWrapper>{versionNumber}</VersionWrapper>
      </FooterNav>
    </StyledFooter>
  )
}

Footer.propTypes = {}

export default Footer
