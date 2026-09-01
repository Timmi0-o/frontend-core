'use client'

import { cn } from '@/core/cn'
import type { ReactElement } from 'react'
import { DatePicker } from '../date-picker/date-picker'
import { TimePicker } from '../time-picker/time-picker'

/**
 * Разбирает локальную дату-время (YYYY-MM-DDTHH:mm) в части для отдельных контролов.
 * Нужен DateTimePicker, чтобы синхронизировать DatePicker и TimePicker.
 */
const splitLocalDateTime = (
	value: string,
): { date: Date | null; time: string } => {
	if (!value) {
		return { date: null, time: '09:00' }
	}

	const [datePart = '', timePart = '09:00'] = value.split('T')

	if (!datePart) {
		return { date: null, time: timePart }
	}

	return { date: new Date(`${datePart}T00:00:00`), time: timePart }
}

/**
 * Склеивает дату и время в локальный формат YYYY-MM-DDTHH:mm.
 * Вызывать после изменения одной из частей DateTimePicker.
 */
const composeLocalDateTime = (date: Date, time: string): string => {
	const yyyy = String(date.getFullYear())
	const mm = String(date.getMonth() + 1).padStart(2, '0')
	const dd = String(date.getDate()).padStart(2, '0')
	return `${yyyy}-${mm}-${dd}T${time}`
}

export interface IDateTimePickerProps {
	value: string
	onChange: (value: string) => void
	onBlur?: () => void
	id?: string
	className?: string
	dateId?: string
	timeId?: string
	isDisabled?: boolean
	variant?: 'default' | 'light' | 'unstyled'
	extendMonthCount?: number
}

/**
 * Дата + время в одном значении `YYYY-MM-DDTHH:mm` (локально, без зоны).
 *
 * @example
 * ```tsx
 * <DateTimePicker value={dateTime} onChange={setDateTime} />
 * ```
 */
export const DateTimePicker = ({
	value,
	onChange,
	onBlur,
	className,
	dateId,
	timeId,
	isDisabled = false,
	variant = 'default',
	extendMonthCount,
}: IDateTimePickerProps): ReactElement => {
	const { date, time } = splitLocalDateTime(value)
	const visualVariant = variant === 'unstyled' ? 'default' : variant

	return (
		<div
			data-slot='date-time-picker'
			data-variant={variant}
			className={cn('date-time-picker-grid', className)}
			onBlur={onBlur}
		>
			<DatePicker
				value={date}
				onChange={(nextDate) => {
					if (!nextDate) {
						onChange('')
						return
					}
					onChange(composeLocalDateTime(nextDate, time))
				}}
				isDisabled={isDisabled}
				variant={visualVariant}
				className={dateId}
				extendMonthCount={extendMonthCount}
			/>
			<TimePicker
				value={time}
				onChange={(nextTime) => {
					const baseDate = date ?? new Date()
					onChange(composeLocalDateTime(baseDate, nextTime))
				}}
				isDisabled={isDisabled}
				variant={visualVariant}
				className={timeId}
			/>
		</div>
	)
}

DateTimePicker.displayName = 'DateTimePicker'
