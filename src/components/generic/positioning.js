import styled from 'styled-components/macro'

export const Row = styled.div`
  display: flex;
`
export const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
  align-items: baseline;
`
export const RowRight = styled(Row)`
  justify-content: flex-end;
`
export const Column = styled.div`
  display: flex;
  flex-direction: column;
`
