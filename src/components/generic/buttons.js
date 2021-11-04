import styled, { css } from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import theme from '../../theme'
import { hoverState } from '../../library/styling/mediaQueries'

const buttonActive = css`
  transition: ${theme.timing.activeTransition};
`

export const CloseButton = styled.button`
  background-color: ${theme.color.secondaryColor};
  color: ${theme.color.secondaryText};
  border-color: ${theme.color.secondaryBorder};
  border-radius: 100%;
  background: transparent;
  border: none;
  padding: 0;
  line-height: 0;
  width: 4rem;
  height: 4rem;
  cursor: pointer;
  transition: ${theme.timing.hoverTransition};
  ${hoverState(css`
    background: ${theme.color.secondaryHover};
  `)}
`

export const Button = styled.button`
  transition: ${theme.timing.activeTransition};
  padding: ${theme.spacing.buttonPadding};
  border-width: 0;
  &:disabled {
    color: ${theme.color.disabledText};
    cursor: not-allowed;
  }
  &:active {
    ${buttonActive};
  }
`

export const ButtonPrimary = styled(Button)`
  background-color: ${theme.color.primaryColor};
  color: ${theme.color.primaryText};
  ${hoverState(
    css`
      background-color: ${theme.color.primaryHover};
    `,
  )}
  &:disabled {
    background-color: ${theme.color.primaryDisabledColor};
  }
  &:active {
    background-color: ${theme.color.primaryActive};
  }
`
export const ButtonSecondary = styled(Button)`
  background-color: ${theme.color.white};
  color: ${theme.color.secondaryText};
  border: solid 1px ${theme.color.secondaryBorder};
  ${hoverState(
    css`
      background-color: ${theme.color.secondaryHover};
    `,
  )}
  &:disabled {
    background-color: ${theme.color.secondaryDisabledColor};
  }
  &:active {
    background-color: ${theme.color.secondaryActive};
  }
`
export const ButtonCallout = styled(Button)`
  background-color: ${theme.color.calloutColor};
  color: ${theme.color.calloutText};
  ${hoverState(
    css`
      background-color: ${theme.color.calloutHover};
    `,
  )}
  &:disabled {
    background-color: ${theme.color.calloutDisabledColor};
  }
  &:active {
    background-color: ${theme.color.calloutActive};
  }
`
export const ButtonCaution = styled(Button)`
  background-color: ${theme.color.white};
  color: ${theme.color.cautionColor};
  border: solid 1px ${theme.color.cautionColor};
  ${hoverState(
    css`
      background-color: ${theme.color.cautionHover};
    `,
  )}
  &:disabled {
    background-color: ${theme.color.cautionDisabledColor};
  }
  &:active {
    background-color: ${theme.color.cautionActive};
  }
`
export const ButtonyNavLink = styled(NavLink)`
  background-color: lightgray;
  border: solid thin grey;
`
export const ButtonyNavLinkIcon = styled(ButtonyNavLink)``

export const ButtonThatLooksLikeLink = styled('button')`
  font-size: inherit;
  background: none;
  margin: 0;
  padding: 0;
  border: none;
  cursor: pointer;
  overflow: visible; /* IE hack */
  width: auto; /* IE hack */
  &:disabled {
    color: ${theme.color.disabledText};
  }
`
export const ToolbarButtonWrapper = styled('div')`
  button {
    margin: 0 -1px;
  }
`
