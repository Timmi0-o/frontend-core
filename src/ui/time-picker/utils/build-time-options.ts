/**
 * Строит список времени в формате HH:mm с заданным шагом.
 * Используется в TimePicker, когда нужно выбрать время из фиксированных слотов.
 */
export const buildTimeOptions = (stepMinutes: number): string[] => {
	const safeStep = Math.min(60, Math.max(1, stepMinutes))
	const options: string[] = []

	for (let total = 0; total < 24 * 60; total += safeStep) {
		const hours = String(Math.floor(total / 60)).padStart(2, '0')
		const minutes = String(total % 60).padStart(2, '0')
		options.push(`${hours}:${minutes}`)
	}

	return options
}
