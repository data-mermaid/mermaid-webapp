import styled from 'styled-components/macro'
import theme from '../../theme'

export const Row = styled.div`
  display: flex;
`
export const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
  align-items: baseline;
`
export const RowRight = styled(Row)`
  justify-content: flex-end;
  & > * {
    margin-right: ${theme.spacing.small};
  }
`

export const RowCenter = styled(Row)`
  justify-content: center;
`

export const RowLeft = styled(Row)`
  justify-content: flex-start;
  & > * {
    margin-right: ${theme.spacing.small};
  }
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`
