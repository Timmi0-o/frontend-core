import type { ReactNode } from 'react'
import type {
	ISelectOption,
	TSelectSize,
	TSelectTone,
	TSelectVisualVariant,
} from './i-select-props'

export type TSelectValue = string | number

/** Стабильные визуальные настройки и метаданные поля. */
export interface ISelectChromeContextValue {
	options: Array<ISelectOption<TSelectValue>>
	size: TSelectSize
	variant: TSelectVisualVariant
	tone: TSelectTone
	placeholder: string
	loadingLabel: string
	indicatorIcon?: ReactNode
	fieldLabel?: string
	minDropdownWidth: number
	isMultiselect: boolean
	isClearable: boolean
}

/** Открытие попапа и disabled/loading — меняется при клике по триггеру. */
export interface ISelectInteractionContextValue {
	isOpen: boolean
	isDisabled: boolean
	isLoading: boolean
	handleClear: () => void
}

/** Выбранные значения и обработчики пунктов — не зависят от isOpen. */
export interface ISelectSelectionContextValue {
	selectedItems: Array<ISelectOption<TSelectValue>>
	triggerLabel: string
	isOptionSelected: (option: ISelectOption<TSelectValue>) => boolean
	handleSelect: (option: ISelectOption<TSelectValue>) => void
}

/** @deprecated Используй split-контексты; оставлен для обратной совместимости внутри кита. */
export interface ISelectContextValue
	extends ISelectChromeContextValue,
		ISelectInteractionContextValue,
		ISelectSelectionContextValue {}
