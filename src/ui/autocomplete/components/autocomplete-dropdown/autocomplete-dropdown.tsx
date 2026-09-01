'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { Popover } from '@/ui/popover/popover'
import { Spinner } from '@/ui/spinner/spinner'
import type { ReactNode } from 'react'
import { AUTOCOMPLETE_DISPLAY_NAMES } from '../../constants/autocomplete.constants'
import { useAutocompleteContext } from '../../context/autocomplete-context'
import type { IAutocompleteDropdownProps } from '../../types/i-autocomplete-props'
import { AutocompleteOption } from '../autocomplete-option/autocomplete-option'

export const AutocompleteDropdown = ({
	className,
	variant: variantProp,
}: IAutocompleteDropdownProps): ReactNode => {
	const {
		filteredOptions,
		isLoading,
		loadingLabel,
		noResultsLabel,
		listboxId,
		minDropdownWidth,
		isOptionSelected,
		handleSelect,
		variant: contextVariant,
	} = useAutocompleteContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')

	return (
		<Popover.Content
			hasPanel={false}
			initialFocus={false}
			finalFocus={false}
			className={cn(className)}
			style={
				minDropdownWidth > 0 ? { minWidth: minDropdownWidth } : undefined
			}
		>
			<div
				data-slot='autocomplete-dropdown'
				data-variant={variant}
				id={listboxId}
				role='listbox'
			>
				{isLoading ? (
					<div data-slot='autocomplete-loading'>
						<Spinner size='sm' />
						<span>{loadingLabel}</span>
					</div>
				) : null}

				{!isLoading && filteredOptions.length === 0 ? (
					<div data-slot='autocomplete-empty'>{noResultsLabel}</div>
				) : null}

				{!isLoading
					? filteredOptions.map((option) => (
							<AutocompleteOption
								key={String(option.value)}
								option={option}
								isSelected={isOptionSelected(option)}
								onSelect={handleSelect}
							/>
						))
					: null}
			</div>
		</Popover.Content>
	)
}

AutocompleteDropdown.displayName = AUTOCOMPLETE_DISPLAY_NAMES.DROPDOWN
