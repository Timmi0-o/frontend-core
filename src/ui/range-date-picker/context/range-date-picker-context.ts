import { createContext, useContext } from 'react'
import type { IRangeDatePickerContextValue } from '../types/i-range-date-picker-context-value'

export const RangeDatePickerContext =
	createContext<IRangeDatePickerContextValue | null>(null)

export const useRangeDatePickerContext = (): IRangeDatePickerContextValue => {
	const context = useContext(RangeDatePickerContext)

	if (!context) {
		throw new Error(
			'RangeDatePicker compound components should be used inside RangeDatePicker root',
		)
	}

	return context
}
