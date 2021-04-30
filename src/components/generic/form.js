import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import { hoverState } from '../../library/styling/mediaQueries'

export const FormWrapper = styled.div`
  padding: ${theme.spacing.medium};
`
const InputTextareaSelectStyles = css`
  padding: ${theme.spacing.xsmall};
  height: fit-content;
  border: solid ${theme.spacing.borderSmall} ${theme.color.border};
  background-color: ${theme.color.inputBackground};
  width: 100%;
  &:focus {
    outline: ${theme.color.outline};
  }
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
  span {
    display: inline-block;
    ${theme.typography.noWordBreak};
    padding: calc(${theme.spacing.borderSmall} + ${theme.spacing.xsmall})
      ${theme.spacing.xsmall};
  }
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
export const ValidationMessage = styled.span`
  /* ${(props) => props.validationType === 'error' && css``}
  ${(props) => props.validationType === 'warning' && css``} */
`
export const Select = styled.select`
  ${InputTextareaSelectStyles}
`
export const Input = styled.input`
  ${InputTextareaSelectStyles}
`
export const Textarea = styled.textarea`
  resize: none;
  ${InputTextareaSelectStyles}
`
