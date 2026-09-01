'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { Popover } from '@/ui/popover/popover'
import type { ReactElement } from 'react'
import { DATE_PICKER_DISPLAY_NAMES } from '../../constants/date-picker.constants'
import { useDatePickerContext } from '../../context/date-picker-context'
import type { IDatePickerInputProps } from '../../types/i-date-picker-props'

const CalendarIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 16 16'
			width='16'
			height='16'
			fill='none'
			aria-hidden='true'
		>
			<rect
				x='2.5'
				y='3.5'
				width='11'
				height='10'
				rx='2'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
			<path
				d='M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
		</svg>
	)
}

export const DatePickerInput = ({
	className,
	variant: variantProp,
	...rest
}: IDatePickerInputProps): ReactElement => {
	const {
		displayValue,
		placeholder,
		isOpen,
		isDisabled,
		isMobile,
		size,
		variant: contextVariant,
		handleOpenChange,
	} = useDatePickerContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')

	const handleClick: IDatePickerInputProps['onClick'] = (event) => {
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
			data-slot='date-picker-input'
			data-size={size}
			data-variant={variant}
			data-disabled={isDisabled ? '' : undefined}
			data-open={isOpen ? '' : undefined}
			className={cn(className)}
			onClick={handleClick}
		>
			<span data-slot='date-picker-value' data-empty={displayValue ? undefined : ''}>
				{displayValue || placeholder}
			</span>
			<span data-slot='date-picker-icon'>
				<CalendarIcon />
			</span>
		</button>
	)

	if (isMobile) {
		return input
	}

	return <Popover.Trigger>{input}</Popover.Trigger>
}

DatePickerInput.displayName = DATE_PICKER_DISPLAY_NAMES.INPUT
