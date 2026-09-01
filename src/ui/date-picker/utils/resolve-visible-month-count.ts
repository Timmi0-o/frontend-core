import { DATE_PICKER_MAX_EXTEND_MONTH_COUNT } from '../constants/date-picker.constants'

/**
 * Сколько месяцев подряд показать в календаре.
 * Без пропа — один месяц; иначе текущий плюс `extendMonthCount` (не больше 6).
 */
export const resolveVisibleMonthCount = (extendMonthCount?: number): number => {
	if (extendMonthCount == null || !Number.isFinite(extendMonthCount)) {
		return 1
	}

	const extra = Math.trunc(extendMonthCount)

	if (extra <= 0) {
		return 1
	}

	return 1 + Math.min(DATE_PICKER_MAX_EXTEND_MONTH_COUNT, extra)
}
