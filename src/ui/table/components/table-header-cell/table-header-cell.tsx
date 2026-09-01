'use client'

import { cn } from '@/core/cn'
import type {
	CSSProperties,
	ReactElement,
	ReactNode,
	ThHTMLAttributes,
} from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'

export interface ITableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
	children?: ReactNode
	variant?: 'default' | 'settings' | 'unstyled'
	width?: number
	minColumnWidth?: number
}

export const TableHeaderCell = ({
	children,
	className,
	variant = 'default',
	width,
	minColumnWidth,
	style,
	...rest
}: ITableHeaderCellProps): ReactElement => {
	const columnStyle: CSSProperties = {
		...(width != null ? { width: `${String(width)}px` } : {}),
		...(minColumnWidth != null
			? { minWidth: `${String(minColumnWidth)}px` }
			: {}),
		...style,
	}

	return (
		<th
			data-slot='table-header-cell'
			data-variant={variant}
			className={cn(className)}
			style={columnStyle}
			{...rest}
		>
			{children}
		</th>
	)
}

TableHeaderCell.displayName = TABLE_DISPLAY_NAMES.HEADER_CELL
