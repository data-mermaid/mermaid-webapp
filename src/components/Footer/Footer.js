import React from 'react'
import {
  StyledFooter,
  StyledToggleLabel,
  FooterNav,
  VersionWrapper,
  CssToggle,
} from './Footer.styles'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { versionNumber } from '../../version'
import MermaidDocsEN from '../../docs/MERMAID-user-documentation-EN.pdf'
import OfflineHide from '../generic/OfflineHide'
import OfflineToggle from '../OfflineToggle'

const Footer = () => {
  const { isAppOnline } = useOnlineStatus()

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
        <a href={MermaidDocsEN} target="_blank" rel="noreferrer">
          Help (PDF) ▲
        </a>
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
