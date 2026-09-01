'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { Popover } from '@/ui/popover/popover'
import type { ReactNode } from 'react'
import { SELECT_DISPLAY_NAMES } from '../../constants/select.constants'
import { useSelectContext } from '../../context/select-context'
import type { ISelectDropdownProps } from '../../types/i-select-props'
import { SelectOption } from '../select-option/select-option'

export const SelectDropdown = ({
	className,
	variant: variantProp,
	children,
}: ISelectDropdownProps): ReactNode => {
	const { options, isMultiselect, minDropdownWidth, variant: contextVariant } =
		useSelectContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')

	return (
		<Popover.Content
			hasPanel={false}
			className={cn(className)}
			style={minDropdownWidth > 0 ? { minWidth: minDropdownWidth } : undefined}
		>
			<div
				data-slot='select-dropdown'
				data-variant={variant}
				data-multiselect={isMultiselect ? '' : undefined}
				role='listbox'
			>
				{children ??
					options.map((option) => (
						<SelectOption key={String(option.value)} option={option} />
					))}
			</div>
		</Popover.Content>
	)
}

SelectDropdown.displayName = SELECT_DISPLAY_NAMES.DROPDOWN
