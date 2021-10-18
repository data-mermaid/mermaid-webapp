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
  margin: 0 0 ${theme.spacing.xsmall} 0;
  > * {
    padding: ${theme.spacing.small} ${theme.spacing.medium};
  }
  *:nth-child(2) {
    justify-self: end;
  }
`
export const TableOverflowWrapper = styled.div`
  max-width: calc(100vw - ${theme.spacing.sideNavWidthDesktop});
  ${mediaQueryTabletLandscapeOnly(css`
    max-width: calc(100vw - ${theme.spacing.sideNavWidthTabletLandscapeOnly});
  `)}
  ${mediaQueryPhoneOnly(css`
    max-width: calc(100vw - ${theme.spacing.sideNavWidthPhoneOnly});
  `)}
  overflow-x: auto;
  height: 100%;
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
    border-width: ${theme.spacing.borderSmall};
    min-width: 6rem;
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
  &:focus-within {
    background-color: ${theme.color.focusWithin};
  }
`
export const InnerCell = styled.span`
  display: inline-block;
  width: max-content;
  max-width: 26ch;
`
