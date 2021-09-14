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
  const { isAppOnline } = useOnlineStatus()

  return (
    <StyledFooter>
      <OfflineToggleWrapper>
        <OfflineToggle />
        <label
          htmlFor="offline-toggle-switch"
          data-testid="offline-toggle-switch-label"
        >
          {isAppOnline ? (
            <>
              You&apos;re <strong>ONLINE</strong>
            </>
          ) : (
            <>
              You&apos;re <strong>OFFLINE</strong>. Some contents may be out of
              date.
            </>
          )}
        </label>
      </OfflineToggleWrapper>
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
