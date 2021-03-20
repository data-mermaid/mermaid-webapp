import styled, { css } from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import { hoverState } from '../../library/styling/mediaQueries'

const buttonActive = css`
  background-color: fuchsia;
`

export const Button = styled.button`
  padding: ${(props) => props.theme.spacing.buttonPadding};
  border-width: 1px;
  border-style: solid;
  &:active {
    ${buttonActive};
  }
`

export const ButtonPrimary = styled(Button)`
  background-color: ${(props) => props.theme.color.primaryColor};
  color: ${(props) => props.theme.color.primaryText};
  border-color: ${(props) => props.theme.color.primaryBorder};
  ${hoverState(
    css`
      background-color: ${(props) => props.theme.color.primaryHover};
    `,
  )}
  &:active {
    ${buttonActive};
  }
`
export const ButtonSecondary = styled(Button)`
  background-color: ${(props) => props.theme.color.secondaryColor};
  color: ${(props) => props.theme.color.secondaryText};
  border-color: ${(props) => props.theme.color.secondaryBorder};
  &:hover {
    background-color: ${(props) => props.theme.color.secondaryHover};
  }
  &:active {
    ${buttonActive};
  }
`
export const ButtonCallout = styled(Button)`
  background-color: ${(props) => props.theme.color.calloutColor};
  color: ${(props) => props.theme.color.calloutText};
  border-color: ${(props) => props.theme.color.calloutBorder};
  &:hover {
    background-color: ${(props) => props.theme.color.calloutHover};
  }
  &:active {
    ${buttonActive};
  }
`
export const ButtonCaution = styled(Button)`
  background-color: ${(props) => props.theme.color.cautionColor};
  color: ${(props) => props.theme.color.cautionText};
  border-color: ${(props) => props.theme.color.cautionBorder};
  &:hover {
    background-color: ${(props) => props.theme.color.cautionHover};
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
