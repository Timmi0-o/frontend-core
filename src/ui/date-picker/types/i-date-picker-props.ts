import type { TSlotVariant } from '@/core/slot-variant'
import type { TMobileCondition } from '@/hooks/use-mobile-condition'
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react'

export type TDatePickerSize = 'sm' | 'md' | 'lg'
export type TDatePickerVariant = 'default' | 'light' | 'unstyled'
export type TDatePickerVisualVariant = Exclude<TDatePickerVariant, 'unstyled'>
export type TDatePickerViewMode = 'days' | 'months' | 'years'

export interface IDatePickerProps {
	value?: Date | null
	onChange?: (value: Date | null) => void
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
	isMobileCondition?: TMobileCondition
}

export interface IDatePickerInputProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'value' | 'onChange' | 'type'
> {
	className?: string
	variant?: TDatePickerVariant
}

export interface IDatePickerPopoverProps {
	className?: string
	variant?: TSlotVariant
}

export type TDatePickerRootComponent = (props: IDatePickerProps) => ReactElement

export type TDatePickerComponent = TDatePickerRootComponent & {
	Root: TDatePickerRootComponent
	Input: (props: IDatePickerInputProps) => ReactElement
	Popover: (props: IDatePickerPopoverProps) => ReactNode
}
