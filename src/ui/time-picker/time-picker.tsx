'use client'

import { cn } from '@/core/cn'
import { useOpenOverlayZ } from '@/core/overlay-layer'
import { useMobileCondition } from '@/hooks/use-mobile-condition'
import { Popover } from '@/ui/popover/popover'
import type { IPopoverOpenChangeDetails } from '@/ui/popover/types/i-popover-props'
import { useMemo, type ReactElement } from 'react'

import { TimePickerInput } from './components/time-picker-input'
import { TimePickerPopover } from './components/time-picker-popover'
import {
	TIME_PICKER_DISPLAY_NAMES,
	TIME_PICKER_POPOVER_OFFSET_PX,
} from './constants/time-picker.constants'
import { TimePickerContext } from './context/time-picker-context'
import { useTimePicker } from './hooks/use-time-picker'
import type {
	ITimePickerProps,
	TTimePickerComponent,
} from './types/i-time-picker-props'
import { DEFAULT_TIME_PICKER_PLACEHOLDER } from './utils/time-picker.util'

export type { ITimePickerProps } from './types/i-time-picker-props'

const TimePickerRoot = (props: ITimePickerProps): ReactElement => {
	const {
		onBlur,
		id,
		className,
		isDisabled = false,
		variant = 'default',
		size = 'md',
		error,
		label,
		placeholder = DEFAULT_TIME_PICKER_PLACEHOLDER,
		stepMinutes = 1,
		isClearable = true,
		isMobileCondition,
	} = props

	const isMobile = useMobileCondition(isMobileCondition)
	const picker = useTimePicker(props)

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
			stepMinutes,
			isClearable,
		}),
		[
			error,
			isClearable,
			isDisabled,
			isMobile,
			label,
			picker,
			placeholder,
			size,
			stepMinutes,
			visualVariant,
		],
	)

	const pickerContent = (
		<>
			<TimePickerInput id={id} onBlur={onBlur} />
			<TimePickerPopover />
		</>
	)

	return (
		<TimePickerContext.Provider value={contextValue}>
			<div
				data-slot='time-picker'
				data-variant={variant}
				data-disabled={isDisabled ? '' : undefined}
				data-invalid={error ? '' : undefined}
				data-open={picker.isOpen ? '' : undefined}
				className={cn(className)}
			>
				{label ? <label data-slot='time-picker-label'>{label}</label> : null}

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
						offset={TIME_PICKER_POPOVER_OFFSET_PX}
					>
						{pickerContent}
					</Popover>
				)}

				{error ? (
					<p data-slot='time-picker-error' role='alert'>
						{error}
					</p>
				) : null}
			</div>
		</TimePickerContext.Provider>
	)
}

TimePickerRoot.displayName = TIME_PICKER_DISPLAY_NAMES.ROOT

/**
 * Выбор времени в попапе с колонками часов и минут. Значение — строка `HH:mm`.
 *
 * @example
 * ```tsx
 * <TimePicker
 *   label="Начало"
 *   value={time}
 *   onChange={setTime}
 *   stepMinutes={30}
 * />
 * ```
 */
export const TimePicker: TTimePickerComponent = Object.assign(TimePickerRoot, {
	Root: TimePickerRoot,
	Input: TimePickerInput,
	Popover: TimePickerPopover,
})
