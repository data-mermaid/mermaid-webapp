import styled, { css } from 'styled-components'
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
  overflow-y: auto;
  max-width: calc(100vw - ${theme.spacing.sideNavWidth} - 20px);

  ${mediaQueryPhoneOnly(css`
    max-width: calc(100vw - ${theme.spacing.mobileSideNavWidth} - 20px);
  `)}
  /*  20px is the approx scrollbar width this is to prevent
  a horziontal scrollbar at the bottom of the page
  and to keep the toolbar sticky when needed. */
  & + button,
  button + & {
    margin: ${theme.spacing.medium} 0;
  }
`

export const Table = styled('table')`
  border: solid 1px ${theme.color.tableBorderColor};
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
const getHeaderSortAfter = (
  isMultiSortColumn = false,
  sortedIndex = -1,
  isSortedDescending = false,
) => {
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
export const thStyles = (props) => css`
  text-align: ${props.align || 'left'};
  padding: ${theme.spacing.medium};
  background: ${theme.color.white};
  vertical-align: top;

  &::after {
    content: ${props.isSortingEnabled ? ' \u25b2' : ''};
    font-size: small;
    white-space: nowrap;
  }

  > span {
    ${getHeaderSortAfter(props.isMultiSortColumn, props.sortedIndex, props.isSortedDescending)}
  }

  font-weight: 700;
`

export const Th = styled.th((props) => thStyles(props))

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

export const TableRowTdKey = styled(Td)`
  white-space: nowrap;
  font-weight: 900;
  width: 0;
`

export const TableRowTd = styled(Td)`
  background-color: ${(props) => props.hightedBackground && 'hsl(50 80% 80% / 1)'};
  white-space: ${(props) => props.isAllowNewLines && 'pre-wrap'};
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
    &::after {
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
const gapStyles = css`
  padding: 0 3px;
  background-color: ${theme.color.background};
`

export const OverviewThead = styled('thead')`
  tr:nth-child(1) {
    th:nth-child(3),
    th:nth-child(5) {
      ${gapStyles};
    }
  }
`

export const OverviewTh = styled(Th)`
  background-color: ${theme.color.white};
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  background-clip: padding-box;
  border: solid 1px ${theme.color.tableBorderColor};

  &.first-transect-header,
  &.first-user-header {
    ${gapStyles}
  }
`
export const OverviewTd = styled(Td)`
  height: inherit;
  background-clip: padding-box;
  padding: ${theme.spacing.small} ${theme.spacing.medium};

  &.first-transect-header,
  &.first-user-header {
    ${gapStyles}
  }

  &.site,
  &.method {
    background-color: ${theme.color.white};
  }

  &.transect-numbers {
    background-color: hsl(0, 0%, 97.5%);
  }

  &.user-headers {
    background-color: hsl(0, 0%, 92.5%);
  }

  &.management-regime-numbers {
    background-color: hsl(0, 0%, 95%);
  }

  &.highlighted {
    background-color: hsl(50 80% 80% / 1);
  }

  &:hover div,
  &:focus div {
    transition: ${theme.timing.hoverTransition};
    display: block;
  }
`

export const ObservationsSummaryStats = styled(Table)`
  width: 25%;
  table-layout: auto;
  min-width: 25rem;
  max-width: 40rem;
  background: none;
  border: none;

  tr:nth-child(even),
  tr:nth-child(odd) {
    &,
    &:hover {
      background-color: ${theme.color.white};
    }

    td {
      text-align: right;
      border: none;
    }
  }

  ${mediaQueryTabletLandscapeOnly(css`
    font-size: smaller;
  `)}
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

  &::before {
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
export const GenericStickyTableTextWrapTh = styled(GenericStickyTable)`
  tr th {
    white-space: normal;
  }
`

export const CopyModalToolbarWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: end;
  ${mediaQueryPhoneOnly(css`
    flex-direction: column;
    align-items: start;
  `)}
`
export const ViewSelectedOnly = styled.label`
  padding-bottom: 0.5rem;

  input {
    margin: 0 ${theme.spacing.medium} 0 0;
    cursor: pointer;
  }
`

export const CopyModalPaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 0;
`

export const SubmittedObservationStickyTable = styled(GenericStickyTable)`
  @media (min-width: 1200px) {
    position: static;
    tr th {
      top: calc(${theme.spacing.headerHeight} + 13.3rem);
    }
  }
`
