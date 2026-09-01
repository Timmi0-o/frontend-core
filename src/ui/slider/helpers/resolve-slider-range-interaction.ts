export type TSliderThumbCollisionBehavior = 'push' | 'swap' | 'none'

/**
 * Политика столкновений для range-слайдера.
 * Base UI по умолчанию push + нулевой зазор — один thumb выталкивает другой
 * до одной точки. Для диапазона держим thumbs разведёнными: не пересекаются
 * и минимум один step между ними.
 */
export function resolveSliderRangeInteraction(
	value: number | readonly number[] | undefined,
	defaultValue: number | readonly number[] | undefined,
	thumbCollisionBehavior?: TSliderThumbCollisionBehavior,
	minStepsBetweenValues?: number,
): {
	thumbCollisionBehavior: TSliderThumbCollisionBehavior
	minStepsBetweenValues: number
} {
	const isRange = Array.isArray(value ?? defaultValue)

	return {
		thumbCollisionBehavior:
			thumbCollisionBehavior ?? (isRange ? 'none' : 'push'),
		minStepsBetweenValues: minStepsBetweenValues ?? (isRange ? 1 : 0),
	}
}
