'use client'

import { useCallback, useMemo, useState } from 'react'

import type { ITimePickerProps } from '../types/i-time-picker-props'
import {
	formatTimePickerValue,
	parseTimePickerValue,
} from '../utils/time-picker.util'

export const useTimePicker = (props: ITimePickerProps) => {
	const {
		value,
		onChange,
		onBlur,
		stepMinutes = 1,
		isClearable = true,
		clearLabel = 'Очистить',
	} = props

	const [isOpen, setIsOpen] = useState(false)
	const { hour, minute } = parseTimePickerValue(value, stepMinutes)

	const displayValue = useMemo(() => value.slice(0, 5), [value])

	const emitTime = useCallback(
		(nextHour: number, nextMinute: number) => {
			onChange(formatTimePickerValue(nextHour, nextMinute))
		},
		[onChange],
	)

	const handleOpenChange = useCallback(
		(isNextOpen: boolean): void => {
			setIsOpen(isNextOpen)

			if (!isNextOpen) {
				onBlur?.()
			}
		},
		[onBlur],
	)

	const handleSelectHour = useCallback(
		(nextHour: number) => {
			emitTime(nextHour, minute)
		},
		[emitTime, minute],
	)

	const handleSelectMinute = useCallback(
		(nextMinute: number) => {
			emitTime(hour, nextMinute)
		},
		[emitTime, hour],
	)

	const handleClear = useCallback((): void => {
		onChange('')
	}, [onChange])

	return {
		value,
		hour,
		minute,
		displayValue,
		isOpen,
		isClearable,
		clearLabel,
		handleOpenChange,
		handleSelectHour,
		handleSelectMinute,
		handleClear,
	}
}
