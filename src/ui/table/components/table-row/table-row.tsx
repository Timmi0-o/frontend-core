'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import {
	forwardRef,
	type HTMLAttributes,
	type ReactElement,
	type ReactNode,
} from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'

export interface ITableRowProps extends HTMLAttributes<HTMLTableRowElement> {
	children?: ReactNode
	minWidth?: number
	variant?: TSlotVariant
}

const TableRowInner = forwardRef<HTMLTableRowElement, ITableRowProps>(
	(
		{ children, className, minWidth, variant = 'default', style, ...rest },
		ref,
	): ReactElement => {
		return (
			<tr
				ref={ref}
				data-slot='table-row'
				data-variant={variant}
				className={cn(className)}
				style={{
					...(minWidth != null ? { minWidth: `${String(minWidth)}px` } : {}),
					...style,
				}}
				{...rest}
			>
				{children}
			</tr>
		)
	},
)

TableRowInner.displayName = TABLE_DISPLAY_NAMES.ROW

export const TableRow = TableRowInner
