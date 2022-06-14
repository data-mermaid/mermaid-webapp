import styled, { css } from 'styled-components/macro'

import theme from '../../theme'
import { ButtonThatLooksLikeLink } from '../generic/buttons'
import { hoverState, mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'

export const StyledHeader = styled('header')`
  background-color: ${theme.color.headerColor};
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  color: ${theme.color.white};
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 102;
  height: ${theme.spacing.headerHeight};
  img {
    height: calc(${theme.spacing.headerHeight} - 10px);
    padding: 0 ${theme.spacing.small};
    margin-top: 5px;
    ${mediaQueryTabletLandscapeOnly(css`
      height: calc(${theme.spacing.headerHeight} - 15px);
      margin-top: 7px;
    `)}
  }
`
const linkStyles = css`
  color: ${theme.color.white};
  height: ${theme.spacing.headerHeight};
  cursor: pointer;
  border-bottom: solid ${theme.spacing.borderLarge} transparent;
  text-decoration: none;
  position: relative;
  margin: 0 ${theme.spacing.small};
  display: inline-block;
  padding: 0;
  line-height: ${theme.spacing.headerHeight};
  ${hoverState(
  css`
      border-bottom: solid 3px ${theme.color.callout};
    `,
)}
`

export const HeaderButtonThatLooksLikeLink = styled(ButtonThatLooksLikeLink)`
  ${linkStyles}
`
const dropdownLinkStyles = css`
  ${linkStyles};
  border-width: 0 0 3px 0;
  background: none;
  display: inline-block;
  margin: 0;
  padding: ${theme.spacing.small} ${theme.spacing.large};
  width: 100%;
  ${hoverState(
  css`
      &:after {
        content: '';
        position: absolute;
        width: 20px;
        height: ${theme.spacing.borderSmall};
        background: ${theme.color.callout};
        bottom: 0;
        left: ${theme.spacing.large};
      }
      border-color: transparent;
    `,
)}
`

export const StyledNavLink = styled('a')`
  ${linkStyles}
  ${(props) =>
    props.disabled &&
    css`
      color: ${theme.color.disabledText};
      pointer-events: none;
    `} 
  }
  `

export const GlobalNav = styled('nav')`
  .desktop {
    display: flex;
    align-items: stretch;
    div,
    div p {
      display: inline-block;
    }
    div p {
      ${linkStyles}
    }
    .desktopUserMenu,
    .mobileUserMenu {
      position: absolute;
      top: calc(${theme.spacing.headerHeight} + ${theme.spacing.small});
      right: 0;
      background-color: ${theme.color.headerDropdownMenuBackground};
      border-radius: 8px 0 8px 8px;
      a {
        ${dropdownLinkStyles}
      }
    }
  }
  .mobile {
    display: none;
    align-items: stretch;
    div,
    div p {
      display: inline-block;
    }
    button.trigger {
      border: none;
      font-size: larger;
      background: none;
    }
    .menuDropdown {
      background-color: ${theme.color.headerDropdownMenuBackground};
      border-radius: 8px 0 8px 8px;
      top: calc(${theme.spacing.headerHeight} + 1px);
      right: 1px;
      position: absolute;
    }
    a,
    div p,
    button {
      display: block;
      text-decoration: none;
      color: ${theme.color.white};
      text-align: right;
      padding: ${theme.spacing.small} ${theme.spacing.medium};
      margin: 0;
      width: 100%;
      white-space: nowrap;
      font-size: smaller;
      line-height: 1;
      &:hover {
        border: none;
        &:after {
          display: none;
        }
      }
    }
    .loggedInAs {
      background: ${theme.color.primaryColor};
    }
  }
  ${mediaQueryTabletLandscapeOnly(css`
    .desktop {
      display: none;
    }
    .mobile {
      display: flex;
    }
  `)}
`
export const UserMenuButton = styled.button`
  ${dropdownLinkStyles}
`

export const NotificationCardWrapper = styled('div')`
  width: ${'80vw'};
  max-width: ${'40rem'};
  cursor: pointer;
  ${mediaQueryTabletLandscapeOnly(css`
    width: '90vw';
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  `)}
`

export const NotificationCard = styled('div')`
 margin: ${theme.spacing.small};
 background-color: white;
 width: 97%;
 color: ${theme.color.primaryColor};
`
