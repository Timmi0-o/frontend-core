'use client'

import { TimeColumns } from '@/ui/time-columns/time-columns'
import type { ReactElement } from 'react'

import { useDateTimePickerContext } from '../context/date-time-picker-context'

export const DateTimePickerTimeColumns = (): ReactElement => {
	const { hour, minute, isOpen, isMobile, handleSelectHour, handleSelectMinute } =
		useDateTimePickerContext()

	return (
		<TimeColumns
			hour={hour}
			minute={minute}
			isOpen={isOpen}
			isMobile={isMobile}
			onSelectHour={handleSelectHour}
			onSelectMinute={handleSelectMinute}
		/>
	)
}

DateTimePickerTimeColumns.displayName = 'DateTimePickerTimeColumns'
