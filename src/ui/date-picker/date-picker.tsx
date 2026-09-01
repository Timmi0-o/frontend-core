'use client'

import { useMemo, type ReactElement } from 'react'

import { cn } from '@/core/cn'
import { useMobileCondition } from '@/hooks/use-mobile-condition'

import { Popover } from '../popover/popover'
import { DatePickerInput } from './components/date-picker-input/date-picker-input'
import { DatePickerPopover } from './components/date-picker-popover/date-picker-popover'
import {
	DATE_PICKER_DISPLAY_NAMES,
	DATE_PICKER_POPOVER_OFFSET_PX,
} from './constants/date-picker.constants'
import { DatePickerContext } from './context/date-picker-context'
import { useDatePicker } from './hooks/use-date-picker'
import type { IDatePickerContextValue } from './types/i-date-picker-context-value'
import type {
	IDatePickerProps,
	TDatePickerComponent,
} from './types/i-date-picker-props'

export type {
	IDatePickerInputProps,
	IDatePickerPopoverProps,
	IDatePickerProps,
	TDatePickerSize,
	TDatePickerVariant,
} from './types/i-date-picker-props'

const DatePickerRoot = (props: IDatePickerProps): ReactElement => {
	const {
		value,
		children,
		placeholder = 'Выберите дату',
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
		isMobileCondition,
	} = props

	const isMobile = useMobileCondition(isMobileCondition)

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
		isDateDisabled,
		isMonthDisabled,
		isYearDisabled,
		isDateSelected,
		isToday,
		getCalendarDays,
	} = useDatePicker(props)

	const visualVariant = variant === 'unstyled' ? 'default' : variant

	const contextValue = useMemo<IDatePickerContextValue>(
		() => ({
			value,
			displayValue,
			placeholder,
			isOpen,
			isDisabled,
			isMobile,
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
			handleOpenChange,
			isDateDisabled,
			isMonthDisabled,
			isYearDisabled,
			isDateSelected,
			isToday,
			getCalendarDays,
		}),
		[
			value,
			displayValue,
			placeholder,
			isOpen,
			isDisabled,
			isMobile,
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
			handleOpenChange,
			isDateDisabled,
			isMonthDisabled,
			isYearDisabled,
			isDateSelected,
			isToday,
			getCalendarDays,
		],
	)

	const pickerContent = children ?? (
		<>
			<DatePickerInput />
			<DatePickerPopover />
		</>
	)

	return (
		<DatePickerContext.Provider value={contextValue}>
			<div
				data-slot='date-picker'
				data-variant={variant}
				data-disabled={isDisabled ? '' : undefined}
				data-invalid={error ? '' : undefined}
				data-open={isOpen ? '' : undefined}
				className={cn(className)}
			>
				{label ? <label data-slot='date-picker-label'>{label}</label> : null}

				{isMobile ? (
					pickerContent
				) : (
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
						{pickerContent}
					</Popover>
				)}

				{error ? (
					<p data-slot='date-picker-error' role='alert'>
						{error}
					</p>
				) : null}
			</div>
		</DatePickerContext.Provider>
	)
}

DatePickerRoot.displayName = DATE_PICKER_DISPLAY_NAMES.ROOT

/**
 * Дата в инпуте с календарём в попапе. На мобилке (≤1024px) — тот же календарь в BottomSheet.
 * Несколько месяцев — `extendMonthCount`.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   label="Дата отправления"
 *   value={date}
 *   onChange={setDate}
 *   minDate={new Date()}
 *   extendMonthCount={1}
 *   error={error}
 * />
 * ```
 */
export const DatePicker: TDatePickerComponent = Object.assign(DatePickerRoot, {
	Input: DatePickerInput,
	Popover: DatePickerPopover,
	Root: DatePickerRoot,
})
