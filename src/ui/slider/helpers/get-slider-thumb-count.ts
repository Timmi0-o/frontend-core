/**
 * Сколько Thumb рисовать в коротком API.
 * Массив value/defaultValue → несколько ползунков, иначе один.
 */
export function getSliderThumbCount(
	value: number | readonly number[] | undefined,
	defaultValue?: number | readonly number[],
): number {
	const source = value ?? defaultValue

	if (Array.isArray(source)) {
		return Math.max(1, source.length)
	}

	return 1
}
