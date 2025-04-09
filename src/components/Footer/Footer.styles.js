import styled, { css } from 'styled-components'
import theme from '../../theme'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'

export const smallFooterTextStyle = css`
  font-size: ${theme.typography.smallFontSize};
  ${mediaQueryPhoneOnly(css`
    margin: ${theme.spacing.small} 0;
  `)}
`

export const VersionWrapper = styled('span')`
  ${smallFooterTextStyle}
`

export const StyledFooter = styled('footer')`
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
    ${smallFooterTextStyle}
  }
`
export const offlineToggleSize = theme.typography.defaultIconSize

export const CssToggle = styled('span')`
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
export const StyledToggleLabel = styled('label')`
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

export const FooterNav = styled('nav')`
  a {
    display: inline-block;
    padding: 0 ${theme.spacing.small};
  }
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

export const HelpLinksWrapper = styled.ul`
  all: unset;
  background-color: ${theme.color.white};
  text-align: left;
  position: absolute;
  cursor: pointer;
  top: calc(100% - 9rem);
  z-index: 2;
  right: 0;
  min-width: auto;
  min-height: auto;
  overflow: hidden;
  border: ${theme.spacing.borderSmall} solid ${theme.color.secondary};

  & li > a {
    all: unset;
    font-size: ${theme.typography.defaultFontSize};
    white-space: nowrap;
    display: inline-block;
    width: 100%;
  }

  li {
    padding: 0.3em;
  }

  li:hover {
    background-color: ${theme.color.secondaryHover};
    color: black;
  }
`
export const HelpContainer = styled('div')`
  margin-bottom: 3px;
  position: relative;
  cursor: pointer;
`
