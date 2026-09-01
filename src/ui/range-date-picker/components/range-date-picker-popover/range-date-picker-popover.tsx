'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { CalendarView } from '@/ui/calendar/components/calendar-view/calendar-view'
import { startOfDay } from '@/ui/date-picker/utils/date-picker-date.util'
import { Popover } from '@/ui/popover/popover'
import type { ReactNode } from 'react'
import { RANGE_DATE_PICKER_DISPLAY_NAMES } from '../../constants/range-date-picker.constants'
import { useRangeDatePickerContext } from '../../context/range-date-picker-context'
import type { IRangeDatePickerPopoverProps } from '../../types/i-range-date-picker-props'

export const RangeDatePickerPopover = ({
	className,
	variant: variantProp,
}: IRangeDatePickerPopoverProps): ReactNode => {
	const {
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

	return (
		<Popover.Content hasPanel={false} className={cn(className)}>
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
		</Popover.Content>
	)
}

RangeDatePickerPopover.displayName = RANGE_DATE_PICKER_DISPLAY_NAMES.POPOVER
