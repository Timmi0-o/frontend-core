/**
 * Проверяет поддержку CSS scroll-driven animations в рантайме.
 * Нужен хуку ScrollShadow: при true JS-fallback (scroll/ResizeObserver) не подключается.
 */
export const supportsScrollTimeline = (): boolean => {
	if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
		return false
	}

	return CSS.supports('animation-timeline', 'scroll()')
}
