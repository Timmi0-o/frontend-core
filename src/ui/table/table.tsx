'use client'

import { TableBody } from './components/table-body/table-body'
import { TableCell } from './components/table-cell/table-cell'
import { TableElement } from './components/table-element/table-element'
import { TableEmpty } from './components/table-empty/table-empty'
import { TableHead } from './components/table-head/table-head'
import { TableHeaderCell } from './components/table-header-cell/table-header-cell'
import { TableHeaderCellContent } from './components/table-header-cell-content/table-header-cell-content'
import { TableHeaderRow } from './components/table-header-row/table-header-row'
import { TableLoading } from './components/table-loading/table-loading'
import { TableRoot } from './components/table-root/table-root'
import { TableRow } from './components/table-row/table-row'
import { TableScrollContainer } from './components/table-scroll-container/table-scroll-container'

export { TableBody, TableCell, TableElement, TableEmpty, TableHead }
export { TableHeaderCell, TableHeaderCellContent, TableHeaderRow }
export { TableLoading, TableRoot, TableRow, TableScrollContainer }

export type { ITableBodyProps } from './components/table-body/table-body'
export type { ITableCellProps } from './components/table-cell/table-cell'
export type { ITableElementProps } from './components/table-element/table-element'
export type { ITableEmptyProps } from './components/table-empty/table-empty'
export type { ITableHeadProps } from './components/table-head/table-head'
export type { ITableHeaderCellProps } from './components/table-header-cell/table-header-cell'
export type { ITableHeaderCellContentProps } from './components/table-header-cell-content/table-header-cell-content'
export type { ITableHeaderRowProps } from './components/table-header-row/table-header-row'
export type { ITableLoadingProps } from './components/table-loading/table-loading'
export type { ITableRootProps } from './components/table-root/table-root'
export type { ITableRowProps } from './components/table-row/table-row'
export type { ITableScrollContainerProps } from './components/table-scroll-container/table-scroll-container'
export type { ITableVariant } from './types/i-table-variant'

type TTableComponent = typeof TableRoot & {
	ScrollContainer: typeof TableScrollContainer
	Element: typeof TableElement
	Head: typeof TableHead
	Body: typeof TableBody
	HeaderRow: typeof TableHeaderRow
	Row: typeof TableRow
	HeaderCell: typeof TableHeaderCell
	Cell: typeof TableCell
	HeaderCellContent: typeof TableHeaderCellContent
	Loading: typeof TableLoading
	Empty: typeof TableEmpty
}

/**
 * Таблица: ScrollContainer → Element → Head/Body → Row/Cell.
 *
 * @example
 * ```tsx
 * <Table>
 *   <Table.ScrollContainer>
 *     <Table.Element>
 *       <Table.Head>
 *         <Table.HeaderRow>
 *           <Table.HeaderCell>Поезд</Table.HeaderCell>
 *           <Table.HeaderCell>Время</Table.HeaderCell>
 *         </Table.HeaderRow>
 *       </Table.Head>
 *       <Table.Body>
 *         <Table.Row>
 *           <Table.Cell>001А</Table.Cell>
 *           <Table.Cell>21:00</Table.Cell>
 *         </Table.Row>
 *       </Table.Body>
 *     </Table.Element>
 *   </Table.ScrollContainer>
 *   <Table.Empty title="Нет рейсов" />
 * </Table>
 * ```
 */
export const Table: TTableComponent = Object.assign(TableRoot, {
	ScrollContainer: TableScrollContainer,
	Element: TableElement,
	Head: TableHead,
	Body: TableBody,
	HeaderRow: TableHeaderRow,
	Row: TableRow,
	HeaderCell: TableHeaderCell,
	Cell: TableCell,
	HeaderCellContent: TableHeaderCellContent,
	Loading: TableLoading,
	Empty: TableEmpty,
})
