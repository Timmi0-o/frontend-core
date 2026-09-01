import { createContext, useContext } from 'react'
import type { IDatePickerContextValue } from '../types/i-date-picker-context-value'

export const DatePickerContext = createContext<IDatePickerContextValue | null>(
	null,
)

export const useDatePickerContext = (): IDatePickerContextValue => {
	const context = useContext(DatePickerContext)

	if (!context) {
		throw new Error(
			'DatePicker compound components should be used inside DatePicker root',
		)
	}

	return context
}
