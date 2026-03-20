import { styled, css } from 'styled-components'
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
  grid-template-columns: 1.5rem auto;
  align-items: bottom;
  padding: ${theme.spacing.xsmall};
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
    margin-bottom: ${theme.spacing.xsmall};
    ${mediaQueryPhoneOnly(css`
      flex-direction: column;
      align-items: start;
      margin-bottom: ${theme.spacing.medium};
    `)}
  }
`

export const InputWrapper = styled.div`
  padding: ${theme.spacing.medium};
`
export const MaxWidthInputWrapper = styled(InputWrapper)`
  max-width: ${theme.spacing.maxWidth};
  cursor: ${(props) => props.$cursor || 'pointer'};
`
export const HelperText = styled.span`
  font-size: ${theme.typography.smallFontSize};
  color: ${theme.color.textColor};
  display: block;
`
export const inputTextareaSelectStyles = css`
  padding: ${theme.spacing.small};
  border: solid ${theme.spacing.borderSmall} ${theme.color.border};
  background-color: ${theme.color.inputBackground};
  text-align: inherit;
  width: 100%;
  &:focus {
    outline: ${theme.color.outline};
    outline-offset: -3px;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: ${(props) => (props.$shouldShowSteps ? 'auto' : 'none')};
  }
  -moz-appearance: textfield;
  &:disabled {
    background: ${theme.color.disabledInputBackground};
    cursor: not-allowed;
    color: ${theme.color.disabledTextDark};
  }
`
export const RequiredIndicator = styled.span`
  color: ${theme.color.callout};
  &::after {
    content: ' *';
  }
`
export const InputRow = styled.div.attrs({
  className: 'inputRow', // Used to override styles in GFCR forms
})`
  display: grid;
  grid-template-columns: 23rem 31rem 1fr;
  max-width: ${theme.spacing.maxWidth};
  margin: 1px 0;
  padding: ${theme.spacing.medium};
  border-width: 0 0 0 ${theme.spacing.borderLarge};
  border-style: solid;
  border-color: ${(props) => theme.color.getBorderColor(props.$validationType)};
  align-items: baseline;
  > label {
    align-self: start;
  }
  ${hoverState(css`
    background-color: ${theme.color.tableRowHover};
  `)}
  ${mediaQueryTabletLandscapeOnly(css`
    grid-template-columns: auto 1fr;
    grid-template-rows: minmax(30px, auto) 1fr;
    margin: 5px 0;
    gap: 10px;
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

export const Select = styled.select`
  ${inputTextareaSelectStyles}
`
export const Input = styled.input`
  ${inputTextareaSelectStyles}
  &[type='number'] {
    text-align: right;
  }
  &[type='text'] {
    text-align: ${(props) => props.$textAlign || 'left'};
  }
  &:disabled {
    background: ${theme.color.disabledInputBackground};
    cursor: not-allowed;
    color: ${theme.color.disabledTextDark};
  }
`
export const Textarea = styled.textarea`
  resize: vertical;
  ${inputTextareaSelectStyles}
`
export const LabelContainer = styled.div.attrs({
  className: 'labelContainer', // Used to override styles in GFCR forms
})`
  display: flex;
  flex-direction: row;
  position: relative;
`
export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const IconContainer = styled.div`
  margin-right: 0.2em;
`
