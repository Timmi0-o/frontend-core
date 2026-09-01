'use client'

import type { ReactNode } from 'react'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { AdaptiveDialog } from '@/ui/adaptive-dialog/adaptive-dialog'
import { CalendarView } from '@/ui/calendar/components/calendar-view/calendar-view'
import { Popover } from '@/ui/popover/popover'

import { DATE_PICKER_DISPLAY_NAMES } from '../../constants/date-picker.constants'
import { useDatePickerContext } from '../../context/date-picker-context'
import type { IDatePickerPopoverProps } from '../../types/i-date-picker-props'
import { startOfDay } from '../../utils/date-picker-date.util'

export const DatePickerPopover = ({
	className,
	variant: variantProp,
}: IDatePickerPopoverProps): ReactNode => {
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
		variant: contextVariant,
	} = useDatePickerContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')

	const calendarView = (
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
			showTodayAction
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
	)

	if (isMobile) {
		return (
			<AdaptiveDialog
				open={isOpen}
				onOpenChange={handleOpenChange}
				title={placeholder}
				isMobileCondition={true}
			>
				<AdaptiveDialog.Content className={cn(className)}>
					{calendarView}
				</AdaptiveDialog.Content>
			</AdaptiveDialog>
		)
	}

	return (
		<Popover.Content hasPanel={false} className={cn(className)}>
			{calendarView}
		</Popover.Content>
	)
}

DatePickerPopover.displayName = DATE_PICKER_DISPLAY_NAMES.POPOVER
