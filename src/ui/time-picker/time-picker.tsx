'use client'

import { cn } from '@/core/cn'
import type { ReactElement } from 'react'
import { Select } from '../select/select'
import { buildTimeOptions } from './utils/build-time-options'

export interface ITimePickerProps {
	value: string
	onChange: (value: string) => void
	onBlur?: () => void
	id?: string
	className?: string
	placeholder?: string
	isDisabled?: boolean
	stepMinutes?: number
	size?: 'sm' | 'md' | 'lg'
	variant?: 'default' | 'light' | 'unstyled'
	label?: string
	error?: string
}

/**
 * Выбор времени из Select (шаг `stepMinutes`). Значение — строка `HH:mm`.
 *
 * @example
 * ```tsx
 * <TimePicker
 *   label="Время"
 *   value={time}
 *   onChange={setTime}
 *   stepMinutes={15}
 * />
 * ```
 */
export const TimePicker = ({
	value,
	onChange,
	onBlur,
	id,
	className,
	placeholder = 'Выберите время',
	isDisabled = false,
	stepMinutes = 30,
	size = 'md',
	variant = 'default',
	label,
	error,
}: ITimePickerProps): ReactElement => {
	const options = buildTimeOptions(stepMinutes).map((time) => ({
		label: time,
		value: time,
	}))

	return (
		<div
			data-slot='time-picker'
			data-variant={variant}
			className={cn(className)}
			onBlur={onBlur}
		>
			<Select
				options={options}
				value={value || null}
				onChange={(nextValue) => {
					if (nextValue) {
						onChange(String(nextValue))
					}
				}}
				placeholder={placeholder}
				isDisabled={isDisabled}
				size={size}
				variant={variant === 'unstyled' ? 'default' : variant}
				label={label}
				error={error}
				className={id ? `time-picker-${id}` : undefined}
			/>
		</div>
	)
}

TimePicker.displayName = 'TimePicker'
