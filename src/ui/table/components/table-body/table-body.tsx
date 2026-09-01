'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'

export interface ITableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
	children?: ReactNode
	minWidth?: number
	withFadeIn?: boolean
	variant?: TSlotVariant
}

export const TableBody = ({
	children,
	className,
	minWidth,
	withFadeIn = true,
	variant = 'default',
	style,
	...rest
}: ITableBodyProps): ReactElement => {
	return (
		<tbody
			data-slot='table-body'
			data-variant={variant}
			data-fade-in={withFadeIn ? '' : undefined}
			className={cn(className)}
			style={{
				...(minWidth != null ? { minWidth: `${String(minWidth)}px` } : {}),
				...style,
			}}
			{...rest}
		>
			{children}
		</tbody>
	)
}

TableBody.displayName = TABLE_DISPLAY_NAMES.BODY
