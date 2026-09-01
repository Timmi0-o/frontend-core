import type {
	TDatePickerSize,
	TDatePickerVisualVariant,
	TDatePickerViewMode,
} from './i-date-picker-props'
import type { ICalendarGridDay } from '../utils/date-picker-date.util'

export interface IDatePickerContextValue {
	value: Date | null | undefined
	displayValue: string
	placeholder: string
	isOpen: boolean
	isDisabled: boolean
	isMobile: boolean
	visibleMonth: Date
	visibleMonthCount: number
	viewMode: TDatePickerViewMode
	monthLabels: string[]
	yearRange: number[]
	size: TDatePickerSize
	variant: TDatePickerVisualVariant
	locale: string
	previousMonth: string
	nextMonth: string
	minDate?: Date
	maxDate?: Date
	handlePreviousMonth: () => void
	handleNextMonth: () => void
	handleToggleMonthPicker: () => void
	handleToggleYearPicker: () => void
	handleSelectMonth: (monthIndex: number) => void
	handleSelectYear: (year: number) => void
	handleShiftVisibleYear: (delta: number) => void
	handleSelectDate: (date: Date) => void
	handleSelectToday: () => void
	handleOpenChange: (isOpen: boolean) => void
	isDateDisabled: (date: Date) => boolean
	isMonthDisabled: (monthIndex: number) => boolean
	isYearDisabled: (year: number) => boolean
	isDateSelected: (date: Date) => boolean
	isToday: (date: Date) => boolean
	getCalendarDays: (month: Date) => ICalendarGridDay[]
}
