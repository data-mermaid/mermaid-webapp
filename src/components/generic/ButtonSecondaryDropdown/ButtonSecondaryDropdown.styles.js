import styled, { css } from 'styled-components'
import { hoverState } from '../../../library/styling/mediaQueries'
import { DropdownContainer } from '../HideShow'
import theme from '../../../theme'

export const StyledDropdownContainer = styled(DropdownContainer)`
  background-color: ${theme.color.white};
  border: solid 1px ${theme.color.border};
`

export const DropdownItemStyle = styled.button`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  ${hoverState(css`
    background-color: ${theme.color.secondaryHover};
  `)}

  &:disabled {
    background-color: ${theme.color.grey1};
    cursor: not-allowed;
  }
`
