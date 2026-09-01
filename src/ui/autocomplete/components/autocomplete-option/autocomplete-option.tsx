'use client'

import { resolveChildSlotVariant } from '@/core/slot-variant'
import type { ReactElement } from 'react'
import { useAutocompleteContext } from '../../context/autocomplete-context'
import type { IAutocompleteOptionItemProps } from '../../types/i-autocomplete-props'

export const AutocompleteOption = ({
	option,
	isSelected,
	onSelect,
	variant: variantProp,
}: IAutocompleteOptionItemProps): ReactElement => {
	const { variant: contextVariant } = useAutocompleteContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')

	const handleSelect = (): void => {
		onSelect(option)
	}

	return (
		<button
			type='button'
			role='option'
			aria-selected={isSelected}
			disabled={option.disabled}
			data-slot='autocomplete-option'
			data-variant={variant}
			data-selected={isSelected ? '' : undefined}
			data-disabled={option.disabled ? '' : undefined}
			onMouseDown={(event) => {
				event.preventDefault()
				handleSelect()
			}}
		>
			<span>{option.label}</span>
		</button>
	)
}
