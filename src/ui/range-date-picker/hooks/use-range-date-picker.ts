'use client'

import { useCallback, useMemo, useState } from 'react'
import type { TDatePickerViewMode } from '@/ui/date-picker/types/i-date-picker-props'
import {
	formatDateRangeValue,
	getCalendarDays,
	getDatePickerMonthLabels,
	getDatePickerYearRange,
	isAfterDay,
	isBeforeDay,
	isDateInsideRange,
	isDateInVisibleMonths,
	isMonthDisabled,
	isSameDay,
	isYearDisabled,
	orderDateRange,
	startOfDay,
} from '@/ui/date-picker/utils/date-picker-date.util'
import type { IDateRangeValue, IRangeDatePickerProps } from '../types/i-range-date-picker-props'
import { resolveVisibleMonthCount } from '@/ui/date-picker/utils/resolve-visible-month-count'

const EMPTY_RANGE: IDateRangeValue = { start: null, end: null }

export const useRangeDatePicker = (props: IRangeDatePickerProps) => {
	const {
		value = EMPTY_RANGE,
		onChange,
		minDate,
		maxDate,
		locale = 'ru',
		extendMonthCount,
	} = props
	const isDisabled = props.isDisabled === true
	const visibleMonthCount = resolveVisibleMonthCount(extendMonthCount)
	const rangeStart = value.start
	const rangeEnd = value.end

	const [isOpen, setIsOpen] = useState(false)
	const [viewMode, setViewMode] = useState<TDatePickerViewMode>('days')
	const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
	const [visibleMonth, setVisibleMonth] = useState(() =>
		startOfDay(rangeStart ?? rangeEnd ?? new Date()),
	)

	const displayValue = useMemo(
		() => formatDateRangeValue(rangeStart, rangeEnd, locale),
		[locale, rangeEnd, rangeStart],
	)

	const monthLabels = useMemo(
		() => getDatePickerMonthLabels(locale),
		[locale],
	)

	const yearRange = useMemo(
		() => getDatePickerYearRange(minDate, maxDate),
		[maxDate, minDate],
	)

	const previewEnd = rangeEnd ?? hoveredDate

	const handleOpenChange = useCallback((isPopoverOpen: boolean): void => {
		setIsOpen(isPopoverOpen)
		setHoveredDate(null)

		if (!isPopoverOpen) {
			setViewMode('days')
			return
		}

		setVisibleMonth(startOfDay(rangeStart ?? rangeEnd ?? new Date()))
		setViewMode('days')
	}, [rangeEnd, rangeStart])

	const handlePreviousMonth = useCallback((): void => {
		setVisibleMonth(
			(current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
		)
	}, [])

	const handleNextMonth = useCallback((): void => {
		setVisibleMonth(
			(current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
		)
	}, [])

	const handleToggleMonthPicker = useCallback((): void => {
		setViewMode((currentViewMode) =>
			currentViewMode === 'months' ? 'days' : 'months',
		)
	}, [])

	const handleToggleYearPicker = useCallback((): void => {
		setViewMode((currentViewMode) =>
			currentViewMode === 'years' ? 'days' : 'years',
		)
	}, [])

	const handleSelectMonth = useCallback((monthIndex: number): void => {
		setVisibleMonth((current) => new Date(current.getFullYear(), monthIndex, 1))
		setViewMode('days')
	}, [])

	const handleSelectYear = useCallback((year: number): void => {
		setVisibleMonth((current) => new Date(year, current.getMonth(), 1))
		setViewMode('days')
	}, [])

	const handleShiftVisibleYear = useCallback((delta: number): void => {
		setVisibleMonth((current) => {
			const nextYear = current.getFullYear() + delta
			const firstYear = yearRange[0]
			const lastYear = yearRange[yearRange.length - 1]

			if (firstYear != null && nextYear < firstYear) {
				return current
			}

			if (lastYear != null && nextYear > lastYear) {
				return current
			}

			return new Date(nextYear, current.getMonth(), 1)
		})
	}, [yearRange])

	const isMonthDisabledByRange = useCallback(
		(monthIndex: number): boolean =>
			isMonthDisabled(visibleMonth.getFullYear(), monthIndex, minDate, maxDate),
		[maxDate, minDate, visibleMonth],
	)

	const isYearDisabledByRange = useCallback(
		(year: number): boolean => isYearDisabled(year, minDate, maxDate),
		[maxDate, minDate],
	)

	const isDateDisabled = useCallback(
		(date: Date): boolean => {
			if (minDate && isBeforeDay(date, minDate)) {
				return true
			}

			if (maxDate && isAfterDay(date, maxDate)) {
				return true
			}

			return false
		},
		[maxDate, minDate],
	)

	const handleSelectDate = useCallback(
		(date: Date): void => {
			if (isDateDisabled(date)) {
				return
			}

			const nextDay = startOfDay(date)

			if (!rangeStart || rangeEnd) {
				onChange?.({ start: nextDay, end: null })
				setVisibleMonth((current) =>
					isDateInVisibleMonths(nextDay, current, visibleMonthCount)
						? current
						: nextDay,
				)
				setHoveredDate(null)
				return
			}

			const nextRange = orderDateRange(rangeStart, nextDay)

			onChange?.(nextRange)
			setVisibleMonth((current) =>
				isDateInVisibleMonths(nextRange.end, current, visibleMonthCount)
					? current
					: nextRange.end,
			)
			setHoveredDate(null)
			setIsOpen(false)
		},
		[isDateDisabled, onChange, rangeEnd, rangeStart, visibleMonthCount],
	)

	const handleSelectToday = useCallback((): void => {
		const today = startOfDay(new Date())

		setVisibleMonth(today)
		setViewMode('days')
		setHoveredDate(null)

		if (isDateDisabled(today)) {
			return
		}

		onChange?.({ start: today, end: today })
		setIsOpen(false)
	}, [isDateDisabled, onChange])

	const handleDayPointerEnter = useCallback((date: Date): void => {
		if (isDateDisabled(date) || rangeEnd || !rangeStart) {
			return
		}

		setHoveredDate(startOfDay(date))
	}, [isDateDisabled, rangeEnd, rangeStart])

	const handleDayPointerLeave = useCallback((): void => {
		setHoveredDate(null)
	}, [])

	const previewRange = useMemo(() => {
		if (!rangeStart || !previewEnd) {
			return null
		}

		return orderDateRange(rangeStart, previewEnd)
	}, [previewEnd, rangeStart])

	const isDateSelected = useCallback(
		(date: Date): boolean =>
			Boolean(
				(rangeStart && isSameDay(date, rangeStart)) ||
					(rangeEnd && isSameDay(date, rangeEnd)),
			),
		[rangeEnd, rangeStart],
	)

	const isDateRangeStart = useCallback(
		(date: Date): boolean =>
			Boolean(previewRange && isSameDay(date, previewRange.start)),
		[previewRange],
	)

	const isDateRangeEnd = useCallback(
		(date: Date): boolean =>
			Boolean(previewRange && isSameDay(date, previewRange.end)),
		[previewRange],
	)

	const isDateInRange = useCallback(
		(date: Date): boolean => {
			if (!previewRange) {
				return false
			}

			return isDateInsideRange(date, previewRange.start, previewRange.end)
		},
		[previewRange],
	)

	const isToday = useCallback((date: Date): boolean => {
		return isSameDay(date, new Date())
	}, [])

	const getVisibleCalendarDays = useCallback(
		(month: Date) => getCalendarDays(month),
		[],
	)

	return {
		isOpen,
		isDisabled,
		displayValue,
		visibleMonth,
		visibleMonthCount,
		viewMode,
		monthLabels,
		yearRange,
		locale,
		handleOpenChange,
		handlePreviousMonth,
		handleNextMonth,
		handleToggleMonthPicker,
		handleToggleYearPicker,
		handleSelectMonth,
		handleSelectYear,
		handleShiftVisibleYear,
		handleSelectDate,
		handleSelectToday,
		handleDayPointerEnter,
		handleDayPointerLeave,
		isDateDisabled,
		isMonthDisabled: isMonthDisabledByRange,
		isYearDisabled: isYearDisabledByRange,
		isDateSelected,
		isDateRangeStart,
		isDateRangeEnd,
		isDateInRange,
		isToday,
		getCalendarDays: getVisibleCalendarDays,
	}
}
