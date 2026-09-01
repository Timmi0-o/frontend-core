'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'

export interface ITableHeaderCellContentProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode
	sortable?: boolean
	sortDirection?: false | 'asc' | 'desc'
	variant?: TSlotVariant
}

const TableSortIcon = ({
	direction,
}: {
	direction: false | 'asc' | 'desc'
}): ReactElement => {
	return (
		<svg
			data-slot='table-sort-icon'
			data-direction={direction === false ? undefined : direction}
			viewBox='0 0 16 16'
			width='16'
			height='16'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M8 3.5L11.5 8h-7L8 3.5zM8 12.5L4.5 8h7L8 12.5z'
				fill='currentColor'
			/>
		</svg>
	)
}

export const TableHeaderCellContent = ({
	children,
	className,
	sortable = false,
	sortDirection = false,
	variant = 'default',
	onClick,
	...rest
}: ITableHeaderCellContentProps): ReactElement => {
	return (
		<div
			data-slot='table-header-cell-content'
			data-variant={variant}
			data-sortable={sortable ? '' : undefined}
			className={cn(className)}
			onClick={onClick}
			{...rest}
		>
			{children}
			{sortable ? <TableSortIcon direction={sortDirection} /> : null}
		</div>
	)
}

TableHeaderCellContent.displayName = TABLE_DISPLAY_NAMES.HEADER_CELL_CONTENT
