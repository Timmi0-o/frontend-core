'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import type { ReactElement, ReactNode } from 'react'
import { SELECT_DISPLAY_NAMES } from '../../constants/select.constants'
import { useSelectContext } from '../../context/select-context'
import type { ISelectIndicatorProps } from '../../types/i-select-props'

const DefaultChevronIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 16 16'
			width='16'
			height='16'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M4 6l4 4 4-4'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

export const SelectIndicator = ({
	className,
	icon: iconProp,
	variant: variantProp,
}: ISelectIndicatorProps): ReactElement | null => {
	const { isLoading, isOpen, indicatorIcon, variant: contextVariant } =
		useSelectContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')

	if (isLoading) {
		return null
	}

	const resolvedIcon: ReactNode =
		iconProp ?? indicatorIcon ?? <DefaultChevronIcon />

	return (
		<span
			data-slot='select-indicator'
			data-variant={variant}
			data-open={isOpen ? '' : undefined}
			className={cn(className)}
			aria-hidden
		>
			{resolvedIcon}
		</span>
	)
}

SelectIndicator.displayName = SELECT_DISPLAY_NAMES.INDICATOR
