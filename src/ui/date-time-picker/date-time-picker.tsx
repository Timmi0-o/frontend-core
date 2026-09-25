'use client'

import { cn } from '@/core/cn'
import { useOpenOverlayZ } from '@/core/overlay-layer'
import { useMobileCondition } from '@/hooks/use-mobile-condition'
import { Popover } from '@/ui/popover/popover'
import type { IPopoverOpenChangeDetails } from '@/ui/popover/types/i-popover-props'
import { useMemo, type ReactElement } from 'react'

import {
	DATE_TIME_PICKER_DISPLAY_NAMES,
	DATE_TIME_PICKER_POPOVER_OFFSET_PX,
	DEFAULT_DATE_TIME_PICKER_PLACEHOLDER,
} from './constants/date-time-picker.constants'
import { DateTimePickerInput } from './components/date-time-picker-input'
import { DateTimePickerPopover } from './components/date-time-picker-popover'
import { DateTimePickerContext } from './context/date-time-picker-context'
import { useDateTimePicker } from './hooks/use-date-time-picker'
import type {
	IDateTimePickerProps,
	TDateTimePickerComponent,
} from './types/i-date-time-picker-props'

export type {
	IDateTimePickerInputProps,
	IDateTimePickerPopoverProps,
	IDateTimePickerProps,
} from './types/i-date-time-picker-props'

const DateTimePickerRoot = (props: IDateTimePickerProps): ReactElement => {
	const {
		onBlur,
		id,
		className,
		isDisabled = false,
		variant = 'default',
		size = 'md',
		error,
		label,
		placeholder = DEFAULT_DATE_TIME_PICKER_PLACEHOLDER,
		isMobileCondition,
	} = props

	const isMobile = useMobileCondition(isMobileCondition)
	const picker = useDateTimePicker(props)

	useOpenOverlayZ(picker.isOpen && !isMobile)

	const visualVariant = variant === 'unstyled' ? 'default' : variant

	const contextValue = useMemo(
		() => ({
			...picker,
			placeholder,
			isDisabled,
			size,
			variant: visualVariant,
			error,
			label,
			isMobile,
		}),
		[error, isDisabled, isMobile, label, picker, placeholder, size, visualVariant],
	)

	const pickerContent = (
		<>
			<DateTimePickerInput id={id} onBlur={onBlur} />
			<DateTimePickerPopover />
		</>
	)

	return (
		<DateTimePickerContext.Provider value={contextValue}>
			<div
				data-slot='date-time-picker'
				data-variant={variant}
				data-disabled={isDisabled ? '' : undefined}
				data-invalid={error ? '' : undefined}
				data-open={picker.isOpen ? '' : undefined}
				className={cn(className)}
			>
				{label ? <label data-slot='date-time-picker-label'>{label}</label> : null}

				{isMobile ? (
					pickerContent
				) : (
					<Popover
						open={picker.isOpen}
						onOpenChange={(
							isNextOpen,
							details?: IPopoverOpenChangeDetails,
						) => {
							if (isDisabled) {
								return
							}

							if (!isNextOpen && details?.reason === 'outside-press') {
								details.event?.preventDefault()
								details.event?.stopPropagation()
							}

							picker.handleOpenChange(isNextOpen)
						}}
						placement='bottom-start'
						offset={DATE_TIME_PICKER_POPOVER_OFFSET_PX}
					>
						{pickerContent}
					</Popover>
				)}

				{error ? (
					<p data-slot='date-time-picker-error' role='alert'>
						{error}
					</p>
				) : null}
			</div>
		</DateTimePickerContext.Provider>
	)
}

DateTimePickerRoot.displayName = DATE_TIME_PICKER_DISPLAY_NAMES.ROOT

/**
 * Дата и время в одном поле. Значение — локальная строка `YYYY-MM-DDTHH:mm`.
 * В попапе: календарь, колонки часов/минут, «Удалить» и «Сегодня».
 */
export const DateTimePicker: TDateTimePickerComponent = Object.assign(
	DateTimePickerRoot,
	{
		Input: DateTimePickerInput,
		Popover: DateTimePickerPopover,
		Root: DateTimePickerRoot,
	},
)
