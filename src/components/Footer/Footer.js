import React from 'react'
import styled, { css } from 'styled-components/macro'
import { Link } from 'react-router-dom'
import OfflineToggle from '../OfflineToggle'
import theme from '../../theme'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'
import { useOnlineStatus } from '../../library/onlineStatusContext'

const StyledFooter = styled('footer')`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto auto;
  background: ${theme.color.black};
  ${mediaQueryPhoneOnly(css`
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, auto);
  `)}
  p,
  label,
  nav a,
  button {
    color: ${theme.color.white};
    font-size: ${theme.typography.smallFontSize};
    margin: ${theme.spacing.medium} 0;
    ${mediaQueryPhoneOnly(css`
      margin: ${theme.spacing.small} 0;
    `)}
  }
`
const OfflineToggleWrapper = styled('div')`
  padding-left: ${theme.spacing.small};
  label {
    padding-left: ${theme.spacing.small};
    display: inline-block;
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
  const { isOnline } = useOnlineStatus()

  return (
    <StyledFooter>
      <OfflineToggleWrapper>
        <OfflineToggle />
        <label
          htmlFor="offline-toggle-switch"
          data-testid="offline-toggle-switch-label"
        >
          {isOnline ? (
            <>
              You&apos;re <strong>ONLINE</strong>
            </>
          ) : (
            <>
              You&apos;re <strong>OFFLINE</strong>
            </>
          )}
        </label>
      </OfflineToggleWrapper>
      <FooterNav>
        <Link to="/#">Help</Link>
        <Link to="/#">Terms</Link>
        <Link to="/#">Contact</Link>
        <Link to="/#">Changelog</Link>
        <Link to="/#">Credits</Link>
      </FooterNav>
      <Copyright>&copy; 2021 Mermaid Version v1.0.0</Copyright>
    </StyledFooter>
  )
}

Footer.propTypes = {}

export default Footer
