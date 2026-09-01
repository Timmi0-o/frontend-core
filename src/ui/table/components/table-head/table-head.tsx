'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'

export interface ITableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
	children?: ReactNode
	minWidth?: number
	variant?: TSlotVariant
}

export const TableHead = ({
	children,
	className,
	minWidth,
	variant = 'default',
	style,
	...rest
}: ITableHeadProps): ReactElement => {
	return (
		<thead
			data-slot='table-head'
			data-variant={variant}
			className={cn(className)}
			style={{
				...(minWidth != null ? { minWidth: `${String(minWidth)}px` } : {}),
				...style,
			}}
			{...rest}
		>
			{children}
		</thead>
	)
}

TableHead.displayName = TABLE_DISPLAY_NAMES.HEAD
