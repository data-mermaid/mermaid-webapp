import styled, { css } from 'styled-components/macro'
import { mediaQueryHover } from '../../library/styling/mediaQueries'

const buttonActive = css`
  background-color: fuchsia;
`

export const ButtonPrimary = styled.button`
  background-color: blue;
  color: white;
  ${mediaQueryHover(
    css`
      padding: ${(props) => props.theme.spacing.large};
    `,
  )}
`

export const ButtonSecondary = styled.button`
  background-color: lightgray;
  ${mediaQueryHover('padding: 5px')}
`

const someVar = '3px'

export const ButtonCallout = styled.button`
  background-color: green;
  ${mediaQueryHover(`padding: ${someVar}`)}
`
export const ButtonCaution = styled.button`
  background-color: red;
  &:active {
    ${buttonActive}
  }
`
