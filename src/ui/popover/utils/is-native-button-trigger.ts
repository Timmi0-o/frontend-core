import type { ReactElement } from 'react'

/**
 * Base UI Trigger ставит native-button defaults только если render — настоящий `<button>`.
 * Наш `Button` тоже рендерит button; div/span должны идти с `nativeButton={false}`.
 */
export const isNativeButtonTrigger = (element: ReactElement): boolean => {
	if (element.type === 'button') {
		return true
	}

	if (typeof element.type === 'string') {
		return false
	}

	return (
		'displayName' in element.type && element.type.displayName === 'Button'
	)
}
