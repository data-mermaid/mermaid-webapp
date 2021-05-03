import styled, { css } from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import theme from '../../theme'
import { hoverState } from '../../library/styling/mediaQueries'

const buttonActive = css`
  background-color: fuchsia;
`

export const Button = styled.button`
  padding: ${theme.spacing.buttonPadding};
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  &:active {
    ${buttonActive};
  }
`

export const ButtonPrimary = styled(Button)`
  background-color: ${(props) =>
    props.disabled
      ? theme.color.primaryColor.desaturate(0.9)
      : theme.color.primaryColor};
  color: ${theme.color.primaryText};
  border-color: ${theme.color.primaryBorder};
  ${hoverState(
    css`
      background-color: ${theme.color.primaryHover};
    `,
  )}
  &:active {
    ${buttonActive};
  }
`
export const ButtonSecondary = styled(Button)`
  background-color: ${(props) =>
    props.disabled
      ? theme.color.secondaryColor.desaturate(0.9)
      : theme.color.secondaryColor};
  color: ${theme.color.secondaryText};
  border-color: ${theme.color.secondaryBorder};
  &:hover {
    background-color: ${theme.color.secondaryHover};
  }
  &:active {
    ${buttonActive};
  }
`
export const ButtonCallout = styled(Button)`
  background-color: ${(props) =>
    props.disabled
      ? theme.color.calloutColor.desaturate(0.9)
      : theme.color.calloutColor};
  color: ${theme.color.calloutText};
  border-color: ${theme.color.calloutBorder};
  &:hover {
    background-color: ${theme.color.calloutHover};
  }
  &:active {
    ${buttonActive};
  }
`
export const ButtonCaution = styled(Button)`
  background-color: ${(props) =>
    props.disabled
      ? theme.color.cautionColor.desaturate(0.9)
      : theme.color.cautionColor};
  color: ${theme.color.cautionText};
  border-color: ${theme.color.cautionBorder};
  &:hover {
    background-color: ${theme.color.cautionHover};
  }
  &:active {
    ${buttonActive};
  }
`
export const ButtonyNavLink = styled(NavLink)`
  background-color: lightgray;
  border: solid thin grey;
`
export const ButtonyNavLinkIcon = styled(ButtonyNavLink)``

export const LinkButton = styled('button')`
  font-size: inherit;
  background: none;
  margin: 0;
  padding: 0;
  border: none;
  cursor: pointer;
  overflow: visible; /* IE hack */
  width: auto; /* IE hack */
`
