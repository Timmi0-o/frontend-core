'use client'

import { createContext, useContext, type Context } from 'react'

export type {
	IComponentWithDisplayName,
	ICompoundChildProps,
} from './types/i-create-compound-component.types'

/**
 * Локальный context для compound-компонента, без props drilling по сабкомпонентам.
 * Вызывать при создании нового compound (Checkbox, Popover, позже Input/Modal).
 */
export const createCompoundContext = <T>(
	displayName: string,
): {
	Context: Context<T | null>
	useCompoundContext: () => T
} => {
	const Context = createContext<T | null>(null)
	Context.displayName = `${displayName}Context`

	const useCompoundContext = (): T => {
		const value = useContext(Context)

		if (value === null) {
			throw new Error(
				`${displayName} subcomponents must be used within ${displayName}.Root`,
			)
		}

		return value
	}

	return { Context, useCompoundContext }
}
