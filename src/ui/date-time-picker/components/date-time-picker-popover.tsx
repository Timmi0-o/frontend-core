'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { AdaptiveDialog } from '@/ui/adaptive-dialog/adaptive-dialog'
import { CalendarView } from '@/ui/calendar/components/calendar-view/calendar-view'
import { Popover } from '@/ui/popover/popover'
import { startOfDay } from '@/ui/date-picker/utils/date-picker-date.util'
import type { ReactNode } from 'react'

import { DATE_TIME_PICKER_DISPLAY_NAMES } from '../constants/date-time-picker.constants'
import { useDateTimePickerContext } from '../context/date-time-picker-context'
import type { IDateTimePickerPopoverProps } from '../types/i-date-time-picker-props'
import { DateTimePickerTimeColumns } from './date-time-picker-time-columns'

export const DateTimePickerPopover = ({
	className,
}: IDateTimePickerPopoverProps): ReactNode => {
	const {
		placeholder,
		isOpen,
		isMobile,
		visibleMonth,
		visibleMonthCount,
		viewMode,
		monthLabels,
		yearRange,
		locale,
		previousMonth,
		nextMonth,
		todayLabel,
		clearLabel,
		handlePreviousMonth,
		handleNextMonth,
		handleToggleMonthPicker,
		handleToggleYearPicker,
		handleSelectMonth,
		handleSelectYear,
		handleShiftVisibleYear,
		handleSelectDate,
		handleSelectToday,
		handleClear,
		isDateDisabled,
		isMonthDisabled,
		isYearDisabled,
		isDateSelected,
		isToday,
		getCalendarDays,
		handleOpenChange,
		variant: contextVariant,
	} = useDateTimePickerContext()
	const variant = resolveChildSlotVariant(undefined, contextVariant, 'default')

	const panel = (
		<div
			data-slot='date-time-picker-panel'
			data-mobile={isMobile ? '' : undefined}
			data-variant={variant}
			className={cn(className)}
		>
			<div data-slot='date-time-picker-panel-body'>
				<div data-slot='date-time-picker-calendar'>
					<CalendarView
						variant={variant}
						visibleMonth={visibleMonth}
						visibleMonthCount={visibleMonthCount}
						viewMode={viewMode}
						monthLabels={monthLabels}
						yearRange={yearRange}
						locale={locale}
						previousMonth={previousMonth}
						nextMonth={nextMonth}
						showTodayAction={false}
						isTodayDisabled={isDateDisabled(startOfDay(new Date()))}
						handlePreviousMonth={handlePreviousMonth}
						handleNextMonth={handleNextMonth}
						handleToggleMonthPicker={handleToggleMonthPicker}
						handleToggleYearPicker={handleToggleYearPicker}
						handleSelectMonth={handleSelectMonth}
						handleSelectYear={handleSelectYear}
						handleShiftVisibleYear={handleShiftVisibleYear}
						handleSelectDate={handleSelectDate}
						handleSelectToday={handleSelectToday}
						isDateDisabled={isDateDisabled}
						isMonthDisabled={isMonthDisabled}
						isYearDisabled={isYearDisabled}
						isDateSelected={isDateSelected}
						isToday={isToday}
						getCalendarDays={getCalendarDays}
					/>
				</div>
				<DateTimePickerTimeColumns />
			</div>
			<div data-slot='date-time-picker-footer'>
				<button type='button' data-slot='date-time-picker-clear' onClick={handleClear}>
					{clearLabel}
				</button>
				<button
					type='button'
					data-slot='date-time-picker-today'
					disabled={isDateDisabled(startOfDay(new Date()))}
					onClick={handleSelectToday}
				>
					{todayLabel}
				</button>
			</div>
		</div>
	)

	if (isMobile) {
		return (
			<AdaptiveDialog
				open={isOpen}
				onOpenChange={handleOpenChange}
				title={placeholder}
				isMobileCondition={true}
			>
				<AdaptiveDialog.Content>{panel}</AdaptiveDialog.Content>
			</AdaptiveDialog>
		)
	}

	return (
		<Popover.Content hasPanel={false} className={cn(className)}>
			{panel}
		</Popover.Content>
	)
}

DateTimePickerPopover.displayName = DATE_TIME_PICKER_DISPLAY_NAMES.POPOVER
