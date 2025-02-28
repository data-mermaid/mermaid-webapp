import { css } from 'styled-components'
import styled from 'styled-components/macro'
import theme from '../../../theme'
import { hoverState, mediaQueryPhoneOnly } from '../../../library/styling/mediaQueries'
import { IconAlert } from '../../icons'
import { Td } from '../../generic/Table/table'

export const ToolbarRowWrapper = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${theme.spacing.small};
  ${mediaQueryPhoneOnly(css`
    grid-template-rows: 1fr 1fr;
    grid-template-columns: auto;
  `)}
`

export const InfoParagraph = styled('div')`
  margin-bottom: 1.5em;
`

export const InlineStyle = styled('div')`
  display: inline-flex;
  margin-bottom: ${theme.spacing.small};
`

export const ActiveSampleUnitsIconAlert = styled(IconAlert)`
  color: ${theme.color.textColor};
  margin: 0 ${theme.spacing.small};
`

export const NameCellStyle = styled('div')`
  display: flex;
  gap: 1rem;
  white-space: nowrap;
  align-items: center;
`
export const UserTableTd = styled(Td)`
  position: relative;
`
export const TableRadioLabel = styled.label(
  (props) => css`
    top: 0;
    right: 0;
    cursor: ${props.cursor};
    bottom: 0;
    left: 0;
    position: absolute;
    display: grid;
    place-items: center;
    ${hoverState(css`
      border: solid 1px ${theme.color.primaryColor};
    `)}

    input {
      cursor: ${props.cursor};
    }
  `,
)
