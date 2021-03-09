import styled, { css } from 'styled-components/macro'

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
    margin-right: ${(props) => props.theme.spacing.small};
  }
`

export const RowLeft = styled(Row)`
  justify-content: flex-start;
  & > * {
    margin-right: ${(props) => props.theme.spacing.small};
  }
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`

export const FormGrid = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  height: 60px;
  margin: 0px 10px;
  padding: 10px 0px 10px 20px;
  align-items: center;
  border-left: 10px solid lightgrey;
  ${(props) =>
    props.validation === 'warning' &&
    css`
      border-left-color: #d99d61;
      border-top: 1px solid red;
      border-right: 1px solid red;
      border-bottom: 1px solid red;
      background: #e5ca80;
    `}
  ${(props) =>
    props.validation === 'error' &&
    css`
      border-left-color: #85282c;
      border-top: 1px solid red;
      border-right: 1px solid red;
      border-bottom: 1px solid red;
      background: #e4babb;
    `}
`
