import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import { hoverState, mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'

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

export const validationRowStyles = css`
  border-width: 0 0 0 ${theme.spacing.borderLarge};
  border-style: solid;
  border-color: ${theme.color.secondaryColor};
  ${hoverState(css`
    background-color: ${theme.color.tableRowHover};
  `)}
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
  ${validationRowStyles};
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
  ${(props) =>
    props.validationType === 'error' &&
    css`
      border-color: ${theme.color.cautionColor};
    `}
  ${(props) =>
    (props.validationType === 'warning' || props.validationType === 'reset') &&
    css`
      border-color: ${theme.color.warningColor};
    `}
    ${(props) =>
    props.validationType === 'ignore' &&
    css`
      border-color: ${theme.color.ignoreColor};
    `}
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
