import { createContext, useContext } from 'react'
import type { IAutocompleteContextValue } from '../types/i-autocomplete-context-value'

export const AutocompleteContext =
	createContext<IAutocompleteContextValue | null>(null)

export const useAutocompleteContext = (): IAutocompleteContextValue => {
	const context = useContext(AutocompleteContext)

	if (!context) {
		throw new Error(
			'AutoComplete compound components should be used inside AutoComplete root',
		)
	}

	return context
}
