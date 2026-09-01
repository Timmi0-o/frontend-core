'use client'

import { cn } from '@/core/cn'
import { DATE_PICKER_POPOVER_OFFSET_PX } from '@/ui/date-picker/constants/date-picker.constants'
import { Popover } from '@/ui/popover/popover'
import { useMemo, type ReactElement } from 'react'
import { RangeDatePickerInput } from './components/range-date-picker-input/range-date-picker-input'
import { RangeDatePickerPopover } from './components/range-date-picker-popover/range-date-picker-popover'
import { RANGE_DATE_PICKER_DISPLAY_NAMES } from './constants/range-date-picker.constants'
import { RangeDatePickerContext } from './context/range-date-picker-context'
import { useRangeDatePicker } from './hooks/use-range-date-picker'
import type { IRangeDatePickerContextValue } from './types/i-range-date-picker-context-value'
import type {
	IRangeDatePickerProps,
	TRangeDatePickerComponent,
} from './types/i-range-date-picker-props'

export type {
	IDateRangeValue,
	IRangeDatePickerInputProps,
	IRangeDatePickerPopoverProps,
	IRangeDatePickerProps,
} from './types/i-range-date-picker-props'

const RangeDatePickerRoot = (props: IRangeDatePickerProps): ReactElement => {
	const {
		value = { start: null, end: null },
		children,
		placeholder = 'Выберите период',
		size = 'md',
		variant = 'default',
		className,
		error,
		label,
		minDate,
		maxDate,
		locale = 'ru',
		previousMonth = 'Предыдущий месяц',
		nextMonth = 'Следующий месяц',
	} = props

	const {
		isOpen,
		isDisabled,
		displayValue,
		visibleMonth,
		visibleMonthCount,
		viewMode,
		monthLabels,
		yearRange,
		handleOpenChange,
		handlePreviousMonth,
		handleNextMonth,
		handleToggleMonthPicker,
		handleToggleYearPicker,
		handleSelectMonth,
		handleSelectYear,
		handleShiftVisibleYear,
		handleSelectDate,
		handleSelectToday,
		handleDayPointerEnter,
		handleDayPointerLeave,
		isDateDisabled,
		isMonthDisabled,
		isYearDisabled,
		isDateSelected,
		isDateRangeStart,
		isDateRangeEnd,
		isDateInRange,
		isToday,
		getCalendarDays,
	} = useRangeDatePicker(props)

	const visualVariant = variant === 'unstyled' ? 'default' : variant

	const contextValue = useMemo<IRangeDatePickerContextValue>(
		() => ({
			value,
			displayValue,
			placeholder,
			isOpen,
			isDisabled,
			visibleMonth,
			visibleMonthCount,
			viewMode,
			monthLabels,
			yearRange,
			size,
			variant: visualVariant,
			locale,
			previousMonth,
			nextMonth,
			minDate,
			maxDate,
			handlePreviousMonth,
			handleNextMonth,
			handleToggleMonthPicker,
			handleToggleYearPicker,
			handleSelectMonth,
			handleSelectYear,
			handleShiftVisibleYear,
			handleSelectDate,
			handleSelectToday,
			handleDayPointerEnter,
			handleDayPointerLeave,
			isDateDisabled,
			isMonthDisabled,
			isYearDisabled,
			isDateSelected,
			isDateRangeStart,
			isDateRangeEnd,
			isDateInRange,
			isToday,
			getCalendarDays,
		}),
		[
			value,
			displayValue,
			placeholder,
			isOpen,
			isDisabled,
			visibleMonth,
			visibleMonthCount,
			viewMode,
			monthLabels,
			yearRange,
			size,
			visualVariant,
			locale,
			previousMonth,
			nextMonth,
			minDate,
			maxDate,
			handlePreviousMonth,
			handleNextMonth,
			handleToggleMonthPicker,
			handleToggleYearPicker,
			handleSelectMonth,
			handleSelectYear,
			handleShiftVisibleYear,
			handleSelectDate,
			handleSelectToday,
			handleDayPointerEnter,
			handleDayPointerLeave,
			isDateDisabled,
			isMonthDisabled,
			isYearDisabled,
			isDateSelected,
			isDateRangeStart,
			isDateRangeEnd,
			isDateInRange,
			isToday,
			getCalendarDays,
		],
	)

	return (
		<RangeDatePickerContext.Provider value={contextValue}>
			<div
				data-slot='range-date-picker'
				data-variant={variant}
				data-disabled={isDisabled ? '' : undefined}
				data-invalid={error ? '' : undefined}
				data-open={isOpen ? '' : undefined}
				className={cn(className)}
			>
				{label ? <label data-slot='date-picker-label'>{label}</label> : null}

				<Popover
					open={isOpen}
					onOpenChange={(isNextOpen) => {
						if (isDisabled) {
							return
						}

						handleOpenChange(isNextOpen)
					}}
					placement='bottom-start'
					offset={DATE_PICKER_POPOVER_OFFSET_PX}
				>
					{children ?? (
						<>
							<RangeDatePickerInput />
							<RangeDatePickerPopover />
						</>
					)}
				</Popover>

				{error ? (
					<p data-slot='date-picker-error' role='alert'>
						{error}
					</p>
				) : null}
			</div>
		</RangeDatePickerContext.Provider>
	)
}

RangeDatePickerRoot.displayName = RANGE_DATE_PICKER_DISPLAY_NAMES.ROOT

/**
 * Диапазон дат `{ start, end }`. Несколько месяцев — `extendMonthCount`.
 *
 * @example
 * ```tsx
 * <RangeDatePicker
 *   label="Даты поездки"
 *   value={range}
 *   onChange={setRange}
 *   extendMonthCount={1}
 * />
 * ```
 */
export const RangeDatePicker: TRangeDatePickerComponent = Object.assign(
	RangeDatePickerRoot,
	{
		Input: RangeDatePickerInput,
		Popover: RangeDatePickerPopover,
		Root: RangeDatePickerRoot,
	},
)
