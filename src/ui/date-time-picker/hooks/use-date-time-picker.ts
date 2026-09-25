'use client'

import { useCallback, useMemo } from 'react'

import { useDatePicker } from '../../date-picker/hooks/use-date-picker'
import type { IDateTimePickerProps } from '../types/i-date-time-picker-props'
import {
	composeLocalDateTime,
	formatDateTimePickerValue,
	getCurrentLocalDateTime,
	splitLocalDateTime,
} from '../utils/date-time-picker.util'

export const useDateTimePicker = (props: IDateTimePickerProps) => {
	const {
		value,
		onChange,
		locale = 'ru',
		todayLabel = 'Сегодня',
		clearLabel = 'Удалить',
	} = props

	const { date, time } = splitLocalDateTime(value)
	const [hourValue = '9', minuteValue = '0'] = time.split(':')
	const hour = Number(hourValue)
	const minute = Number(minuteValue)

	const emitDateTime = useCallback(
		(nextDate: Date, nextTime: string) => {
			onChange(composeLocalDateTime(nextDate, nextTime))
		},
		[onChange],
	)

	const datePicker = useDatePicker({
		value: date,
		onChange: (nextDate) => {
			if (!nextDate) {
				return
			}

			emitDateTime(nextDate, time)
		},
		minDate: props.minDate,
		maxDate: props.maxDate,
		locale,
		previousMonth: props.previousMonth,
		nextMonth: props.nextMonth,
		extendMonthCount: props.extendMonthCount,
		isDisabled: props.isDisabled,
		isMobileCondition: props.isMobileCondition,
		closeOnSelect: false,
	})

	const displayValue = useMemo(
		() => formatDateTimePickerValue(value, locale),
		[locale, value],
	)

	const handleSelectHour = useCallback(
		(nextHour: number) => {
			const baseDate = date ?? new Date()
			emitDateTime(
				baseDate,
				`${String(nextHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
			)
		},
		[date, emitDateTime, minute],
	)

	const handleSelectMinute = useCallback(
		(nextMinute: number) => {
			const baseDate = date ?? new Date()
			emitDateTime(
				baseDate,
				`${String(hour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`,
			)
		},
		[date, emitDateTime, hour],
	)

	const handleSelectToday = useCallback((): void => {
		onChange(getCurrentLocalDateTime())
		datePicker.handleOpenChange(false)
	}, [datePicker, onChange])

	const handleClear = useCallback((): void => {
		onChange('')
		datePicker.handleOpenChange(false)
	}, [datePicker, onChange])

	return {
		...datePicker,
		valueString: value,
		time,
		hour,
		minute,
		displayValue,
		todayLabel,
		clearLabel,
		handleSelectHour,
		handleSelectMinute,
		handleClear,
		handleSelectToday,
	}
}
