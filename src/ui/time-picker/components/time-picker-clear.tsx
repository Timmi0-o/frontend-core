'use client'

import { resolveChildSlotVariant } from '@/core/slot-variant'
import type { MouseEvent, PointerEvent, ReactElement } from 'react'

import { TIME_PICKER_DISPLAY_NAMES } from '../constants/time-picker.constants'
import { useTimePickerContext } from '../context/time-picker-context'

const ClearIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 16 16'
			width='16'
			height='16'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M4 4l8 8M12 4l-8 8'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
		</svg>
	)
}

export const TimePickerClear = (): ReactElement | null => {
	const {
		displayValue,
		isDisabled,
		isClearable,
		clearLabel,
		handleClear,
		variant,
	} = useTimePickerContext()

	if (!isClearable || isDisabled || !displayValue) {
		return null
	}

	const stopTriggerToggle = (
		event: MouseEvent<HTMLSpanElement> | PointerEvent<HTMLSpanElement>,
	): void => {
		event.preventDefault()
		event.stopPropagation()
	}

	return (
		<span
			data-slot='time-picker-clear'
			data-variant={resolveChildSlotVariant(undefined, variant, 'default')}
			role='button'
			tabIndex={-1}
			aria-label={clearLabel}
			onPointerDown={stopTriggerToggle}
			onClick={(event) => {
				stopTriggerToggle(event)
				handleClear()
			}}
		>
			<ClearIcon />
		</span>
	)
}

TimePickerClear.displayName = TIME_PICKER_DISPLAY_NAMES.CLEAR
