'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'
import { useTableContext } from '../../context/table-context'

export interface ITableElementProps extends HTMLAttributes<HTMLTableElement> {
	children?: ReactNode
	variant?: TSlotVariant
}

export const TableElement = ({
	children,
	className,
	variant = 'default',
	style,
	...rest
}: ITableElementProps): ReactElement => {
	const { minWidth } = useTableContext()
	const tableStyle: CSSProperties = {
		...(minWidth != null ? { minWidth: `${String(minWidth)}px` } : {}),
		...style,
	}

	return (
		<table
			data-slot='table'
			data-variant={variant}
			className={cn(className)}
			style={tableStyle}
			{...rest}
		>
			{children}
		</table>
	)
}

TableElement.displayName = TABLE_DISPLAY_NAMES.ELEMENT
