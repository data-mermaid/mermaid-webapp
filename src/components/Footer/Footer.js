import React from 'react'
import styled, { css } from 'styled-components/macro'
import OfflineToggle from '../OfflineToggle'
import theme from '../../theme'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import OfflineHide from '../generic/OfflineHide'
import MermaidDocs from '../../docs/MERMAID User Documentation 2021-09-28.pdf'

const StyledFooter = styled('footer')`
  text-align: end;
  background-color: ${theme.color.footerColor};
  padding: ${theme.spacing.small};
  ${mediaQueryPhoneOnly(css`
    text-align: start;
    padding-bottom: 5rem;
  `)}
  p,
  label,
  nav a,
  button {
    font-size: ${theme.typography.smallFontSize};
    ${mediaQueryPhoneOnly(css`
      margin: ${theme.spacing.small} 0;
    `)}
  }
`
const offlineToggleSize = theme.typography.defaultIconSize
const CssToggle = styled('span')`
  display: block;
  width: calc(${offlineToggleSize} * 2);
  position: relative;
  &:before,
  &:after {
    content: '';
    transition: 0.3s;
    position: absolute;
  }
  &:before {
    // container
    width: calc(${offlineToggleSize} * 2);
    height: ${offlineToggleSize};
    left: 0;
    top: 0;
    border-radius: 25% / 50%;
    background: green;
  }
  &:after {
    // toggle
    width: calc(${offlineToggleSize} - 2px);
    height: calc(${offlineToggleSize} - 2px);
    top: 1px;
    left: 1px;
    background: oldlace;
    border-radius: 50%;
  }
`
const StyledToggleLabel = styled('label')`
  background: rgba(255, 255, 255, 0.5);
  position: fixed;
  bottom: 0;
  left: 0;
  cursor: pointer;
  display: flex;
  gap: 1.5rem;
  padding: ${theme.spacing.small};
  margin: 0;
  input {
    display: none;
  }
  input:checked {
    ~ span:after {
      background: ${theme.color.cautionColor};
      left: calc(${offlineToggleSize} - 1px);
    }
    ~ span:before {
      background: ${theme.color.cautionColor};
      opacity: 0.5;
    }
  }
  input:disabled {
    ~ span:before {
      background: ${theme.color.disabledColor};
      opacity: 0.5;
      cursor: not-allowed;
    }
    ~ span:after {
      background: ${theme.color.disabledColor};
      cursor: not-allowed;
    }
  }
`

const FooterNav = styled('nav')`
  a {
    display: inline-block;
    padding: 0 ${theme.spacing.small};
  }
`

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
        <a href={MermaidDocs} target="_blank" rel="noreferrer">
          Help
        </a>
        <OfflineHide>
          <a href="https://datamermaid.org/terms-of-service" target="_blank" rel="noreferrer">
            Terms
          </a>
          <a href="https://datamermaid.org/contact-us" target="_blank" rel="noreferrer">
            Contact
          </a>
          <a href="https://datamermaid.org/changelog" target="_blank" rel="noreferrer">
            Changelog
          </a>
          <a href="https://datamermaid.org/partners-and-teams/" target="_blank" rel="noreferrer">
            Credits
          </a>
        </OfflineHide>
      </FooterNav>
    </StyledFooter>
  )
}

Footer.propTypes = {}

export default Footer
