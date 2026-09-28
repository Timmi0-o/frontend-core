'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { Popover } from '@/ui/popover/popover'
import type { ReactElement } from 'react'

import { TIME_PICKER_DISPLAY_NAMES } from '../constants/time-picker.constants'
import { TimePickerClear } from './time-picker-clear'
import { useTimePickerContext } from '../context/time-picker-context'
import type { ITimePickerInputProps } from '../types/i-time-picker-props'

const ClockIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 16 16'
			width='16'
			height='16'
			fill='none'
			aria-hidden='true'
		>
			<circle cx='8' cy='8' r='5.5' stroke='currentColor' strokeWidth='1.5' />
			<path
				d='M8 5v3.25l2 1.25'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

export const TimePickerInput = ({
	className,
	variant: variantProp,
	...rest
}: ITimePickerInputProps): ReactElement => {
	const {
		displayValue,
		placeholder,
		isOpen,
		isDisabled,
		isMobile,
		size,
		variant: contextVariant,
		handleOpenChange,
	} = useTimePickerContext()
	const variant = resolveChildSlotVariant(
		variantProp,
		contextVariant,
		'default',
	)

	const handleClick: ITimePickerInputProps['onClick'] = (event) => {
		rest.onClick?.(event)

		if (isMobile && !isDisabled) {
			handleOpenChange(!isOpen)
		}
	}

	const input = (
		<button
			{...rest}
			type='button'
			disabled={isDisabled}
			aria-expanded={isOpen}
			aria-label={placeholder}
			data-slot='time-picker-input'
			data-size={size}
			data-variant={variant}
			data-disabled={isDisabled ? '' : undefined}
			data-open={isOpen ? '' : undefined}
			className={cn(className)}
			onClick={handleClick}
		>
			<span
				data-slot='time-picker-value'
				data-empty={displayValue ? undefined : ''}
			>
				{displayValue || placeholder}
			</span>
			<span data-slot='time-picker-actions'>
				<TimePickerClear />
				<span data-slot='time-picker-icon'>
					<ClockIcon />
				</span>
			</span>
		</button>
	)

	if (isMobile) {
		return input
	}

	return <Popover.Trigger>{input}</Popover.Trigger>
}

TimePickerInput.displayName = TIME_PICKER_DISPLAY_NAMES.INPUT
