import { createContext, useContext } from 'react'
import type { IPopoverContextValue } from '../types/i-popover-context-value'

export const PopoverContext = createContext<IPopoverContextValue | null>(null)

export const usePopoverContext = (): IPopoverContextValue => {
	const context = useContext(PopoverContext)

	if (!context) {
		throw new Error(
			'Popover compound components should be used inside Popover root',
		)
	}

	return context
}
