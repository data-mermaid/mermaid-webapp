import React from 'react'
import styled, { css } from 'styled-components/macro'
import { Link } from 'react-router-dom'
import OfflineToggle from '../OfflineToggle'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'
import { IconRefresh, IconCheck } from '../icons'
import { ButtonCallout } from '../generic/buttons'

const rightColumn = css`
  justify-self: end;
  text-align: end;
  padding: 0 ${(props) => props.theme.spacing.xsmall} 0 0;
  ${mediaQueryPhoneOnly(css`
    justify-self: start;
    text-align: start;
    padding: 0 0 0 ${(props) => props.theme.spacing.xsmall};
  `)}
`
const StyledFooter = styled('footer')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: ${(props) => props.theme.color.black};
  border-top: solid 1px ${(props) => props.theme.color.border};
  p,
  label,
  nav a,
  button {
    color: ${(props) => props.theme.color.white};
    font-size: 1.2rem;
    margin: ${(props) => props.theme.spacing.small} 0;
  }
  ${mediaQueryPhoneOnly(css`
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    p,
    label,
    nav a,
    button {
      margin: ${(props) => props.theme.spacing.medium} 0;
    }
  `)}
`
const OfflineToggleWrapper = styled('div')`
  padding-left: ${(props) => props.theme.spacing.xsmall};
  label {
    padding-left: ${(props) => props.theme.spacing.xsmall};
    display: inline-block;
  }
`
const FooterNav = styled('nav')`
  a {
    display: inline-block;
    padding: 0 ${(props) => props.theme.spacing.xsmall};
  }
`
const UpdateWrapper = styled('div')`
  ${rightColumn};
  svg {
    color: ${(props) => props.theme.color.white};
    font-size: 1.2rem;
  }
  p {
    display: inline-block;
  }
`
const Copyright = styled.p`
  ${rightColumn};
`

const Footer = () => {
  return (
    <StyledFooter>
      <OfflineToggleWrapper>
        <OfflineToggle />
        <label htmlFor="offline-toggle-switch">
          {/* You&apos;re <strong>OFFLINE</strong> */}
          You&apos;re <strong>ONLINE</strong>
        </label>
      </OfflineToggleWrapper>
      <UpdateWrapper>
        {/* When it's up to date */}
        <IconCheck /> <p>MERMAID is up to date</p>
        {/* When it needs to be updated */}
        {/* <ButtonCallout>
          <IconRefresh /> There&apos;s a new Version of MERMAID
        </ButtonCallout> */}
      </UpdateWrapper>
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
