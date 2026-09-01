'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import { Spinner } from '@/ui/spinner/spinner'
import type { ReactElement } from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'

export interface ITableLoadingProps {
	className?: string
	label?: string
	variant?: TSlotVariant
}

export const TableLoading = ({
	className,
	label = 'Загрузка...',
	variant = 'default',
}: ITableLoadingProps): ReactElement => {
	return (
		<div
			data-slot='table-loading'
			data-variant={variant}
			className={cn(className)}
			role='status'
			aria-live='polite'
		>
			<Spinner size='md' />
			<p>{label}</p>
		</div>
	)
}

TableLoading.displayName = TABLE_DISPLAY_NAMES.LOADING
