export const HOVER_FLOATING_ROOT_ATTR = 'data-hover-floating-root'

/**
 * Ближайший корень hover-меню (сайдбар-дропдаун и т.п.) от узла внутри него.
 * Вложенный Popover порталится сюда, а не в body: иначе курсор уходит
 * из зоны useHover/safePolygon и родительское меню закрывается.
 */
export function findHoverFloatingRoot(from: Element | null): HTMLElement | null {
	return from?.closest<HTMLElement>(`[${HOVER_FLOATING_ROOT_ATTR}]`) ?? null
}
