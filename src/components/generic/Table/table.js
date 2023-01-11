import styled, { css } from 'styled-components/macro'
import {
  mediaQueryTabletLandscapeOnly,
  mediaQueryPhoneOnly,
  hoverState,
} from '../../../library/styling/mediaQueries'
import theme from '../../../theme'

export const TableNavigation = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 3rem 0 ${theme.spacing.xsmall} 0;
  > * {
    padding: ${theme.spacing.small} ${theme.spacing.medium};
  }
  *:nth-child(2) {
    justify-self: end;
  }
`
export const TableOverflowWrapper = styled.div`
  max-width: calc(100vw - ${theme.spacing.sideNavWidth} - 20px);
  ${mediaQueryPhoneOnly(css`
    max-width: calc(100vw - ${theme.spacing.mobileSideNavWidth} - 20px);
  `)}
  /*
  20px is the approx scrollbar width this is to prevent
  a horziontal scrollbar at the bottom of the page
  and to keep the toolbar sticky when needed.
  */
  overflow-y: auto;
  & + button,
  button + & {
    margin: ${theme.spacing.medium} 0;
  }
`

export const Table = styled('table')`
  table-layout: auto;
  background: ${theme.color.secondaryColor};
  min-width: 100%;
  border-collapse: collapse;
  font-variant: tabular-nums;
  font-feature-settings: 'tnum';
  /* 
  this is to set the height 
  of the spans in the Td
  */
  height: 1px;
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
    pointer-events: ${props.disabledHover && 'none'};
    &::after {
      content: ${props.isSortingEnabled ? ' \u25b2' : ''};
      font-size: small;
      white-space: nowrap;
    }
    > span {
      ${getHeaderSortAfter(props.isMultiSortColumn, props.sortedIndex, props.isSortedDescending)}
    }
  `,
)
Th.defaultProps = {
  isSortedDescending: false,
  isSortingEnabled: false,
  isMultiSortColumn: false,
  sortedIndex: -1,
}

export const Td = styled.td(
  (props) => css`
    text-align: ${props.align || 'left'};
    padding: ${theme.spacing.medium};
    border-width: ${theme.spacing.borderSmall};
    border-color: ${theme.color.tableBorderColor};
    border-style: solid;
    position: relative;
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

export const TdKey = styled(Td)`
  white-space: nowrap;
  font-weight: 900;
  width: 0;
`

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
export const OverviewTr = styled.tr`
  background: ${theme.color.background};
  height: 100%;
  position: relative;
  ${hoverState(css`
    &:after {
      content: '';
      position: absolute;
      background-color: hsl(0 0% 90%);
      mix-blend-mode: multiply;
      pointer-events: none;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `)}
`
export const OverviewTh = styled(Th)`
  background: ${theme.color.background};
  border-width: 0 1rem 0 0;
  border-color: transparent;
  border-style: solid;
  padding: 0;
  &:last-child {
    border-right-width: 0;
  }
  &:nth-child(1),
  &.management-regime-numbers,
  &.transect-numbers,
  &.user-headers {
    border-width: 0;
  }
  &.first-user-header {
    /*
    this class isn't in  the HTML yet
    */
    border-left-width: 1rem;
  }
  > span {
    background-color: ${theme.color.white};
    padding: ${theme.spacing.small} ${theme.spacing.medium};
    display: inline-block;
    width: 100%;
    outline: solid 1px ${theme.color.border};
  }
`
export const OverviewTd = styled(Td)`
  padding: 0;
  height: inherit;
  > span {
    background-clip: padding-box;
    background-color: ${theme.color.white};
    padding: ${theme.spacing.small} ${theme.spacing.medium};
    margin: -1px;
    height: 100%;
    border: solid 1px ${theme.color.border};
    display: block;
  }
  &.site,
  &.method {
    border: none;
  }
  &.transect-numbers > span {
    background-color: hsl(0, 0%, 95%);
  }
  &.user-headers > span {
    background-color: hsl(0, 0%, 88%);
  }
  &.management-regime-numbers > span {
    background-color: hsl(0, 0%, 95%);
  }
  &.management-regime-numbers,
  &.user-headers,
  &.transect-numbers {
    /* 
    This is used to make a gap
    between the 3 sections of the table.
    */
    /* This is the first child. */
    border-width: 0 0 0 1rem;
    border-color: transparent;
    border-style: solid;
    & ~ & {
      /* this is the rest of them */
      border-width: 0;
    }
    &.highlighted > span {
      background-color: hsl(50 80% 80% / 1);
    }
  }
`
export const HeaderCenter = styled.p`
  text-align: center;
  white-space: nowrap;
  margin: 0;
  background: white;
`

export const InlineCell = styled.span`
  min-width: 10ch;
  max-width: 26ch;
  text-align: inherit;
  display: inline-block;
  a {
    color: inherit;
  }
`

export const StickyTableOverflowWrapper = styled(TableOverflowWrapper)`
  overflow: visible;
`
const stickyStyles = css`
  position: sticky;
  white-space: nowrap;
  z-index: 3;
  top: calc(${theme.spacing.headerHeight} - 1px);
  &:before {
    /* 
    this is to account for the border-bottom
    dissapearing when scrolled.
    */
    content: '';
    position: absolute;
    height: 1px;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.color.tableBorderColor};
  }
`

export const StickyOverviewTable = styled(Table)`
  thead tr:nth-child(2) th {
    ${stickyStyles}
  }
`

export const GenericStickyTable = styled(Table)`
  tr th {
    ${stickyStyles}
  }
`

export const CopyModalToolbarWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const CopyModalPaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const SubmittedObservationStickyTable = styled(GenericStickyTable)`
  @media (min-width: 1200px) {
    position: static;
    tr th {
      top: calc(${theme.spacing.headerHeight} + 13.3rem);
    }
  }
`
