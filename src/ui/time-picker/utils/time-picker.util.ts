import { padTimeUnit } from '@/ui/date-time-picker/utils/date-time-picker.util'

export const DEFAULT_TIME_PICKER_PLACEHOLDER = '--:--'

export const snapMinuteToStep = (
	minute: number,
	stepMinutes: number,
): number => {
	const safeStep = Math.min(60, Math.max(1, stepMinutes))
	const snapped = Math.round(minute / safeStep) * safeStep

	return snapped >= 60 ? 0 : snapped
}

export const parseTimePickerValue = (
	value: string,
	stepMinutes: number,
): { hour: number; minute: number } => {
	if (!value) {
		return { hour: 9, minute: 0 }
	}

	const [hourPart = '9', minutePart = '0'] = value.split(':')
	const hour = Math.min(23, Math.max(0, Number(hourPart) || 0))
	const minute = snapMinuteToStep(Number(minutePart) || 0, stepMinutes)

	return { hour, minute }
}

export const formatTimePickerValue = (hour: number, minute: number): string =>
	`${padTimeUnit(hour)}:${padTimeUnit(minute)}`

export const getCurrentLocalTime = (): string => {
	const now = new Date()

	return formatTimePickerValue(now.getHours(), now.getMinutes())
}
