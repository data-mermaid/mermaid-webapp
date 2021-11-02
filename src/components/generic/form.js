import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import {
  hoverState,
  mediaQueryPhoneOnly,
} from '../../library/styling/mediaQueries'

export const inputStyles = css`
  padding: ${theme.spacing.small};
  ${mediaQueryPhoneOnly(css`
    padding: ${theme.spacing.xsmall};
  `)}
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
  border-width: 0 0 0 ${theme.spacing.borderXLarge};
  border-style: solid;
  border-color: ${theme.color.secondaryColor};
  label,
  & > div:last-of-type {
    display: inline-block;
    ${theme.typography.noWordBreak};
    padding: calc(${theme.spacing.borderSmall} + ${theme.spacing.xsmall})
      ${theme.spacing.xsmall};
  }
  ${hoverState(css`
    background-color: ${theme.color.secondaryHover};
  `)}
  &:focus-within {
    background-color: ${theme.color.focusWithin};
  }
${(props) =>
  (props.validationType === 'ok' || !props.validationType) &&
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
`
export const ValidationMessage = styled.span.attrs((props) => ({
  role:
    props.validationType === 'error' || props.validationType === 'warning'
      ? 'alert'
      : undefined,
}))``
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
