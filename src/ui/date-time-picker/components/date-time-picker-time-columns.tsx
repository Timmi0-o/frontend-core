'use client'

import { cn } from '@/core/cn'
import { scrollElementToContainerCenter } from '@/ui/date-picker/utils/date-picker-date.util'
import { useLayoutEffect, useRef, type ReactElement } from 'react'

import { useDateTimePickerContext } from '../context/date-time-picker-context'
import {
	buildTimeColumnValues,
	padTimeUnit,
} from '../utils/date-time-picker.util'

const scrollColumnToValue = (
	container: HTMLDivElement | null,
	value: number,
): void => {
	if (!container) {
		return
	}

	const selected = container.querySelector(
		`[data-value="${value}"]`,
	) as HTMLElement | null

	if (selected) {
		scrollElementToContainerCenter(container, selected)
	}
}

export const DateTimePickerTimeColumns = (): ReactElement => {
	const { hour, minute, isOpen, isMobile, handleSelectHour, handleSelectMinute } =
		useDateTimePickerContext()
	const hoursRef = useRef<HTMLDivElement>(null)
	const minutesRef = useRef<HTMLDivElement>(null)
	const hours = buildTimeColumnValues(23)
	const minutes = buildTimeColumnValues(59)

	useLayoutEffect(() => {
		if (!isOpen) {
			return
		}

		const scrollToSelection = (): void => {
			scrollColumnToValue(hoursRef.current, hour)
			scrollColumnToValue(minutesRef.current, minute)
		}

		let raf1 = 0
		let raf2 = 0
		const mobileTimeouts: ReturnType<typeof setTimeout>[] = []

		scrollToSelection()

		raf1 = requestAnimationFrame(() => {
			raf2 = requestAnimationFrame(scrollToSelection)
		})

		if (isMobile) {
			mobileTimeouts.push(setTimeout(scrollToSelection, 120))
			mobileTimeouts.push(setTimeout(scrollToSelection, 320))
		}

		return () => {
			cancelAnimationFrame(raf1)
			cancelAnimationFrame(raf2)
			mobileTimeouts.forEach(clearTimeout)
		}
	}, [hour, isMobile, isOpen, minute])

	return (
		<div data-slot='date-time-picker-time-shell' aria-label='Time'>
			<div ref={hoursRef} data-slot='date-time-picker-time-column'>
				{hours.map((value) => {
					const isSelected = value === hour

					return (
						<button
							key={value}
							type='button'
							data-slot='date-time-picker-time-option'
							data-value={value}
							data-selected={isSelected ? '' : undefined}
							className={cn(isSelected && 'is-selected')}
							onClick={() => handleSelectHour(value)}
						>
							{padTimeUnit(value)}
						</button>
					)
				})}
			</div>
			<div ref={minutesRef} data-slot='date-time-picker-time-column'>
				{minutes.map((value) => {
					const isSelected = value === minute

					return (
						<button
							key={value}
							type='button'
							data-slot='date-time-picker-time-option'
							data-value={value}
							data-selected={isSelected ? '' : undefined}
							className={cn(isSelected && 'is-selected')}
							onClick={() => handleSelectMinute(value)}
						>
							{padTimeUnit(value)}
						</button>
					)
				})}
			</div>
		</div>
	)
}

DateTimePickerTimeColumns.displayName = 'DateTimePickerTimeColumns'
