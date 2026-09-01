import type { ReactNode } from 'react'

/**
 * Render-prop слота Select.Value / Select.Option, а не обычный ReactNode.
 */
export function isSelectRenderFn<T>(
	children: ReactNode | ((params: T) => ReactNode) | undefined,
): children is (params: T) => ReactNode {
	return typeof children === 'function'
}
