import React from 'react'
import styled, { css } from 'styled-components/macro'
import { Link } from 'react-router-dom'
import OfflineToggle from '../OfflineToggle'
import theme from '../../theme'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import OfflineHide from '../generic/OfflineHide'

const StyledFooter = styled('footer')`
  display: grid;
  justify-items: start;
  grid-template-columns: 1fr auto auto;
  background-color: ${theme.color.footerColor};
  ${mediaQueryPhoneOnly(css`
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, auto);
  `)}
  p,
  label,
  nav a,
  button {
    font-size: ${theme.typography.smallFontSize};
    margin: ${theme.spacing.medium} 0;
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
  cursor: pointer;
  display: flex;
  gap: 2px;
  padding: 0 0 ${theme.spacing.small} ${theme.spacing.small};
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
const Copyright = styled.p`
  padding: 0 ${theme.spacing.small};
`

const Footer = () => {
  const { isAppOnline } = useOnlineStatus()

  return (
    <StyledFooter>
      <StyledToggleLabel htmlFor="offline-toggle-switch" data-testid="offline-toggle-switch-label">
        <OfflineToggle id="offline-toggle-switch" />
        <CssToggle />
        {isAppOnline ? (
          <>
            You&apos;re <strong>ONLINE</strong>
          </>
        ) : (
          <>
            You&apos;re <strong>OFFLINE</strong>. Some contents may be out of date.
          </>
        )}
      </StyledToggleLabel>
      <FooterNav>
        <Link to="/#">Help</Link>
        <OfflineHide>
          <Link to="/#">Terms</Link>
          <Link to="/#">Contact</Link>
          <Link to="/#">Changelog</Link>
          <Link to="/#">Credits</Link>
        </OfflineHide>
      </FooterNav>
      <Copyright>&copy; 2021 Mermaid Version v1.0.0</Copyright>
    </StyledFooter>
  )
}

Footer.propTypes = {}

export default Footer
