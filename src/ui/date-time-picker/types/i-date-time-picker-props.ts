import type { TMobileCondition } from '@/hooks/use-mobile-condition'
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react'

import type {
	TDatePickerSize,
	TDatePickerVariant,
} from '../../date-picker/types/i-date-picker-props'

export interface IDateTimePickerProps {
	value: string
	onChange: (value: string) => void
	onBlur?: () => void
	id?: string
	className?: string
	isDisabled?: boolean
	variant?: TDatePickerVariant
	size?: TDatePickerSize
	placeholder?: string
	label?: string
	error?: string
	minDate?: Date
	maxDate?: Date
	locale?: string
	previousMonth?: string
	nextMonth?: string
	todayLabel?: string
	clearLabel?: string
	extendMonthCount?: number
	isMobileCondition?: TMobileCondition
}

export interface IDateTimePickerInputProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'value' | 'onChange' | 'type'
> {
	className?: string
	variant?: TDatePickerVariant
}

export interface IDateTimePickerPopoverProps {
	className?: string
}

export type TDateTimePickerRootComponent = (
	props: IDateTimePickerProps,
) => ReactElement

export type TDateTimePickerComponent = TDateTimePickerRootComponent & {
	Root: TDateTimePickerRootComponent
	Input: (props: IDateTimePickerInputProps) => ReactElement
	Popover: (props: IDateTimePickerPopoverProps) => ReactNode
}
