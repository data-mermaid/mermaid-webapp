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
  ${hoverState(css`
    background-color: ${(props) => props.theme.color.secondaryHover};
  `)}
  &:active {
    background-color: ${(props) => props.theme.color.secondaryActive};
  }
`
export const NavLinkButtonishIcon = styled(NavLinkButtonish)``

const activeStyle = css`
  background-color: ${(props) => props.theme.color.black};
  color: ${(props) => props.theme.color.white};
`

export const NavLinkSidebar = styled(NavLink)`
  padding: ${(props) => props.theme.spacing.small};
  text-decoration: none;
  display: block;
  ${hoverState(css`
    background-color: ${(props) => props.theme.color.primaryHover};
    color: ${(props) => props.theme.color.white};
  `)}
  :active {
    background-color: ${(props) => props.theme.color.primaryActive};
  }
  & > svg {
    margin: 0 ${(props) => props.theme.spacing.small};
  }
  &.active {
    ${activeStyle};
  }
`
