import type { TBadgePosition } from '../types/i-badge-props'

export type TBadgeResolvedPlacement =
	| 'static'
	| 'top-right'
	| 'top-left'
	| 'bottom-right'
	| 'bottom-left'

/**
 * Сводит короткие `top`/`bottom` и старый `absolute` к углу.
 * Нужен, чтобы CSS держал один набор сторон, а в API можно писать просто «верх» или «низ».
 */
export const resolveBadgePlacement = (
	placement: TBadgePosition,
): TBadgeResolvedPlacement => {
	if (placement === 'top' || placement === 'absolute') {
		return 'top-right'
	}

	if (placement === 'bottom') {
		return 'bottom-right'
	}

	return placement
}
