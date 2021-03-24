import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import {
  mediaQueryTabletLandscapeOnly,
  hoverState,
} from '../../library/styling/mediaQueries'

export const NavLinkButtonish = styled(NavLink)`
  padding: ${theme.spacing.buttonPadding};
  border-width: 1px;
  border-style: solid;
  text-decoration: none;
  background-color: ${theme.color.secondaryColor};
  color: ${theme.color.secondaryText};
  border-color: ${theme.color.secondaryBorder};
  ${hoverState(css`
    background-color: ${theme.color.secondaryHover};
  `)}
  &:active {
    background-color: ${theme.color.secondaryActive};
  }
`
export const NavLinkButtonishIcon = styled(NavLinkButtonish)``

const activeStyle = css`
  background-color: ${theme.color.black};
  color: ${theme.color.white};
`

export const NavLinkSidebar = styled(NavLink)`
  padding: ${theme.spacing.small};
  text-decoration: none;
  display: block;
  ${hoverState(css`
    background-color: ${theme.color.primaryHover};
    color: ${theme.color.white};
  `)}
  :active {
    background-color: ${theme.color.primaryActive};
  }
  & > svg {
    margin: 0 ${theme.spacing.small};
  }
  &.active {
    ${activeStyle};
  }
  ${mediaQueryTabletLandscapeOnly(css`
    text-align: center;
    span {
      display: block;
      font-size: 1rem;
      ${theme.typography.noWordBreak};
    }
  `)}
`
