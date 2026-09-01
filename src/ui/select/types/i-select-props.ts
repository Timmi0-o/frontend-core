import type { TSlotVariant } from '@/core/slot-variant'
import type { ReactElement, ReactNode } from 'react'

export type TSelectSize = 'sm' | 'md' | 'lg'
export type TSelectVariant = 'default' | 'light' | 'unstyled'
export type TSelectVisualVariant = Exclude<TSelectVariant, 'unstyled'>
export type TSelectTone =
	| 'default'
	| 'light'
	| 'danger'
	| 'soft-danger'
	| 'success'
	| 'solid'
export type TSelectSelectionMode = 'single' | 'multiselect'

export interface ISelectOption<T extends string | number = string> {
	label: string
	value: T
	disabled?: boolean
}

export interface ISelectValueState {
	selectedItems: Array<ISelectOption<string | number>>
}

export interface ISelectValueRenderParams {
	defaultChildren: ReactNode
	isPlaceholder: boolean
	state: ISelectValueState
}

export type TSelectValueChildren =
	| ReactNode
	| ((params: ISelectValueRenderParams) => ReactNode)

export interface ISelectValueProps {
	className?: string
	variant?: TSelectVariant
	children?: TSelectValueChildren
}

export interface ISelectOptionRenderParams {
	option: ISelectOption<string | number>
	isSelected: boolean
	defaultChildren: ReactNode
}

export type TSelectOptionChildren =
	| ReactNode
	| ((params: ISelectOptionRenderParams) => ReactNode)

export interface ISelectBaseProps<T extends string | number = string> {
	options: Array<ISelectOption<T>>
	children?: ReactNode
	placeholder?: string
	isDisabled?: boolean
	size?: TSelectSize
	variant?: TSelectVariant
	tone?: TSelectTone
	className?: string
	error?: string
	label?: string
	minDropdownWidth?: number
	indicatorIcon?: ReactNode
	isLoading?: boolean
	loadingLabel?: string
}

export interface ISelectSingleProps<
	T extends string | number = string,
> extends ISelectBaseProps<T> {
	selectionMode?: 'single'
	value?: T | null
	onChange?: (value: T | null) => void
}

export interface ISelectMultiselectProps<
	T extends string | number = string,
> extends ISelectBaseProps<T> {
	selectionMode: 'multiselect'
	value?: T[]
	onChange?: (value: T[]) => void
}

export type ISelectProps<T extends string | number = string> =
	| ISelectSingleProps<T>
	| ISelectMultiselectProps<T>

export interface ISelectLabelProps {
	className?: string
	variant?: TSlotVariant
	children?: ReactNode
}

export interface ISelectTriggerProps {
	className?: string
	children?: ReactNode
	variant?: TSelectVariant
}

export interface ISelectIndicatorProps {
	className?: string
	icon?: ReactNode
	variant?: TSlotVariant
}

export interface ISelectDropdownProps {
	className?: string
	variant?: TSlotVariant
	children?: ReactNode
}

export interface ISelectOptionItemProps {
	option: ISelectOption<string | number>
	className?: string
	variant?: TSlotVariant
	children?: TSelectOptionChildren
}

export type TSelectRootComponent = <T extends string | number = string>(
	props: ISelectProps<T>,
) => ReactElement

export type TSelectComponent = TSelectRootComponent & {
	Root: TSelectRootComponent
	Label: (props: ISelectLabelProps) => ReactElement | null
	Trigger: (props: ISelectTriggerProps) => ReactElement
	Value: (props: ISelectValueProps) => ReactElement
	Indicator: (props: ISelectIndicatorProps) => ReactElement | null
	Dropdown: (props: ISelectDropdownProps) => ReactNode
	Option: (props: ISelectOptionItemProps) => ReactElement
}
