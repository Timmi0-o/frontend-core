import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import { SELECT_DISPLAY_NAMES } from '../constants/select.constants'

/**
 * Отделяет слот Select.Label от остальных children.
 * Нужен Root: Label нельзя класть в Popover вместе с Trigger/Dropdown.
 */
export function splitSelectLabelFromChildren(children: ReactNode): {
	labelSlots: ReactElement[]
	rest: ReactNode
} {
	const labelSlots: ReactElement[] = []
	const rest: ReactNode[] = []

	for (const child of Children.toArray(children)) {
		if (
			isValidElement(child) &&
			typeof child.type !== 'string' &&
			'displayName' in child.type &&
			child.type.displayName === SELECT_DISPLAY_NAMES.LABEL
		) {
			labelSlots.push(child)
			continue
		}

		rest.push(child)
	}

	return {
		labelSlots,
		rest: rest.length > 0 ? rest : null,
	}
}
