'use client'

import { useCallback, useMemo, useState } from 'react'
import type {
	IDatePickerProps,
	TDatePickerViewMode,
} from '../types/i-date-picker-props'
import {
	formatDatePickerValue,
	getCalendarDays,
	getDatePickerMonthLabels,
	getDatePickerYearRange,
	isAfterDay,
	isBeforeDay,
	isDateInVisibleMonths,
	isMonthDisabled,
	isSameDay,
	isYearDisabled,
	startOfDay,
} from '../utils/date-picker-date.util'
import { resolveVisibleMonthCount } from '../utils/resolve-visible-month-count'

export const useDatePicker = (props: IDatePickerProps) => {
	const {
		value,
		onChange,
		minDate,
		maxDate,
		locale = 'ru',
		extendMonthCount,
	} = props
	const isDisabled = props.isDisabled === true
	const visibleMonthCount = resolveVisibleMonthCount(extendMonthCount)

	const [isOpen, setIsOpen] = useState(false)
	const [viewMode, setViewMode] = useState<TDatePickerViewMode>('days')
	const [visibleMonth, setVisibleMonth] = useState(() =>
		startOfDay(value ?? new Date()),
	)

	const displayValue = useMemo(
		() => formatDatePickerValue(value, locale),
		[locale, value],
	)

	const monthLabels = useMemo(
		() => getDatePickerMonthLabels(locale),
		[locale],
	)

	const yearRange = useMemo(
		() => getDatePickerYearRange(minDate, maxDate),
		[maxDate, minDate],
	)

	const handleOpenChange = useCallback((isPopoverOpen: boolean): void => {
		setIsOpen(isPopoverOpen)

		if (!isPopoverOpen) {
			setViewMode('days')
			return
		}

		setVisibleMonth(startOfDay(value ?? new Date()))
		setViewMode('days')
	}, [value])

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

			onChange?.(nextDay)
			setVisibleMonth((current) =>
				isDateInVisibleMonths(nextDay, current, visibleMonthCount)
					? current
					: nextDay,
			)
			setIsOpen(false)
		},
		[isDateDisabled, onChange, visibleMonthCount],
	)

	const handleSelectToday = useCallback((): void => {
		const today = startOfDay(new Date())

		setVisibleMonth(today)
		setViewMode('days')

		if (isDateDisabled(today)) {
			return
		}

		onChange?.(today)
		setIsOpen(false)
	}, [isDateDisabled, onChange])

	const isDateSelected = useCallback(
		(date: Date): boolean => Boolean(value && isSameDay(date, value)),
		[value],
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
		isDateDisabled,
		isMonthDisabled: isMonthDisabledByRange,
		isYearDisabled: isYearDisabledByRange,
		isDateSelected,
		isToday,
		getCalendarDays: getVisibleCalendarDays,
	}
}
