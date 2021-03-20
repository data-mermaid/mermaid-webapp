import styled, { css } from 'styled-components'

export const InputRow = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  height: 60px;
  margin: 0px 10px;
  padding: 10px 0px 10px 20px;
  align-items: center;
  border-left: 10px solid lightgrey;
  ${(props) =>
    props.validationType === 'error' &&
    css`
      border-left-color: #85282c;
      border-top: 1px solid red;
      border-right: 1px solid red;
      border-bottom: 1px solid red;
      background: #e4babb;
    `}
  ${(props) =>
    props.validationType === 'warning' &&
    css`
      border-left-color: yellow;
      border-top: 1px solid yellow;
      border-right: 1px solid yellow;
      border-bottom: 1px solid yellow;
      background: lightyellow;
    `}
`
export const ValidationMessage = styled.div`
  ${(props) =>
    props.validationType === 'error' &&
    css`
      color: red;
    `}
  ${(props) =>
    props.validationType === 'warning' &&
    css`
      color: darkgoldenrod;
    `}
`
export const Select = styled.select``
