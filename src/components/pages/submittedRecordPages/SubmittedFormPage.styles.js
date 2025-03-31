import styled, { css } from 'styled-components'

import { mediaQueryTabletLandscapeOnly } from '../../../library/styling/mediaQueries'
import { H2 } from '../../generic/text'
import { RowRight } from '../../generic/positioning'
import { Th } from '../../generic/Table/table'
import theme from '../../../theme'

export const TheadItem = styled(Th)``
export const FormSubTitle = styled(H2)`
  padding: 0 ${theme.spacing.medium};
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
