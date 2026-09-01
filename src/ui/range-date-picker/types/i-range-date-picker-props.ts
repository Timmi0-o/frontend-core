import type { TSlotVariant } from '@/core/slot-variant'
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react'
import type {
	TDatePickerSize,
	TDatePickerVariant,
} from '@/ui/date-picker/types/i-date-picker-props'

export interface IDateRangeValue {
	start: Date | null
	end: Date | null
}

export interface IRangeDatePickerProps {
	value?: IDateRangeValue
	onChange?: (value: IDateRangeValue) => void
	children?: ReactNode
	placeholder?: string
	isDisabled?: boolean
	size?: TDatePickerSize
	variant?: TDatePickerVariant
	className?: string
	error?: string
	label?: string
	minDate?: Date
	maxDate?: Date
	locale?: string
	previousMonth?: string
	nextMonth?: string
	extendMonthCount?: number
}

export interface IRangeDatePickerInputProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'value' | 'onChange' | 'type'
> {
	className?: string
	variant?: TDatePickerVariant
}

export interface IRangeDatePickerPopoverProps {
	className?: string
	variant?: TSlotVariant
}

export type TRangeDatePickerRootComponent = (
	props: IRangeDatePickerProps,
) => ReactElement

export type TRangeDatePickerComponent = TRangeDatePickerRootComponent & {
	Root: TRangeDatePickerRootComponent
	Input: (props: IRangeDatePickerInputProps) => ReactElement
	Popover: (props: IRangeDatePickerPopoverProps) => ReactNode
}
