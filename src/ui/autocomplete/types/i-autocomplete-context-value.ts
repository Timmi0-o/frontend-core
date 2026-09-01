import type { ChangeEvent, FocusEvent } from 'react'
import type {
	IAutocompleteOption,
	TAutocompleteSize,
	TAutocompleteVisualVariant,
} from './i-autocomplete-props'

export type TAutocompleteValue = string | number

export interface IAutocompleteContextValue {
	options: Array<IAutocompleteOption<TAutocompleteValue>>
	filteredOptions: Array<IAutocompleteOption<TAutocompleteValue>>
	inputValue: string
	isOpen: boolean
	isDisabled: boolean
	isLoading: boolean
	selectedValue: TAutocompleteValue | null | undefined
	placeholder: string
	loadingLabel: string
	noResultsLabel: string
	size: TAutocompleteSize
	variant: TAutocompleteVisualVariant
	minDropdownWidth: number
	isOptionSelected: (option: IAutocompleteOption<TAutocompleteValue>) => boolean
	handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void
	handleInputFocus: () => void
	handleInputBlur: (event: FocusEvent<HTMLInputElement>) => void
	handleSelect: (option: IAutocompleteOption<TAutocompleteValue>) => void
	listboxId: string
}
