import type { ReactNode } from 'react'
import { isSelectRenderFn } from './is-select-render-fn'

/**
 * Содержимое слота Value/Option: функция получает контекст выбора,
 * иначе кладём children как есть, без children — defaultChildren (строка).
 */
export function renderSelectSlot<T>(
	children: ReactNode | ((params: T) => ReactNode) | undefined,
	params: T,
	defaultChildren: ReactNode,
): ReactNode {
	if (isSelectRenderFn<T>(children)) {
		return children(params)
	}

	if (children != null) {
		return children
	}

	return defaultChildren
}
