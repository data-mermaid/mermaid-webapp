import { styled, css } from 'styled-components'
import { CheckRadioLabel, CheckRadioWrapper } from '../../generic/form'

export const StyledCheckRadioWrapper = styled(CheckRadioWrapper)`
  display: block;
`
export const PartialRestrictionsCheckboxCheckRadioWrapper = styled(CheckRadioWrapper)`
  margin-left: 2rem;
`
export const StyledCheckRadioLabel = styled(CheckRadioLabel)`
  > span {
    display: block;
    font-size: x-small;
    padding-left: 2rem;
  }
`
export const helperTextStyles = css`
  display: block;
  font-size: x-small;
`
export const RadioHelperText = styled('div')`
  ${helperTextStyles}
  padding-left: 2rem;
`
export const NestedCheckboxHelperText = styled('div')`
  ${helperTextStyles}
  padding-left: 4rem;
`
