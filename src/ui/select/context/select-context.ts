import { createContext, useContext } from 'react'
import type {
	ISelectChromeContextValue,
	ISelectContextValue,
	ISelectInteractionContextValue,
	ISelectSelectionContextValue,
} from '../types/i-select-context-value'

export const SelectChromeContext = createContext<ISelectChromeContextValue | null>(
	null,
)

export const SelectInteractionContext =
	createContext<ISelectInteractionContextValue | null>(null)

export const SelectSelectionContext =
	createContext<ISelectSelectionContextValue | null>(null)

const useSelectChromeContext = (): ISelectChromeContextValue => {
	const context = useContext(SelectChromeContext)

	if (!context) {
		throw new Error('Select compound components should be used inside Select root')
	}

	return context
}

const useSelectInteractionContext = (): ISelectInteractionContextValue => {
	const context = useContext(SelectInteractionContext)

	if (!context) {
		throw new Error('Select compound components should be used inside Select root')
	}

	return context
}

const useSelectSelectionContext = (): ISelectSelectionContextValue => {
	const context = useContext(SelectSelectionContext)

	if (!context) {
		throw new Error('Select compound components should be used inside Select root')
	}

	return context
}

/** Полный контекст — только для внутренних частей, которым нужны все поля. */
export const useSelectContext = (): ISelectContextValue => {
	return {
		...useSelectChromeContext(),
		...useSelectInteractionContext(),
		...useSelectSelectionContext(),
	}
}

export const useSelectChrome = useSelectChromeContext
export const useSelectInteraction = useSelectInteractionContext
export const useSelectSelection = useSelectSelectionContext
