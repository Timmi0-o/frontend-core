import type { ReactNode } from 'react'
import type {
	ISelectOption,
	TSelectSize,
	TSelectTone,
	TSelectVisualVariant,
} from './i-select-props'

export type TSelectValue = string | number

export interface ISelectContextValue {
	options: Array<ISelectOption<TSelectValue>>
	selectedItems: Array<ISelectOption<TSelectValue>>
	isOpen: boolean
	isMultiselect: boolean
	isDisabled: boolean
	isLoading: boolean
	triggerLabel: string
	fieldLabel?: string
	placeholder: string
	loadingLabel: string
	size: TSelectSize
	variant: TSelectVisualVariant
	tone: TSelectTone
	indicatorIcon?: ReactNode
	minDropdownWidth: number
	isOptionSelected: (option: ISelectOption<TSelectValue>) => boolean
	handleSelect: (option: ISelectOption<TSelectValue>) => void
}
