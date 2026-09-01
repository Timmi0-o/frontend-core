'use client'

import { cn } from '@/core/cn'
import type {
	CSSProperties,
	ReactElement,
	ReactNode,
	TdHTMLAttributes,
} from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'

export interface ITableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
	children?: ReactNode
	variant?: 'default' | 'settings' | 'unstyled'
	width?: number
	minColumnWidth?: number
}

export const TableCell = ({
	children,
	className,
	variant = 'default',
	width,
	minColumnWidth,
	style,
	...rest
}: ITableCellProps): ReactElement => {
	const columnStyle: CSSProperties = {
		...(width != null ? { width: `${String(width)}px` } : {}),
		...(minColumnWidth != null
			? { minWidth: `${String(minColumnWidth)}px` }
			: {}),
		...style,
	}

	return (
		<td
			data-slot='table-cell'
			data-variant={variant}
			className={cn(className)}
			style={columnStyle}
			{...rest}
		>
			{children}
		</td>
	)
}

TableCell.displayName = TABLE_DISPLAY_NAMES.CELL
