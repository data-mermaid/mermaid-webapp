/**
 * table.d.ts
 *
 * A lightweight TypeScript declaration file for the JS `table.js` styled-components module.
 *
 * Purpose:
 * - Tell TypeScript about the styled exports (e.g. `Th`, `Td`, `Table`, `Tr`, etc.) and
 *   the transient ($-prefixed) props they accept so TSX files can pass `$align`,
 *   `$sortedIndex`, etc. without type errors.
 *
 * Notes and recommendations:
 * - This is a workaround for compatiblity. The preferred, more robust approach is to convert
 *   `table.js` into a TypeScript module (e.g. `table.tsx`) and add explicit
 *   styled-component generics (e.g. `styled.th<ThProps>`) so the props are typed at their
 *   definition site.
 * - Converting the implementation to TS gives better type-safety (and avoids having to
 *   maintain parallel `.d.ts` files).
 */
import * as React from 'react'

export type Align = 'left' | 'right' | 'center'

export interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  $align?: Align
  $sortedIndex?: number
  $isSortedDescending?: boolean
  $isMultiSortColumn?: boolean
  $isSortingEnabled?: boolean
  $disabledHover?: boolean
}

export const Th: React.ComponentType<ThProps>

export interface TdProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  $align?: Align
  $isAllowNewLines?: boolean
  $disabledHover?: boolean
  $sortedIndex?: number
}

export const Td: React.ComponentType<TdProps>
export const Table: React.ComponentType<React.TableHTMLAttributes<HTMLTableElement>>
export const TableOverflowWrapper: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>
export const TableRowTd: React.ComponentType<TdProps>
export const TableRowTdKey: React.ComponentType<TdProps>
export const Tr: React.ComponentType<React.HTMLAttributes<HTMLTableRowElement>>
export const OverviewTh: React.ComponentType<ThProps>
export const OverviewTd: React.ComponentType<TdProps>
export const ObservationsSummaryStats: React.ComponentType<
  React.TableHTMLAttributes<HTMLTableElement>
>
export const thStyles: (props: ThProps) => ReturnType<typeof import('styled-components').css>
export const ThClassName: string

export default Table
