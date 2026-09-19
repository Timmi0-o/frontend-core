'use client'

import type { ReactNode } from 'react'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { AdaptiveDialog } from '@/ui/adaptive-dialog/adaptive-dialog'
import { CalendarView } from '@/ui/calendar/components/calendar-view/calendar-view'
import { startOfDay } from '@/ui/date-picker/utils/date-picker-date.util'
import { Popover } from '@/ui/popover/popover'
import { RANGE_DATE_PICKER_DISPLAY_NAMES } from '../../constants/range-date-picker.constants'
import { useRangeDatePickerContext } from '../../context/range-date-picker-context'
import type { IRangeDatePickerPopoverProps } from '../../types/i-range-date-picker-props'

export const RangeDatePickerPopover = ({
	className,
	variant: variantProp,
}: IRangeDatePickerPopoverProps): ReactNode => {
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
		variant: contextVariant,
	} = useRangeDatePickerContext()
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
			isDateRangeStart={isDateRangeStart}
			isDateRangeEnd={isDateRangeEnd}
			isDateInRange={isDateInRange}
			onDayPointerEnter={handleDayPointerEnter}
			onDayPointerLeave={handleDayPointerLeave}
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

RangeDatePickerPopover.displayName = RANGE_DATE_PICKER_DISPLAY_NAMES.POPOVER
