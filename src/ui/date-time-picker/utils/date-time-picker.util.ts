export const padTimeUnit = (value: number): string =>
	String(value).padStart(2, '0')

export const splitLocalDateTime = (
	value: string,
): { date: Date | null; time: string } => {
	if (!value) {
		return { date: null, time: '09:00' }
	}

	const normalized = value.includes('T') ? value : value.replace(' ', 'T')
	const [datePart = '', timePart = '09:00'] = normalized.split('T')

	if (!datePart) {
		return { date: null, time: timePart.slice(0, 5) }
	}

	return {
		date: new Date(`${datePart}T00:00:00`),
		time: timePart.slice(0, 5),
	}
}

export const composeLocalDateTime = (date: Date, time: string): string => {
	const yyyy = String(date.getFullYear())
	const mm = padTimeUnit(date.getMonth() + 1)
	const dd = padTimeUnit(date.getDate())
	const [hours = '09', minutes = '00'] = time.split(':')

	return `${yyyy}-${mm}-${dd}T${padTimeUnit(Number(hours))}:${padTimeUnit(Number(minutes))}`
}

export const formatDateTimePickerValue = (
	value: string,
	locale: string,
): string => {
	if (!value) {
		return ''
	}

	const { date, time } = splitLocalDateTime(value)

	if (!date) {
		return ''
	}

	const dateLabel = date.toLocaleDateString(locale, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})

	return `${dateLabel}, ${time}`
}

export const getCurrentLocalDateTime = (): string => {
	const now = new Date()

	return composeLocalDateTime(
		now,
		`${padTimeUnit(now.getHours())}:${padTimeUnit(now.getMinutes())}`,
	)
}

export const buildTimeColumnValues = (max: number): number[] =>
	Array.from({ length: max + 1 }, (_, index) => index)
