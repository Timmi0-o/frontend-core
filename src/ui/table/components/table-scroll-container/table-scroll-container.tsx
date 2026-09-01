'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'

export interface ITableScrollContainerProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode
	variant?: TSlotVariant
}

export const TableScrollContainer = ({
	children,
	className,
	variant = 'default',
	...rest
}: ITableScrollContainerProps): ReactElement => {
	return (
		<div
			data-slot='table-scroll'
			data-variant={variant}
			className={cn(className)}
			{...rest}
		>
			{children}
		</div>
	)
}

TableScrollContainer.displayName = TABLE_DISPLAY_NAMES.SCROLL_CONTAINER
