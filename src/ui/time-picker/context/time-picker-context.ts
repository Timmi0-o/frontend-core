'use client'

import { createContext, useContext } from 'react'

import type { useTimePicker } from '../hooks/use-time-picker'

export interface ITimePickerContextValue extends ReturnType<typeof useTimePicker> {
	placeholder: string
	isDisabled: boolean
	size: 'sm' | 'md' | 'lg'
	variant: 'default' | 'light'
	error?: string
	label?: string
	isMobile: boolean
	stepMinutes: number
	isClearable: boolean
}

export const TimePickerContext = createContext<ITimePickerContextValue | null>(
	null,
)

export const useTimePickerContext = (): ITimePickerContextValue => {
	const context = useContext(TimePickerContext)

	if (context == null) {
		throw new Error('TimePicker components must be used within TimePicker')
	}

	return context
}
