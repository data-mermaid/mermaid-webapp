import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import { hoverState } from '../../library/styling/mediaQueries'

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
