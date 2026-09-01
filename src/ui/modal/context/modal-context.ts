import { createContext, useContext } from 'react'
import type { IModalContextValue } from '../types/i-modal-context-value'

export const ModalContext = createContext<IModalContextValue | null>(null)

export const useModalContext = (): IModalContextValue => {
	const context = useContext(ModalContext)

	if (!context) {
		throw new Error('Modal compound components should be used inside Modal root')
	}

	return context
}
