import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import { hoverState, mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'

const linkThatLooksLikeButtonStyles = css`
  text-decoration: none;
  padding: ${theme.spacing.buttonPadding};
  background-color: ${theme.color.secondaryColor};
  color: ${theme.color.secondaryText};
  ${hoverState(css`
    background-color: ${theme.color.secondaryHover};
  `)}
  &:active {
    background-color: ${theme.color.secondaryActive};
  }
`

export const NavLinkThatLooksLikeButton = styled(NavLink)`
  ${linkThatLooksLikeButtonStyles}
`
export const LinkThatLooksLikeButton = styled.a`
  ${linkThatLooksLikeButtonStyles}
`

export const NavLinkThatLooksLikeButtonIcon = styled(NavLinkThatLooksLikeButton)``

export const NavLinkSidebar = styled(NavLink)`
  padding: ${theme.spacing.small};
  text-decoration: none;
  display: grid;
  grid-template-columns: 3rem auto auto;
  align-items: center;
  ${theme.typography.noWordBreak};
  ${hoverState(css`
    background-color: ${theme.color.primaryHover};
    color: ${theme.color.white};
  `)}
  &:active {
    background-color: ${theme.color.primaryActive};
  }
  & > svg {
    margin: ${theme.spacing.small};
  }
  &.active {
    background-color: ${theme.color.primaryColor};
    color: ${theme.color.white};
  }
  span {
    white-space: break-spaces;
  }
  ${mediaQueryPhoneOnly(css`
    padding: 0 ${theme.spacing.small};
    display: block;
    text-align: center;
    svg {
      display: block;
      margin-inline: auto;
    }
  `)}
`
