import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const NavLinkButtonish = styled(NavLink)`
  background-color: lightgray;
  border: solid thin grey;
`
export const NavLinkButtonishIcon = styled(NavLinkButtonish)``

export const NavLinkSidebar = styled(NavLink)`
  & > svg {
    margin-left: ${(props) => props.theme.spacing.small};
    margin-right: ${(props) => props.theme.spacing.small};
  }
`
