import styled, { css } from 'styled-components/macro'

import { mediaQueryTabletLandscapeOnly } from '../../../library/styling/mediaQueries'
import { H2 } from '../../generic/text'
import { RowRight } from '../../generic/positioning'
import { Table, Th } from '../../generic/Table/table'
import theme from '../../../theme'

export const TheadItem = styled(Th)``
export const FormSubTitle = styled(H2)`
  padding: 0 ${theme.spacing.medium};
`

export const ObservationsSummaryStats = styled(Table)`
  width: 25%;
  table-layout: auto;
  min-width: auto;
  max-width: 40rem;
  border: solid 1px ${theme.color.secondaryColor};
  tr:nth-child(even),
  tr:nth-child(odd) {
    background-color: ${theme.color.white};
  }
  ${mediaQueryTabletLandscapeOnly(css`
    font-size: smaller;
  `)}
`

export const UnderTableRow = styled(RowRight)`
  display: flex;
  align-items: flex-end;
  margin-top: ${theme.spacing.medium};
  ${mediaQueryTabletLandscapeOnly(css`
    flex-direction: column;
    gap: ${theme.spacing.small};
  `)}
`
