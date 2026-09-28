'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { AdaptiveDialog } from '@/ui/adaptive-dialog/adaptive-dialog'
import { Popover } from '@/ui/popover/popover'
import { TimeColumns } from '@/ui/time-columns/time-columns'
import type { ReactNode } from 'react'

import { TIME_PICKER_DISPLAY_NAMES } from '../constants/time-picker.constants'
import { useTimePickerContext } from '../context/time-picker-context'
import type { ITimePickerPopoverProps } from '../types/i-time-picker-props'

export const TimePickerPopover = ({
	className,
}: ITimePickerPopoverProps): ReactNode => {
	const {
		placeholder,
		isOpen,
		isMobile,
		hour,
		minute,
		stepMinutes,
		handleOpenChange,
		handleSelectHour,
		handleSelectMinute,
		variant: contextVariant,
	} = useTimePickerContext()
	const variant = resolveChildSlotVariant(undefined, contextVariant, 'default')

	const panel = (
		<div
			data-slot='time-picker-panel'
			data-mobile={isMobile ? '' : undefined}
			data-variant={variant}
			className={cn(className)}
		>
			<div data-slot='time-picker-panel-body'>
				<TimeColumns
					hour={hour}
					minute={minute}
					isOpen={isOpen}
					isMobile={isMobile}
					stepMinutes={stepMinutes}
					onSelectHour={handleSelectHour}
					onSelectMinute={handleSelectMinute}
				/>
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

TimePickerPopover.displayName = TIME_PICKER_DISPLAY_NAMES.POPOVER
