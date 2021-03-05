import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { hoverState } from '../../library/styling/mediaQueries'

export const NavLinkButtonish = styled(NavLink)`
  padding: ${(props) => props.theme.spacing.buttonPadding};
  border-width: 1px;
  border-style: solid;
  text-decoration: none;
  background-color: ${(props) => props.theme.color.secondaryColor};
  color: ${(props) => props.theme.color.secondaryText};
  border-color: ${(props) => props.theme.color.secondaryBorder};
  &:hover {
    background-color: ${(props) => props.theme.color.secondaryHover};
  }
  &:active {
    background-color: red;
  }
`
export const NavLinkButtonishIcon = styled(NavLinkButtonish)``

export const NavLinkSidebar = styled(NavLink)`
  padding: ${(props) => props.theme.spacing.small};
  text-decoration: none;
  display: block;
  ${hoverState(css`
    background-color: ${(props) => props.theme.color.primaryHover};
    color: ${(props) => props.theme.color.white};
  `)}
  & > svg {
    margin-left: ${(props) => props.theme.spacing.small};
    margin-right: ${(props) => props.theme.spacing.small};
  }
`
