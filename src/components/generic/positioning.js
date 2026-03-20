import { styled } from 'styled-components'

export const Row = styled.div`
  display: flex;
  width: 100%;
`
export const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
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
  text-align: ${(props) => props.$align};
`
export const ToolBarRow = styled(Row)`
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem 1rem;
`

// new to accomodate methods filter
export const ToolBarItemsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 1rem 1rem;
`

export const FilterItems = styled.div`
  display: flex;
  flex-grow: 2;
  align-items: end;
  gap: 1rem 1rem;
`
