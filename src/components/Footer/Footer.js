import React, { useState, useRef, useEffect } from 'react'
import {
  StyledFooter,
  StyledToggleLabel,
  FooterNav,
  VersionWrapper,
  CssToggle,
  StyledSelect,
  HelpContainer,
} from './Footer.styles'
import { TextLink } from '../generic/links'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { versionNumber } from '../../version'
import MermaidDocsEN from '../../docs/MERMAID-user-docs-EN-min.pdf'
import MermaidDocsBIN from '../../docs/MERMAID-user-docs-ID-min.pdf'
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

  const handleLanguageSelect = (event) => {
    const language = event.target.value

    setIsDropdownOpen(false)

    if (language === 'English') {
      window.open(MermaidDocsEN, '_blank')
    } else if (language === 'Bahasa Indonesia') {
      window.open(MermaidDocsBIN, '_blank')
    }
  }

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
            <StyledSelect size="2" onChange={handleLanguageSelect}>
              <option value="English">English</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            </StyledSelect>
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
