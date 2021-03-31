import styled, { css } from 'styled-components'
import theme from '../../../theme'

export const Table = styled.table`
  border-collapse: collapse;
`
export const Th = styled.th(
  (props) => css`
    text-align: ${props.align || 'left'};
    padding: ${theme.spacing.medium};
    background: ${theme.color.white};
    white-space: nowrap;
    &::after {
      content: ' \u25bc';
      color: transparent;
    }
    ${props.isSorted &&
    props.isSortedDescending &&
    `
      &::after {
        content: ' \u25bc';
        color: ${theme.color.black};
      }
    `}
    ${props.isSorted &&
    !props.isSortedDescending &&
    `
      &::after {
        content: ' \u25b2';
        color: ${theme.color.black};
      }
    `}
  `,
)
export const Td = styled.td(
  (props) => css`
    text-align: ${props.align || 'left'};
    padding: ${theme.spacing.medium};
    border-width: 0 thin;
    border-color: rgba(255, 255, 255, 0.5);
    border-style: solid;
  `,
)
export const Tr = styled.tr`
  &:nth-child(odd) {
    background-color: ${theme.color.tableRowOdd};
  }
  &:nth-child(even) {
    background-color: ${theme.color.tableRowEven};
  }
`
