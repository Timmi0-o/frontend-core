/**
 * Текст текущего значения для Slider.Value.
 * formatValue важнее дефолтного Intl из Base UI — для суффиксов вроде «14%».
 */
export function renderSliderOutput(
	formatValue: ((value: number, index: number) => string) | undefined,
	formattedValues: readonly string[],
	values: readonly number[],
): string {
	if (formatValue) {
		return values
			.map((item, index) => formatValue(item, index))
			.join(' – ')
	}

	return formattedValues.join(' – ')
}
