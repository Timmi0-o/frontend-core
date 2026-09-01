import {
	DATE_PICKER_YEAR_RANGE_BACK,
	DATE_PICKER_YEAR_RANGE_FORWARD,
} from '../constants/date-picker.constants'

/**
 * Обнуляет время, чтобы сравнивать только календарный день.
 */
export const startOfDay = (date: Date): Date => {
	const result = new Date(date)

	result.setHours(0, 0, 0, 0)

	return result
}

/**
 * Проверяет, что две даты — один и тот же календарный день.
 */
export const isSameDay = (left: Date, right: Date): boolean =>
	left.getFullYear() === right.getFullYear() &&
	left.getMonth() === right.getMonth() &&
	left.getDate() === right.getDate()

/**
 * Проверяет, что left строго раньше right по календарному дню.
 */
export const isBeforeDay = (left: Date, right: Date): boolean =>
	startOfDay(left).getTime() < startOfDay(right).getTime()

/**
 * Проверяет, что left строго позже right по календарному дню.
 */
export const isAfterDay = (left: Date, right: Date): boolean =>
	startOfDay(left).getTime() > startOfDay(right).getTime()

/**
 * Форматирует выбранную дату для поля ввода (день, месяц и год).
 */
export const formatDatePickerValue = (
	date: Date | null | undefined,
	locale: string,
): string => {
	if (!date) {
		return ''
	}

	return date.toLocaleDateString(locale, {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}

/**
 * Собирает подпись периода для RangeDatePicker: «начало — конец».
 * Если конец ещё не выбран, справа ставит многоточие.
 */
export const formatDateRangeValue = (
	start: Date | null | undefined,
	end: Date | null | undefined,
	locale: string,
): string => {
	if (!start && !end) {
		return ''
	}

	const startText = start ? formatDatePickerValue(start, locale) : '…'
	const endText = end ? formatDatePickerValue(end, locale) : '…'

	return `${startText} — ${endText}`
}

/**
 * Ставит две даты в календарный порядок start ≤ end.
 */
export const orderDateRange = (
	left: Date,
	right: Date,
): { start: Date; end: Date } => {
	const start = startOfDay(left)
	const end = startOfDay(right)

	if (isAfterDay(start, end)) {
		return { start: end, end: start }
	}

	return { start, end }
}

/**
 * День строго внутри отрезка, не включая границы.
 * Нужен полосе диапазона: края рисуются как выбранные дни.
 */
export const isDateInsideRange = (
	date: Date,
	start: Date,
	end: Date,
): boolean => {
	const { start: rangeStart, end: rangeEnd } = orderDateRange(start, end)

	return isAfterDay(date, rangeStart) && isBeforeDay(date, rangeEnd)
}

export interface ICalendarGridDay {
	date: Date
	isOutsideMonth: boolean
}

/**
 * Сетка из 42 дней (6 недель), неделя с понедельника.
 * Соседние месяцы заполняют края, чтобы не было пустых дыр.
 */
export const getCalendarDays = (month: Date): ICalendarGridDay[] => {
	const year = month.getFullYear()
	const monthIndex = month.getMonth()
	const firstDay = new Date(year, monthIndex, 1)
	const mondayOffset = (firstDay.getDay() + 6) % 7
	const gridStart = new Date(year, monthIndex, 1 - mondayOffset)
	const days: ICalendarGridDay[] = []

	for (let index = 0; index < 42; index += 1) {
		const date = new Date(
			gridStart.getFullYear(),
			gridStart.getMonth(),
			gridStart.getDate() + index,
		)

		days.push({
			date,
			isOutsideMonth: date.getMonth() !== monthIndex,
		})
	}

	return days
}

/**
 * Сдвигает календарный месяц на `offset`, всегда на 1-е число.
 * Нужен мультимесячной сетке DatePicker / RangeDatePicker — соседние месяцы от visibleMonth.
 */
export const addCalendarMonths = (month: Date, offset: number): Date =>
	new Date(month.getFullYear(), month.getMonth() + offset, 1)

/**
 * Проверяет, лежит ли день в окне из `monthCount` месяцев, начиная с visibleMonth.
 * Нужен DatePicker / RangeDatePicker, чтобы не сдвигать сетку при клике внутри уже показанных месяцев.
 */
export const isDateInVisibleMonths = (
	date: Date,
	visibleMonth: Date,
	monthCount: number,
): boolean => {
	const windowStart = new Date(
		visibleMonth.getFullYear(),
		visibleMonth.getMonth(),
		1,
	)
	const windowEnd = new Date(
		visibleMonth.getFullYear(),
		visibleMonth.getMonth() + monthCount,
		0,
	)
	const day = startOfDay(date)

	return !isBeforeDay(day, windowStart) && !isAfterDay(day, windowEnd)
}

/**
 * Короткие подписи дней недели с понедельника.
 * Нужны шапке Calendar и DatePicker, чтобы сетка совпадала с getCalendarDays.
 */
export const getCalendarWeekdayLabels = (locale: string): string[] => {
	const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })

	return Array.from({ length: 7 }, (_, index) =>
		formatter.format(new Date(2024, 0, 1 + index)),
	)
}

/**
 * Суббота или воскресенье. Нужен приглушённый цвет выходных в сетке.
 */
export const isWeekendDay = (date: Date): boolean => {
	const weekday = date.getDay()

	return weekday === 0 || weekday === 6
}

/**
 * Короткие названия месяцев для сетки 3×4 в календаре.
 * Полные («сентябрь») не помещаются в ячейку и вылезают за плашку.
 */
export const getDatePickerMonthLabels = (locale: string): string[] =>
	Array.from({ length: 12 }, (_, monthIndex) => {
		const label = new Date(2024, monthIndex, 1).toLocaleDateString(locale, {
			month: 'short',
		})

		return label.replace(/\.$/u, '')
	})

/**
 * Строит диапазон годов: 120 назад и 10 вперёд от текущего.
 * min/max только расширяют окно, если они выходят за эти границы.
 */
export const getDatePickerYearRange = (
	minDate?: Date,
	maxDate?: Date,
): number[] => {
	const currentYear = new Date().getFullYear()
	const startYear = Math.min(
		currentYear - DATE_PICKER_YEAR_RANGE_BACK,
		minDate?.getFullYear() ?? currentYear,
	)
	const endYear = Math.max(
		currentYear + DATE_PICKER_YEAR_RANGE_FORWARD,
		maxDate?.getFullYear() ?? currentYear,
	)
	const years: number[] = []

	for (let year = startYear; year <= endYear; year += 1) {
		years.push(year)
	}

	return years
}

/**
 * Скроллит контейнер так, чтобы элемент оказался по центру.
 * Не вызывает scrollIntoView — тот может сдвинуть страницу вокруг пикера.
 */
export const scrollElementToContainerCenter = (
	container: HTMLElement,
	element: HTMLElement,
): void => {
	const containerRect = container.getBoundingClientRect()
	const elementRect = element.getBoundingClientRect()

	container.scrollTop +=
		elementRect.top -
		containerRect.top -
		container.clientHeight / 2 +
		elementRect.height / 2
}

/**
 * Отключает год, если он целиком вне допустимого диапазона дат.
 */
export const isYearDisabled = (
	year: number,
	minDate?: Date,
	maxDate?: Date,
): boolean => {
	const firstDay = new Date(year, 0, 1)
	const lastDay = new Date(year, 11, 31)

	if (minDate && isBeforeDay(lastDay, minDate)) {
		return true
	}

	if (maxDate && isAfterDay(firstDay, maxDate)) {
		return true
	}

	return false
}

/**
 * Отключает месяц, если он целиком вне допустимого диапазона дат.
 */
export const isMonthDisabled = (
	year: number,
	monthIndex: number,
	minDate?: Date,
	maxDate?: Date,
): boolean => {
	const firstDay = new Date(year, monthIndex, 1)
	const lastDay = new Date(year, monthIndex + 1, 0)

	if (minDate && isBeforeDay(lastDay, minDate)) {
		return true
	}

	if (maxDate && isAfterDay(firstDay, maxDate)) {
		return true
	}

	return false
}
