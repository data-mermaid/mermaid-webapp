import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'

import { hoverState } from '../../library/styling/mediaQueries'
import theme from '../../theme'

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
const buttonCss = css`
  transition: ${theme.timing.activeTransition};
  padding: ${theme.spacing.buttonPadding};
  border-width: 0;
  display: inline-block;
  cursor: pointer;
  &:disabled {
    color: ${theme.color.disabledTextDark};
    cursor: not-allowed;
  }
  &:active:enabled {
    ${buttonActive};
  }
`

export const Button = styled.button`
  ${buttonCss}
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
    color: ${theme.color.primaryDisabledText};
  }
  &:active:enabled {
    background-color: ${theme.color.primaryActive};
  }
`

const buttonSecondaryCss = css`
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
    color: ${theme.color.secondaryDisabledText};
  }
  &:active:enabled {
    background-color: ${theme.color.secondaryActive};
  }
`

export const ButtonSecondary = styled(Button)`
  ${buttonSecondaryCss}
`
export const LinkLooksLikeButtonSecondary = styled(Link)`
  ${buttonCss}
  ${buttonSecondaryCss}
  text-decoration: none;
`

export const ButtonCallout = styled(Button)`
  background-color: ${theme.color.calloutColor};
  color: ${theme.color.calloutText};
  border: solid 1px ${theme.color.calloutBorder};
  ${hoverState(
    css`
      background-color: ${theme.color.calloutHover};
    `,
  )}
  &:disabled {
    color: ${theme.color.calloutDisabledText};
    border-color: ${theme.color.disabledBorder};
  }
  &:active:enabled {
    background-color: ${theme.color.calloutActive};
  }
`
export const ButtonCaution = styled(Button)`
  background-color: ${theme.color.cautionColor};
  color: ${theme.color.white};
  border: solid 1px ${theme.color.cautionColor};
  ${hoverState(
    css`
      background-color: ${theme.color.cautionColor};
      color: ${theme.color.white};
    `,
  )}
  &:disabled {
    background-color: ${theme.color.cautionDisabledColor};
    color: ${theme.color.cautionDisabledText};
  }
  &:active:enabled {
    background-color: ${theme.color.cautionActive};
  }
`

export const ButtonThatLooksLikeLink = styled('button')`
  font-size: inherit;
  padding: ${theme.spacing.buttonPadding};
  background: none;
  border: none;
  cursor: pointer;
  &:disabled {
    color: ${theme.color.secondaryDisabledText};
  }
`
export const ToolbarButtonWrapper = styled('div')`
  button,
  a {
    margin: 0 -1px;
  }
`
