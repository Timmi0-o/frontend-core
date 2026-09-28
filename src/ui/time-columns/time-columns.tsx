'use client'

import { cn } from '@/core/cn'
import { scrollElementToContainerCenter } from '@/ui/date-picker/utils/date-picker-date.util'
import {
	buildTimeColumnValues,
	padTimeUnit,
} from '@/ui/date-time-picker/utils/date-time-picker.util'
import { useLayoutEffect, useRef, type ReactElement } from 'react'

export interface ITimeColumnsProps {
	hour: number
	minute: number
	isOpen: boolean
	isMobile: boolean
	stepMinutes?: number
	onSelectHour: (hour: number) => void
	onSelectMinute: (minute: number) => void
	className?: string
}

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

const buildMinuteColumnValues = (stepMinutes: number): number[] => {
	const safeStep = Math.min(60, Math.max(1, stepMinutes))
	const values: number[] = []

	for (let minute = 0; minute < 60; minute += safeStep) {
		values.push(minute)
	}

	return values
}

export const TimeColumns = ({
	hour,
	minute,
	isOpen,
	isMobile,
	stepMinutes = 1,
	onSelectHour,
	onSelectMinute,
	className,
}: ITimeColumnsProps): ReactElement => {
	const hoursRef = useRef<HTMLDivElement>(null)
	const minutesRef = useRef<HTMLDivElement>(null)
	const hours = buildTimeColumnValues(23)
	const minutes = buildMinuteColumnValues(stepMinutes)

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
		<div
			data-slot='date-time-picker-time-shell'
			className={cn(className)}
			aria-label='Time'
		>
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
							onClick={() => onSelectHour(value)}
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
							onClick={() => onSelectMinute(value)}
						>
							{padTimeUnit(value)}
						</button>
					)
				})}
			</div>
		</div>
	)
}

TimeColumns.displayName = 'TimeColumns'
