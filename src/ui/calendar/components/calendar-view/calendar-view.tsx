'use client'

import { cn } from '@/core/cn'
import type { TDatePickerVariant, TDatePickerViewMode } from '@/ui/date-picker/types/i-date-picker-props'
import {
	addCalendarMonths,
	getCalendarWeekdayLabels,
	isWeekendDay,
	scrollElementToContainerCenter,
	type ICalendarGridDay,
} from '@/ui/date-picker/utils/date-picker-date.util'
import { useLayoutEffect, useRef, useState, type ReactElement } from 'react'

const MONTH_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
	month: 'long',
}

const MONTH_CAPTION_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
	month: 'long',
	year: 'numeric',
}

const ChevronLeftIcon = (): ReactElement => {
	return (
		<svg viewBox='0 0 16 16' width='16' height='16' fill='none' aria-hidden='true'>
			<path
				d='M10 4L6 8l4 4'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

const ChevronRightIcon = (): ReactElement => {
	return (
		<svg viewBox='0 0 16 16' width='16' height='16' fill='none' aria-hidden='true'>
			<path
				d='M6 4l4 4-4 4'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

interface ICalendarDaysPanelProps {
	month: Date
	locale: string
	weekdays: string[]
	days: ICalendarGridDay[]
	isCaptionVisible: boolean
	isHideOutsideDays: boolean
	handleSelectDate: (date: Date) => void
	isDateDisabled: (date: Date) => boolean
	isDateSelected: (date: Date) => boolean
	isDateRangeStart?: (date: Date) => boolean
	isDateRangeEnd?: (date: Date) => boolean
	isDateInRange?: (date: Date) => boolean
	onDayPointerEnter?: (date: Date) => void
	isToday: (date: Date) => boolean
}

const CalendarDaysPanel = ({
	month,
	locale,
	weekdays,
	days,
	isCaptionVisible,
	isHideOutsideDays,
	handleSelectDate,
	isDateDisabled,
	isDateSelected,
	isDateRangeStart,
	isDateRangeEnd,
	isDateInRange,
	onDayPointerEnter,
	isToday,
}: ICalendarDaysPanelProps): ReactElement => {
	const caption = new Intl.DateTimeFormat(
		locale,
		MONTH_CAPTION_FORMAT_OPTIONS,
	).format(month)

	return (
		<div data-slot='date-picker-month-panel'>
			{isCaptionVisible ? (
				<p data-slot='date-picker-month-caption'>{caption}</p>
			) : null}
			<div data-slot='date-picker-weekdays'>
				{weekdays.map((weekday) => (
					<div key={weekday} data-slot='date-picker-weekday'>
						{weekday}
					</div>
				))}
			</div>
			<div data-slot='date-picker-days'>
				{days.map((day) => {
					if (isHideOutsideDays && day.isOutsideMonth) {
						return (
							<span
								key={day.date.toISOString()}
								data-slot='date-picker-day'
								data-empty=''
								aria-hidden='true'
							/>
						)
					}

					const isDisabled = isDateDisabled(day.date)
					const isSelected = isDateSelected(day.date)
					const isRangeStart = isDateRangeStart?.(day.date) === true
					const isRangeEnd = isDateRangeEnd?.(day.date) === true
					const isInsideRange = isDateInRange?.(day.date) === true

					return (
						<button
							key={day.date.toISOString()}
							type='button'
							disabled={isDisabled}
							data-slot='date-picker-day'
							data-selected={isSelected ? '' : undefined}
							data-range-start={isRangeStart ? '' : undefined}
							data-range-end={isRangeEnd ? '' : undefined}
							data-in-range={isInsideRange ? '' : undefined}
							data-disabled={isDisabled ? '' : undefined}
							data-today={isToday(day.date) ? '' : undefined}
							data-outside={day.isOutsideMonth ? '' : undefined}
							data-weekend={isWeekendDay(day.date) ? '' : undefined}
							onClick={() => handleSelectDate(day.date)}
							onPointerEnter={() => onDayPointerEnter?.(day.date)}
						>
							{day.date.getDate()}
						</button>
					)
				})}
			</div>
		</div>
	)
}

export interface ICalendarViewProps {
	visibleMonth: Date
	visibleMonthCount?: number
	viewMode: TDatePickerViewMode
	monthLabels: string[]
	yearRange: number[]
	locale: string
	previousMonth?: string
	nextMonth?: string
	todayLabel?: string
	showTodayAction?: boolean
	isTodayDisabled?: boolean
	className?: string
	variant?: TDatePickerVariant
	handlePreviousMonth: () => void
	handleNextMonth: () => void
	handleToggleMonthPicker: () => void
	handleToggleYearPicker: () => void
	handleSelectMonth: (monthIndex: number) => void
	handleSelectYear: (year: number) => void
	handleShiftVisibleYear: (delta: number) => void
	handleSelectDate: (date: Date) => void
	handleSelectToday?: () => void
	isDateDisabled: (date: Date) => boolean
	isMonthDisabled: (monthIndex: number) => boolean
	isYearDisabled: (year: number) => boolean
	isDateSelected: (date: Date) => boolean
	isDateRangeStart?: (date: Date) => boolean
	isDateRangeEnd?: (date: Date) => boolean
	isDateInRange?: (date: Date) => boolean
	onDayPointerEnter?: (date: Date) => void
	onDayPointerLeave?: () => void
	isToday: (date: Date) => boolean
	getCalendarDays: (month: Date) => ICalendarGridDay[]
}

export const CalendarView = ({
	visibleMonth,
	visibleMonthCount = 1,
	viewMode,
	monthLabels,
	yearRange,
	locale,
	previousMonth = 'Предыдущий месяц',
	nextMonth = 'Следующий месяц',
	todayLabel = 'Сегодня',
	showTodayAction = false,
	isTodayDisabled = false,
	className,
	variant,
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
	isDateRangeStart,
	isDateRangeEnd,
	isDateInRange,
	onDayPointerEnter,
	onDayPointerLeave,
	isToday,
	getCalendarDays,
}: ICalendarViewProps): ReactElement => {
	const weekdays = getCalendarWeekdayLabels(locale)
	const monthLabel = new Intl.DateTimeFormat(locale, MONTH_FORMAT_OPTIONS).format(
		visibleMonth,
	)
	const yearLabel = visibleMonth.getFullYear()
	const currentYear = new Date().getFullYear()
	const firstYear = yearRange[0]
	const lastYear = yearRange[yearRange.length - 1]
	const yearsRef = useRef<HTMLDivElement>(null)
	const [canScrollYearsUp, setCanScrollYearsUp] = useState(false)
	const [canScrollYearsDown, setCanScrollYearsDown] = useState(false)

	const isYearView = viewMode === 'years'
	const isMonthView = viewMode === 'months'
	const monthCount = Math.max(1, Math.trunc(visibleMonthCount) || 1)
	const isMultiMonth = monthCount > 1
	const visibleMonths = Array.from({ length: monthCount }, (_, offset) =>
		addCalendarMonths(visibleMonth, offset),
	)

	useLayoutEffect(() => {
		if (!isYearView) {
			return
		}

		const container = yearsRef.current

		if (container == null) {
			return
		}

		const selectedYear =
			container.querySelector<HTMLElement>(
				'[data-slot="date-picker-year"][data-selected]',
			) ??
			container.querySelector<HTMLElement>(
				'[data-slot="date-picker-year"][data-current]',
			)

		if (selectedYear != null) {
			scrollElementToContainerCenter(container, selectedYear)
		}

		setCanScrollYearsUp(container.scrollTop > 1)
		setCanScrollYearsDown(
			container.scrollTop < container.scrollHeight - container.clientHeight - 1,
		)
	}, [isYearView, yearLabel])

	const isPrevDisabled =
		(isYearView && !canScrollYearsUp) ||
		(isMonthView && firstYear != null && yearLabel <= firstYear)
	const isNextDisabled =
		(isYearView && !canScrollYearsDown) ||
		(isMonthView && lastYear != null && yearLabel >= lastYear)

	const handleNavigatePrevious = (): void => {
		if (isYearView) {
			const container = yearsRef.current

			if (container == null) {
				return
			}

			container.scrollBy({
				top: -(container.clientHeight - 8),
				behavior: 'smooth',
			})
			return
		}

		if (isMonthView) {
			handleShiftVisibleYear(-1)
			return
		}

		handlePreviousMonth()
	}

	const handleNavigateNext = (): void => {
		if (isYearView) {
			const container = yearsRef.current

			if (container == null) {
				return
			}

			container.scrollBy({
				top: container.clientHeight - 8,
				behavior: 'smooth',
			})
			return
		}

		if (isMonthView) {
			handleShiftVisibleYear(1)
			return
		}

		handleNextMonth()
	}

	const previousLabel = isYearView
		? 'Предыдущие годы'
		: isMonthView
			? 'Предыдущий год'
			: previousMonth
	const nextLabel = isYearView
		? 'Следующие годы'
		: isMonthView
			? 'Следующий год'
			: nextMonth
	const yearToggleLabel =
		isYearView && firstYear != null && lastYear != null
			? `${String(firstYear)} – ${String(lastYear)}`
			: String(yearLabel)

	return (
		<div
			data-slot='date-picker-popover'
			data-variant={variant}
			data-view={viewMode}
			data-month-count={
				viewMode === 'days' && isMultiMonth ? String(monthCount) : undefined
			}
			className={cn(className)}
			onWheel={(event) => {
				event.stopPropagation()
			}}
		>
			<div data-slot='date-picker-nav'>
				<button
					type='button'
					data-slot='date-picker-nav-previous'
					onClick={handleNavigatePrevious}
					disabled={isPrevDisabled}
					aria-label={previousLabel}
				>
					<ChevronLeftIcon />
				</button>
				<div>
					{isYearView ? null : (
						<button
							type='button'
							data-slot='date-picker-month-toggle'
							data-open={viewMode === 'months' ? '' : undefined}
							onClick={handleToggleMonthPicker}
							aria-expanded={viewMode === 'months'}
						>
							{monthLabel}
						</button>
					)}
					<button
						type='button'
						data-slot='date-picker-year-toggle'
						data-open={isYearView ? '' : undefined}
						onClick={handleToggleYearPicker}
						aria-expanded={isYearView}
					>
						{yearToggleLabel}
					</button>
				</div>
				<button
					type='button'
					data-slot='date-picker-nav-next'
					onClick={handleNavigateNext}
					disabled={isNextDisabled}
					aria-label={nextLabel}
				>
					<ChevronRightIcon />
				</button>
			</div>

			{viewMode === 'months' ? (
				<div data-slot='date-picker-months'>
					{monthLabels.map((monthName, monthIndex) => (
						<button
							key={monthName}
							type='button'
							disabled={isMonthDisabled(monthIndex)}
							data-slot='date-picker-month'
							data-selected={
								visibleMonth.getMonth() === monthIndex ? '' : undefined
							}
							data-disabled={isMonthDisabled(monthIndex) ? '' : undefined}
							onClick={() => handleSelectMonth(monthIndex)}
						>
							{monthName}
						</button>
					))}
				</div>
			) : null}

			{isYearView ? (
				<div
					ref={yearsRef}
					data-slot='date-picker-years'
					onScroll={(event) => {
						const container = event.currentTarget

						setCanScrollYearsUp(container.scrollTop > 1)
						setCanScrollYearsDown(
							container.scrollTop <
								container.scrollHeight - container.clientHeight - 1,
						)
					}}
				>
					{yearRange.map((year) => {
						const isDisabled = isYearDisabled(year)

						return (
							<button
								key={year}
								type='button'
								disabled={isDisabled}
								data-slot='date-picker-year'
								data-selected={yearLabel === year ? '' : undefined}
								data-current={currentYear === year ? '' : undefined}
								data-disabled={isDisabled ? '' : undefined}
								onClick={() => handleSelectYear(year)}
							>
								{year}
							</button>
						)
					})}
				</div>
			) : null}

			{viewMode === 'days' ? (
				<div
					data-slot={isMultiMonth ? 'date-picker-month-panels' : undefined}
					onPointerLeave={() => onDayPointerLeave?.()}
				>
					{visibleMonths.map((month) => (
						<CalendarDaysPanel
							key={`${String(month.getFullYear())}-${String(month.getMonth())}`}
							month={month}
							locale={locale}
							weekdays={weekdays}
							days={getCalendarDays(month)}
							isCaptionVisible={isMultiMonth}
							isHideOutsideDays={isMultiMonth}
							handleSelectDate={handleSelectDate}
							isDateDisabled={isDateDisabled}
							isDateSelected={isDateSelected}
							isDateRangeStart={isDateRangeStart}
							isDateRangeEnd={isDateRangeEnd}
							isDateInRange={isDateInRange}
							onDayPointerEnter={onDayPointerEnter}
							isToday={isToday}
						/>
					))}
				</div>
			) : null}

			{showTodayAction ? (
				<button
					type='button'
					data-slot='calendar-today'
					disabled={isTodayDisabled}
					onClick={handleSelectToday}
				>
					{todayLabel}
				</button>
			) : null}
		</div>
	)
}

CalendarView.displayName = 'CalendarView'
