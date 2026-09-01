/**
 * Считывает top/height пункта оглавления относительно списка.
 * Нужен общему индикатору, чтобы он ехал к активному разделу, а не перерисовывался на кнопке.
 */
export const measureKitsTocIndicator = (
	list: HTMLElement,
	sectionId: string,
): { top: number; height: number } | null => {
	const button = list.querySelector(
		`[data-section-id="${CSS.escape(sectionId)}"]`,
	)

	if (!(button instanceof HTMLElement)) {
		return null
	}

	return {
		top: button.offsetTop,
		height: button.offsetHeight,
	}
}
