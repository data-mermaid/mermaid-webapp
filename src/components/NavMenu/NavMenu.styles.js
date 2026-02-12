import { styled, css } from 'styled-components'
import { NavLink } from 'react-router-dom'

import theme from '../../theme'
import { mediaQueryPhoneOnly, hoverState } from '../../library/styling/mediaQueries'
import { UserIcon } from '../UserIcon/UserIcon'

export const NavWrapper = styled('nav')`
  background: ${theme.color.grey4};
  height: 100%;
  width: ${theme.spacing.sideNavWidth};
  ${mediaQueryPhoneOnly(css`
    width: ${theme.spacing.mobileSideNavWidth};
    font-size: ${theme.typography.xSmallFontSize};
  `)}
`
export const LiCollecting = styled('li')`
  border-style: solid;
  border-color: ${theme.color.primaryColor};
  border-width: 2px 0;
  position: relative;
  ${mediaQueryPhoneOnly(css`
    border: none;
  `)}
`
export const CollectionAvatar = styled(UserIcon)`
  border-radius: 50%;
  position: absolute;
  right: 1rem;
  top: -1.75rem;
  outline: solid 2px ${theme.color.primaryColor};
  width: 32px;
  aspect-ratio: 1 / 1;
  z-index: 1;
  ${mediaQueryPhoneOnly(css`
    display: none;
  `)}
`
export const LiNavPrimary = styled('li')`
  background: ${theme.color.white};
  font-size: ${theme.typography.defaultFontSize};
  font-weight: 700;
  ${mediaQueryPhoneOnly(css`
    font-size: 1.2rem;
  `)}
`
export const LiNavSecondary = styled('li')`
  background: ${theme.color.grey4};
  font-size: ${theme.typography.smallFontSize};
`
export const NavList = styled('ul')`
  position: sticky;
  top: ${theme.spacing.headerHeight};
  padding: 0;
  margin: 0;
  & ul {
    padding: 0;
    li {
      a {
        font-size: inherit;
        color: inherit;
        ${mediaQueryPhoneOnly(css`
          padding: ${theme.spacing.small} ${theme.spacing.xsmall};
        `)}
      }
    }
  }
`

export const NavHeader = styled('p')`
  margin: 0;
  color: ${theme.color.textColor};
  padding: ${theme.spacing.large} 0 ${theme.spacing.medium} ${theme.spacing.medium};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  font-size: ${theme.typography.largeFontSize};
  ${mediaQueryPhoneOnly(css`
    font-size: ${theme.typography.defaultFontSize};
    padding-left: ${theme.spacing.xsmall};
  `)}
`
export const NavHeaderSecondary = styled(NavHeader)`
  font-size: 1.4rem;
  ${mediaQueryPhoneOnly(css`
    font-size: 1.2rem;
    letter-spacing: 1px;
  `)}
`
export const NavLinkSidebar = styled(NavLink)`
  padding: 0.75rem ${theme.spacing.small};
  text-decoration: none;
  display: grid;
  grid-template-columns: 3rem auto;
  align-items: baseline;
  ${theme.typography.noWordBreak};
  ${hoverState(css`
    background-color: ${theme.color.primaryHover};
    color: ${theme.color.white};
  `)}
  &:active {
    background-color: ${theme.color.primaryActive};
  }
  & > svg {
    margin: 0.25rem ${theme.spacing.small} 0 ${theme.spacing.small};
  }
  &.active {
    background-color: ${theme.color.primaryColor};
    color: ${theme.color.white};
  }
  ${mediaQueryPhoneOnly(css`
    display: block;
    svg {
      display: none;
    }
  `)}
`
