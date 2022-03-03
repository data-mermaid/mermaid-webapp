import styled, { css } from 'styled-components/macro'
import { mediaQueryTabletLandscapeOnly, hoverState } from '../../../library/styling/mediaQueries'
import theme from '../../../theme'

export const TableNavigation = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 0 ${theme.spacing.xsmall} 0;
  > * {
    padding: ${theme.spacing.small} ${theme.spacing.medium};
  }
  *:nth-child(2) {
    justify-self: end;
  }
`
export const TableOverflowWrapper = styled.div`
  max-width: calc(100vw - ${theme.spacing.sideNavWidth} - 20px);
  // 20px is the approx scrollbar width this is to prevent
  // a horziontal scrollbar at the bottom of the page
  // and to keep the toolbar sticky when needed.
  overflow-y: auto;
  & + button,
  button + & {
    margin: ${theme.spacing.medium} 0;
  }
`

export const Table = styled.table`
  background: ${theme.color.secondaryColor};
  min-width: 100%;
  border-collapse: collapse;
`
const getHeaderSortAfter = (isMultiSortColumn, sortedIndex, isSortedDescending) => {
  if (sortedIndex < 0) {
    return null
  }

  let content

  if (isSortedDescending) {
    content = ' \u25bc'
  }

  if (!isSortedDescending) {
    content = ' \u25b2'
  }

  if (isMultiSortColumn) {
    content = `${content} ${sortedIndex + 1}`
  }

  return `
    &::after {
      content: '${content}';
      color: ${theme.color.black};
      font-size: small;
    }
  `
}

export const Th = styled.th(
  (props) => css`
    text-align: ${props.align || 'left'};
    padding: ${theme.spacing.medium};
    background: ${theme.color.white};
    vertical-align: top;
    &::after {
      content: ' \u25b2';
      color: ${theme.color.secondaryDisabledColor};
      font-size: small;
      white-space: nowrap;
    }
    ${getHeaderSortAfter(
      props.isMultiSortColumn,
      props.sortedIndex,
      props.isSortedDescending
    )}
  `,
)
export const Td = styled.td(
  (props) => css`
    text-align: ${props.align || 'left'};
    padding: ${theme.spacing.medium};
    border-width: ${theme.spacing.borderSmall};
    border-color: ${theme.color.backgroundColor};
    border-style: solid;
    &:first-child {
      border-left: none;
    }
    &:last-child {
      border-right: none;
    }
    ${mediaQueryTabletLandscapeOnly(css`
      &,
      a {
        font-size: smaller;
      }
    `)}
  `,
)
export const Tr = styled.tr`
  &:nth-child(odd) {
    background-color: ${theme.color.tableRowOdd};
  }
  &:nth-child(even) {
    background-color: ${theme.color.tableRowEven};
  }
  ${hoverState(css`
    background-color: ${theme.color.tableRowHover};
  `)}
`
