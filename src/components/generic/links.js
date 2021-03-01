import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

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
  & > svg {
    margin-left: ${(props) => props.theme.spacing.small};
    margin-right: ${(props) => props.theme.spacing.small};
  }
`
