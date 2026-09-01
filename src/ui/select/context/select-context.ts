import { createContext, useContext } from 'react'
import type { ISelectContextValue } from '../types/i-select-context-value'

export const SelectContext = createContext<ISelectContextValue | null>(null)

export const useSelectContext = (): ISelectContextValue => {
	const context = useContext(SelectContext)

	if (!context) {
		throw new Error('Select compound components should be used inside Select root')
	}

	return context
}
