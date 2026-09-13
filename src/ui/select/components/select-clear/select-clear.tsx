'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import type { MouseEvent, PointerEvent, ReactElement } from 'react'
import { SELECT_DISPLAY_NAMES } from '../../constants/select.constants'
import { useSelectContext } from '../../context/select-context'
import type { ISelectClearProps } from '../../types/i-select-props'

const ClearIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 16 16'
			width='16'
			height='16'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M4 4l8 8M12 4l-8 8'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
		</svg>
	)
}

export const SelectClear = ({
	className,
	variant: variantProp,
}: ISelectClearProps): ReactElement | null => {
	const {
		isClearable,
		isDisabled,
		selectedItems,
		handleClear,
		variant: contextVariant,
	} = useSelectContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')

	if (!isClearable || isDisabled || selectedItems.length === 0) {
		return null
	}

	const stopTriggerToggle = (
		event: MouseEvent<HTMLSpanElement> | PointerEvent<HTMLSpanElement>,
	): void => {
		event.preventDefault()
		event.stopPropagation()
	}

	return (
		<span
			data-slot='select-clear'
			data-variant={variant}
			role='button'
			tabIndex={-1}
			aria-label='Очистить'
			className={cn(className)}
			onPointerDown={stopTriggerToggle}
			onClick={(event) => {
				stopTriggerToggle(event)
				handleClear()
			}}
		>
			<ClearIcon />
		</span>
	)
}

SelectClear.displayName = SELECT_DISPLAY_NAMES.CLEAR
