import { NavLink } from 'react-router-dom'
import { styled, css } from 'styled-components'
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

export const TextLink = styled('a')`
  padding: ${theme.spacing.small};
`
export const LinkContainer = styled('div')`
  padding: ${theme.spacing.small};
`

export const HelperTextLink = styled('a')`
  font-size: 1.2rem;
  color: ${(props) => props.color || '#000000'};
`
export const ViewLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: small;
  text-decoration: none;
  padding: ${theme.spacing.small};
  border: solid ${theme.spacing.borderSmall} ${theme.color.border};
  background-color: ${theme.color.inputBackground};
  text-align: inherit;
  cursor: pointer;

  &[disabled] {
    color: ${theme.color.secondaryDisabledText};
    background-color: ${theme.color.secondaryDisabledColor};
    cursor: not-allowed;
    pointer-events: none;
  }
  ${hoverState(css`
    background-color: ${theme.color.secondaryHover};
  `)}
  &:active {
    background-color: ${theme.color.secondaryActive};
  }
`
