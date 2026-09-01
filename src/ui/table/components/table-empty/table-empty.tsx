'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ReactElement, ReactNode } from 'react'
import { TABLE_DISPLAY_NAMES } from '../../constants/table.constants'

export interface ITableEmptyProps {
	title?: string
	hint?: string
	icon?: ReactNode
	className?: string
	variant?: TSlotVariant
}

const DefaultEmptyIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 24 24'
			width='28'
			height='28'
			fill='none'
			aria-hidden='true'
		>
			<rect
				x='3'
				y='4'
				width='18'
				height='16'
				rx='2'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
			<path d='M3 9h18M3 14h18M9 9v11' stroke='currentColor' strokeWidth='1.5' />
		</svg>
	)
}

/**
 * Пустое состояние таблицы (не строка tbody). Класть рядом с таблицей или вместо неё.
 *
 * @example
 * ```tsx
 * <Table.Empty title="Нет рейсов" hint="Измените даты поиска" />
 * ```
 */
export const TableEmpty = ({
	title = 'Записей не найдено',
	hint = 'Попробуйте изменить фильтры или параметры поиска',
	icon,
	className,
	variant = 'default',
}: ITableEmptyProps): ReactElement => {
	return (
		<div
			data-slot='table-empty'
			data-variant={variant}
			className={cn(className)}
			role='status'
			aria-live='polite'
		>
			<div aria-hidden>{icon ?? <DefaultEmptyIcon />}</div>
			<p>{title}</p>
			<p>{hint}</p>
		</div>
	)
}

TableEmpty.displayName = TABLE_DISPLAY_NAMES.EMPTY
