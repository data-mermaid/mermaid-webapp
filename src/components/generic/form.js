import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import {
  hoverState,
  mediaQueryPhoneOnly,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'

export const inputStyles = css`
  padding: ${theme.spacing.small};
  ${mediaQueryPhoneOnly(css`
    padding: ${theme.spacing.xsmall};
  `)}
`
export const CheckRadioWrapper = styled.div`
  display: grid;
  grid-template-columns: 2rem auto;
  justify-items: start;
  padding: ${theme.spacing.xsmall};
  input {
    margin-top: ${theme.spacing.xsmall};
  }
  ${hoverState(css`
    background-color: ${theme.color.white};
  `)}
`
export const CheckRadioLabel = styled.label`
  padding: 0 ${theme.spacing.small};
  width: 100%;
  @media (hover: none) {
    width: auto;
    padding-bottom: ${theme.spacing.medium};
  }
`
export const ValidationList = styled('ul')`
  list-style: none;
  padding: ${theme.spacing.medium};
  margin: 0;
  li {
    display: flex;
    justify-content: space-between;
    span {
      margin: ${theme.spacing.xxsmall} 0;
      display: block;
      width: 100%;
      padding: ${theme.spacing.small};
    }
  }
`

export const validationBorderColors = css`
  ${(props) =>
    props.validationType === 'ok' &&
    css`
      border-color: ${theme.color.valid};
    `}
  ${(props) =>
    props.validationType === 'error' &&
    css`
      border-color: ${theme.color.cautionColor};
    `}
  ${(props) =>
    props.validationType === 'warning' &&
    css`
      border-color: ${theme.color.warningColor};
    `}
    ${(props) =>
    props.validationType === 'ignore' &&
    css`
      border-color: ${theme.color.ignoreBorder};
    `}
`

export const InputWrapper = styled.div`
  padding: ${theme.spacing.medium};
`
export const MaxWidthInputWrapper = styled(InputWrapper)`
  max-width: ${theme.spacing.maxWidth};
`
export const HelperText = styled.span`
  font-size: ${theme.typography.smallFontSize};
  color: ${theme.color.textColor};
  display: block;
`
export const inputTextareaSelectStyles = css`
  padding: ${theme.spacing.xsmall};
  height: fit-content;
  border: solid ${theme.spacing.borderSmall} ${theme.color.border};
  background-color: ${theme.color.inputBackground};
  text-align: inherit;
  width: 100%;
  &:focus {
    outline: ${theme.color.outline};
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  -moz-appearance: textfield;
`

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 0.75fr 1.5fr 1fr;
  margin: 1px 0;
  padding: ${theme.spacing.medium};
  border-width: 0 0 0 ${theme.spacing.borderLarge};
  border-style: solid;
  border-color: ${theme.color.secondaryColor};
  ${hoverState(css`
    background-color: ${theme.color.tableRowHover};
  `)}
  ${validationBorderColors};
  ${mediaQueryTabletLandscapeOnly(css`
    grid-template-columns: auto 1fr;
    grid-template-rows: minmax(30px, auto) 1fr;
    margin: 5px 0;
    gap: 10px;
    & > :nth-child(1) {
      /* label */
      grid-row: 1 / 3;
      grid-column: 1 / 2;
      display: block;
    }
    & > :nth-child(2) {
      /* input */
      grid-row: 2 / 3;
      grid-column: 1 / 3;
    }
    & > :nth-child(3) {
      /* validation */
      align-self: center;
      grid-row: 1 / 2;
      grid-column: 2 / 3;
    }
  `)}
`
export const ValidationMessage = styled.span.attrs((props) => ({
  role:
    props.validationType === 'error' ||
    props.validationType === 'warning' ||
    props.validationType === 'reset'
      ? 'alert'
      : undefined,
}))`
  border-style: solid;
  border-width: 1px 1px 1px ${theme.spacing.borderLarge};
  ${validationBorderColors};
`

export const Select = styled.select`
  ${inputTextareaSelectStyles}
`
export const Input = styled.input`
  ${inputTextareaSelectStyles}
`
export const Textarea = styled.textarea`
  resize: none;
  ${inputTextareaSelectStyles}
`
