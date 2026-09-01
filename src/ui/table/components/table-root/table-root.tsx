'use client'

import { cn } from '@/core/cn'
import {
	forwardRef,
	type HTMLAttributes,
	type ReactElement,
	type ReactNode,
} from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'
import { TableContext } from '../../context/table-context'
import type { ITableContextValue } from '../../types/i-table-context-value'
import type { ITableVariant } from '../../types/i-table-variant'

export interface ITableRootProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode
	minWidth?: number
	variant?: ITableVariant
}

const TableRootInner = forwardRef<HTMLDivElement, ITableRootProps>(
	(
		{ children, className, minWidth, variant = 'default', ...rest },
		ref,
	): ReactElement => {
		const visualVariant = variant === 'unstyled' ? 'default' : variant
		const contextValue: ITableContextValue = {
			minWidth,
			variant: visualVariant,
		}

		return (
			<TableContext.Provider value={contextValue}>
				<div
					ref={ref}
					data-slot='table-root'
					data-variant={variant}
					className={cn(className)}
					{...rest}
				>
					{children}
				</div>
			</TableContext.Provider>
		)
	},
)

TableRootInner.displayName = TABLE_DISPLAY_NAMES.ROOT

/**
 * Корень таблицы: контекст варианта и minWidth для скролла.
 *
 * @example
 * ```tsx
 * <Table minWidth={720}>
 *   <Table.ScrollContainer>
 *     <Table.Element>...</Table.Element>
 *   </Table.ScrollContainer>
 * </Table>
 * ```
 */
export const TableRoot = TableRootInner
