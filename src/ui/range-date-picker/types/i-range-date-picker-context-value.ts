import type { ICalendarGridDay } from '@/ui/date-picker/utils/date-picker-date.util'
import type {
	TDatePickerSize,
	TDatePickerVisualVariant,
	TDatePickerViewMode,
} from '@/ui/date-picker/types/i-date-picker-props'
import type { IDateRangeValue } from './i-range-date-picker-props'

export interface IRangeDatePickerContextValue {
	value: IDateRangeValue
	displayValue: string
	placeholder: string
	isOpen: boolean
	isDisabled: boolean
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
	handleDayPointerEnter: (date: Date) => void
	handleDayPointerLeave: () => void
	isDateDisabled: (date: Date) => boolean
	isMonthDisabled: (monthIndex: number) => boolean
	isYearDisabled: (year: number) => boolean
	isDateSelected: (date: Date) => boolean
	isDateRangeStart: (date: Date) => boolean
	isDateRangeEnd: (date: Date) => boolean
	isDateInRange: (date: Date) => boolean
	isToday: (date: Date) => boolean
	getCalendarDays: (month: Date) => ICalendarGridDay[]
}
