'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import type { ReactElement } from 'react'
import { SELECT_DISPLAY_NAMES } from '../../constants/select.constants'
import { useSelectContext } from '../../context/select-context'
import type { ISelectLabelProps } from '../../types/i-select-props'

export const SelectLabel = ({
	className,
	variant: variantProp,
	children,
}: ISelectLabelProps): ReactElement | null => {
	const { fieldLabel, variant: contextVariant } = useSelectContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')
	const content = children ?? fieldLabel

	if (content == null || content === '') {
		return null
	}

	return (
		<label
			data-slot='select-label'
			data-variant={variant}
			className={cn(className)}
		>
			{content}
		</label>
	)
}

SelectLabel.displayName = SELECT_DISPLAY_NAMES.LABEL
