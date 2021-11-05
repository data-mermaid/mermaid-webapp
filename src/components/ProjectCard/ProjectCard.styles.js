import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import {
  mediaQueryPhoneOnly,
  hoverState,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'

export const ButtonGroups = styled('div')`
  padding: ${theme.spacing.medium};
  display: grid;
  grid-template-columns: auto auto auto 1fr;
  align-items: center;
  gap: ${theme.spacing.small};
  @media (hover: none) {
    a {
      display: none;
    }
  }
  ${mediaQueryTabletLandscapeOnly(css`
    a {
      display: none;
    }
  `)}
`

export const CardWrapper = styled('div')`
  margin: ${theme.spacing.medium} auto 0 auto;
  width: ${theme.spacing.width};
  max-width: ${theme.spacing.maxWidth};
  background: ${theme.color.white};
  cursor: pointer;
  ${hoverState(css`
    background: ${theme.color.tableRowHover};
  `)}
  }
  ${mediaQueryTabletLandscapeOnly(css`
    width: 98%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  `)}
`

export const ProjectNameWrapper = styled('div')`
  background: ${theme.color.primaryColor};
  h2 {
    color: ${theme.color.white};
    margin: 0;
    padding: ${theme.spacing.small} ${theme.spacing.medium};
    ${theme.typography.noWordBreak};
    ${mediaQueryPhoneOnly(css`
      font-size: ${theme.typography.defaultFontSize};
      padding: ${theme.spacing.small};
    `)}
  }
`
export const ProjectInfoWrapper = styled('div')`
  margin: ${theme.spacing.small} ${theme.spacing.medium} 0 0;
  p {
    padding: 0 ${theme.spacing.medium};
    &:first-child {
      // countries
      font-size: larger;
      font-weight: 900;
    }
  }
  ${mediaQueryPhoneOnly(css`
    p {
      padding: 0 ${theme.spacing.small};
    }
  `)}
`

export const CheckBoxLabel = styled.label`
  background: ${theme.color.secondaryColor};
  padding: ${theme.spacing.buttonPadding};
  justify-self: end;
  background: ${props =>
    props.disabled ? theme.color.secondaryDisabledColor : theme.color.secondaryColor};
  color: ${props => (props.disabled ? theme.color.primaryDisabledColor : theme.color.textColor)};
  ${hoverState(css`
    background: ${theme.color.secondaryHover};
  `)}
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
  }
`
