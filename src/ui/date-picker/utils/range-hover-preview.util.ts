import { orderDateRange, startOfDay } from './date-picker-date.util'

const RANGE_PREVIEW_SELECTOR =
	'[data-slot="date-picker-day"][data-range-preview]'

/**
 * Сбрасывает preview-диапазон, выставленный при hover во время выбора конца периода.
 * Не трогает data-* от зафиксированного value — только `data-range-preview`.
 */
export const clearRangeHoverPreview = (root: HTMLElement): void => {
	root.querySelectorAll<HTMLElement>(RANGE_PREVIEW_SELECTOR).forEach((dayElement) => {
		dayElement.removeAttribute('data-in-range')
		dayElement.removeAttribute('data-range-start')
		dayElement.removeAttribute('data-range-end')
		dayElement.removeAttribute('data-range-preview')
	})
}

/**
 * Подсвечивает диапазон от `rangeStart` до `hoverDate` через data-атрибуты на кнопках дней.
 * Обновляет DOM напрямую, без React state — стили берутся из date-picker.css.
 */
export const applyRangeHoverPreview = (
	root: HTMLElement,
	rangeStart: Date,
	hoverDate: Date,
): void => {
	clearRangeHoverPreview(root)

	const orderedRange = orderDateRange(
		startOfDay(rangeStart),
		startOfDay(hoverDate),
	)
	const rangeStartTs = orderedRange.start.getTime()
	const rangeEndTs = orderedRange.end.getTime()

	root
		.querySelectorAll<HTMLElement>('[data-slot="date-picker-day"][data-ts]')
		.forEach((dayElement) => {
			const dayTs = Number(dayElement.dataset.ts)

			if (Number.isNaN(dayTs) || dayTs < rangeStartTs || dayTs > rangeEndTs) {
				return
			}

			dayElement.dataset.rangePreview = ''

			if (dayTs === rangeStartTs) {
				dayElement.dataset.rangeStart = ''
			} else if (dayTs === rangeEndTs) {
				dayElement.dataset.rangeEnd = ''
			} else {
				dayElement.dataset.inRange = ''
			}
		})
}
