import type { TSlotVariant } from '@/core/slot-variant'
import type { InputHTMLAttributes, ReactElement, ReactNode } from 'react'

export type TAutocompleteSize = 'sm' | 'md' | 'lg'
export type TAutocompleteVariant = 'default' | 'light' | 'unstyled'
export type TAutocompleteVisualVariant = Exclude<TAutocompleteVariant, 'unstyled'>

export interface IAutocompleteOption<T extends string | number = string> {
	label: string
	value: T
	disabled?: boolean
}

export interface IAutocompleteProps<T extends string | number = string> {
	options: Array<IAutocompleteOption<T>>
	value?: T | null
	onChange?: (value: T | null) => void
	onInputValueChange?: (value: string) => void
	inputValue?: string
	children?: ReactNode
	placeholder?: string
	isDisabled?: boolean
	size?: TAutocompleteSize
	variant?: TAutocompleteVariant
	className?: string
	error?: string
	label?: string
	minDropdownWidth?: number
	isLoading?: boolean
	loadingLabel?: string
	noResultsLabel?: string
	filterOptions?: (
		options: Array<IAutocompleteOption<T>>,
		inputValue: string,
	) => Array<IAutocompleteOption<T>>
}

export interface IAutocompleteInputProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'value' | 'onChange' | 'size'
> {
	className?: string
	label?: string
	variant?: TAutocompleteVariant
}

export interface IAutocompleteDropdownProps {
	className?: string
	variant?: TSlotVariant
}

export interface IAutocompleteOptionItemProps {
	option: IAutocompleteOption<string | number>
	isSelected: boolean
	onSelect: (option: IAutocompleteOption<string | number>) => void
	variant?: TSlotVariant
}

export type TAutocompleteRootComponent = <T extends string | number = string>(
	props: IAutocompleteProps<T>,
) => ReactElement

export type TAutocompleteComponent = TAutocompleteRootComponent & {
	Root: TAutocompleteRootComponent
	Input: (props: IAutocompleteInputProps) => ReactElement
	Dropdown: (props: IAutocompleteDropdownProps) => ReactNode
}
