import type { TPopoverPlacement } from '../types/i-popover-props'

type TPopoverSide = 'top' | 'right' | 'bottom' | 'left'
type TPopoverAlign = 'start' | 'center' | 'end'

/**
 * Переводит placement (`bottom-end`) в side/align Base UI Positioner,
 * чтобы существующие вызовы не менялись.
 */
export const mapPopoverPlacement = (
	placement: TPopoverPlacement = 'bottom',
): {
	side: TPopoverSide
	align: TPopoverAlign
} => {
	const [side, align] = placement.split('-') as [
		TPopoverSide,
		TPopoverAlign | undefined,
	]

	return {
		side,
		align: align ?? 'center',
	}
}
