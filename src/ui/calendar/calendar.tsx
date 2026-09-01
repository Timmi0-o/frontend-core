'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import { useMemo, type ReactElement } from 'react'
import { CalendarView } from './components/calendar-view/calendar-view'
import { useDatePicker } from '../date-picker/hooks/use-date-picker'
import { startOfDay } from '../date-picker/utils/date-picker-date.util'

export interface ICalendarProps {
	value?: Date | null
	onChange?: (value: Date | null) => void
	className?: string
	variant?: TSlotVariant
	minDate?: Date
	maxDate?: Date
	locale?: string
	extendMonthCount?: number
}

/**
 * Календарь без инпута: выбор одной даты. Для поля с попапом — `DatePicker`.
 *
 * @example
 * ```tsx
 * <Calendar
 *   value={date}
 *   onChange={setDate}
 *   minDate={new Date()}
 *   extendMonthCount={1}
 *   locale="ru-RU"
 * />
 * ```
 */
export const Calendar = ({
	className,
	variant = 'default',
	...props
}: ICalendarProps): ReactElement => {
	const {
		visibleMonth,
		visibleMonthCount,
		monthLabels,
		yearRange,
		locale,
		viewMode,
		handlePreviousMonth,
		handleNextMonth,
		handleToggleMonthPicker,
		handleToggleYearPicker,
		handleSelectMonth,
		handleSelectYear,
		handleShiftVisibleYear,
		handleSelectDate,
		handleSelectToday,
		isDateDisabled,
		isMonthDisabled,
		isYearDisabled,
		isDateSelected,
		isToday,
		getCalendarDays,
	} = useDatePicker(props)

	const headlineDate = useMemo(
		() => props.value ?? startOfDay(new Date()),
		[props.value],
	)
	const headlineWeekday = useMemo(
		() =>
			new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(
				headlineDate,
			),
		[headlineDate, locale],
	)
	const headlineMonth = useMemo(
		() =>
			new Intl.DateTimeFormat(locale, {
				month: 'long',
				year: 'numeric',
			}).format(headlineDate),
		[headlineDate, locale],
	)

	return (
		<div data-slot='calendar' data-variant={variant} className={cn(className)}>
			<div data-slot='calendar-headline'>
				<p data-slot='calendar-headline-weekday'>{headlineWeekday}</p>
				<p data-slot='calendar-headline-day'>{headlineDate.getDate()}</p>
				<p data-slot='calendar-headline-month'>{headlineMonth}</p>
			</div>
			<CalendarView
				visibleMonth={visibleMonth}
				visibleMonthCount={visibleMonthCount}
				viewMode={viewMode}
				monthLabels={monthLabels}
				yearRange={yearRange}
				locale={locale}
				showTodayAction
				isTodayDisabled={isDateDisabled(startOfDay(new Date()))}
				handlePreviousMonth={handlePreviousMonth}
				handleNextMonth={handleNextMonth}
				handleToggleMonthPicker={handleToggleMonthPicker}
				handleToggleYearPicker={handleToggleYearPicker}
				handleSelectMonth={handleSelectMonth}
				handleSelectYear={handleSelectYear}
				handleShiftVisibleYear={handleShiftVisibleYear}
				handleSelectDate={handleSelectDate}
				handleSelectToday={handleSelectToday}
				isDateDisabled={isDateDisabled}
				isMonthDisabled={isMonthDisabled}
				isYearDisabled={isYearDisabled}
				isDateSelected={isDateSelected}
				isToday={isToday}
				getCalendarDays={getCalendarDays}
			/>
		</div>
	)
}

Calendar.displayName = 'Calendar'
