'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import type { ReactElement } from 'react'
import { SELECT_DISPLAY_NAMES } from '../../constants/select.constants'
import { useSelectContext } from '../../context/select-context'
import { renderSelectSlot } from '../../helpers/render-select-slot'
import type { ISelectValueProps } from '../../types/i-select-props'

export const SelectValue = ({
	className,
	variant: variantProp,
	children,
}: ISelectValueProps): ReactElement => {
	const {
		selectedItems,
		triggerLabel,
		placeholder,
		isLoading,
		loadingLabel,
		variant: contextVariant,
	} = useSelectContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')
	const isPlaceholder = !isLoading && selectedItems.length === 0
	const defaultChildren = isLoading
		? loadingLabel
		: isPlaceholder
			? placeholder
			: triggerLabel

	return (
		<span
			data-slot='select-value'
			data-variant={variant}
			data-placeholder={isPlaceholder ? '' : undefined}
			data-rich={children != null ? '' : undefined}
			className={cn(className)}
		>
			{renderSelectSlot(
				children,
				{
					defaultChildren,
					isPlaceholder,
					state: { selectedItems },
				},
				defaultChildren,
			)}
		</span>
	)
}

SelectValue.displayName = SELECT_DISPLAY_NAMES.VALUE
