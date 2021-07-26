import styled from 'styled-components/macro'

export const Row = styled.div`
  display: flex;
  width: 100%;
`
export const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
  align-items: baseline;
`
export const RowRight = styled(Row)`
  justify-content: flex-end;
`

export const RowCenter = styled(Row)`
  justify-content: center;
`

export const RowLeft = styled(Row)`
  justify-content: flex-start;
`

export const RowBottom = styled(Row)`
  align-items: flex-end;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`
