import type { TMobileCondition } from '@/hooks/use-mobile-condition'
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react'

export interface ITimePickerProps {
	value: string
	onChange: (value: string) => void
	onBlur?: () => void
	id?: string
	className?: string
	placeholder?: string
	isDisabled?: boolean
	stepMinutes?: number
	size?: 'sm' | 'md' | 'lg'
	variant?: 'default' | 'light' | 'unstyled'
	label?: string
	error?: string
	isClearable?: boolean
	clearLabel?: string
	isMobileCondition?: TMobileCondition
}

export interface ITimePickerInputProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange' | 'type'> {
	className?: string
	variant?: 'default' | 'light' | 'unstyled'
}

export interface ITimePickerPopoverProps {
	className?: string
}

export type TTimePickerRootComponent = (
	props: ITimePickerProps,
) => ReactElement

export type TTimePickerComponent = TTimePickerRootComponent & {
	Root: TTimePickerRootComponent
	Input: (props: ITimePickerInputProps) => ReactElement
	Popover: (props: ITimePickerPopoverProps) => ReactNode
}
