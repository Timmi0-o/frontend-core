'use client'

import { createContext, useContext } from 'react'

import type { IDatePickerContextValue } from '../../date-picker/types/i-date-picker-context-value'

export interface IDateTimePickerContextValue extends IDatePickerContextValue {
	valueString: string
	time: string
	hour: number
	minute: number
	todayLabel: string
	clearLabel: string
	error?: string
	label?: string
	handleSelectHour: (hour: number) => void
	handleSelectMinute: (minute: number) => void
	handleClear: () => void
}

export const DateTimePickerContext =
	createContext<IDateTimePickerContextValue | null>(null)

export const useDateTimePickerContext = (): IDateTimePickerContextValue => {
	const context = useContext(DateTimePickerContext)

	if (!context) {
		throw new Error('DateTimePicker components must be used within DateTimePicker')
	}

	return context
}
