import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import { hoverState } from '../../library/styling/mediaQueries'

export const FormWrapper = styled.div`
  padding: ${theme.spacing.medium};
`
const InputTextareaSelectStyles = css`
  padding: ${theme.spacing.xsmall};
  border: solid 1px ${theme.color.border};
  background-color: ${theme.color.inputBackground};
  width: 100%;
  &:focus {
    outline: ${theme.color.outline};
  }
`
export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 175px 2fr 1fr;
  margin: 1px 0;
  padding: ${theme.spacing.medium};
  border-width: 0 0 0 ${theme.spacing.borderXLarge};
  border-style: solid;
  border-color: ${theme.color.secondaryColor};
  ${hoverState(css`
    background-color: ${theme.color.secondaryHover};
  `)}
  &:focus-within {
    background-color: ${theme.color.tableRowHover};
  }

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
export const ValidationMessage = styled.div`
  ${(props) =>
    props.validationType === 'error' &&
    css`
      /* color: red; */
    `}
  ${(props) =>
    props.validationType === 'warning' &&
    css`
      /* color: darkgoldenrod; */
    `}
`
export const Select = styled.select`
  ${InputTextareaSelectStyles}
`
export const Input = styled.input`
  ${InputTextareaSelectStyles}
`
export const TextArea = styled.textarea`
  ${InputTextareaSelectStyles}
`
