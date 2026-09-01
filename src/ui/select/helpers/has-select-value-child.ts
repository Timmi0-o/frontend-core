import { Children, isValidElement, type ReactNode } from 'react'
import { SELECT_DISPLAY_NAMES } from '../constants/select.constants'

/**
 * Есть ли среди children слот Select.Value.
 * Нужен Trigger: без слота рисуем строку label, с ним — кастомный рендер.
 */
export function hasSelectValueChild(children: ReactNode): boolean {
	return Children.toArray(children).some((child) => {
		if (!isValidElement(child) || typeof child.type === 'string') {
			return false
		}

		return (
			'displayName' in child.type &&
			child.type.displayName === SELECT_DISPLAY_NAMES.VALUE
		)
	})
}
