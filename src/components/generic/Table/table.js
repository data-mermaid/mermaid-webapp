import styled, { css } from 'styled-components'

export const Table = styled.table``
export const Th = styled.th(
  (props) => css`
    text-align: ${props.align || 'left'};
    padding: ${props.theme.spacing.medium};

    ${props.isSorted &&
    props.isSortedDescending &&
    `
      &::after {
        content: ' \u25bc';
      }
    `}
    ${props.isSorted &&
    !props.isSortedDescending &&
    `
      &::after {
        content: ' \u25b2';
      }
    `}
  `,
)
export const Td = styled.td(
  (props) => css`
    text-align: ${props.align || 'left'};
    padding: ${props.theme.spacing.medium};
  `,
)
export const Tr = styled.tr``
