'use client'

import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'

import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'

export interface ITableHeaderRowProps extends HTMLAttributes<HTMLTableRowElement> {
	children?: ReactNode
	minWidth?: number
	variant?: TSlotVariant
}

export const TableHeaderRow = ({
	children,
	className,
	minWidth,
	variant = 'default',
	style,
	...rest
}: ITableHeaderRowProps): ReactElement => {
	return (
		<tr
			data-slot="table-header-row"
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
}

TableHeaderRow.displayName = TABLE_DISPLAY_NAMES.HEADER_ROW
