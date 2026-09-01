'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { Popover } from '@/ui/popover/popover'
import type { ReactElement } from 'react'
import { AUTOCOMPLETE_DISPLAY_NAMES } from '../../constants/autocomplete.constants'
import { useAutocompleteContext } from '../../context/autocomplete-context'
import type { IAutocompleteInputProps } from '../../types/i-autocomplete-props'

export const AutocompleteInput = ({
	className,
	variant: variantProp,
	...rest
}: IAutocompleteInputProps): ReactElement => {
	const {
		isOpen,
		isDisabled,
		isLoading,
		inputValue,
		placeholder,
		size,
		variant: contextVariant,
		handleInputChange,
		handleInputFocus,
		handleInputBlur,
		listboxId,
	} = useAutocompleteContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')

	return (
		<Popover.Anchor>
			<div>
				<input
					{...rest}
					type='text'
					value={inputValue}
					disabled={isDisabled}
					autoComplete='off'
					placeholder={placeholder}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					onBlur={handleInputBlur}
					data-slot='autocomplete-input'
					data-size={size}
					data-variant={variant}
					data-disabled={isDisabled ? '' : undefined}
					data-loading={isLoading ? '' : undefined}
					data-open={isOpen ? '' : undefined}
					className={cn(className)}
					role='combobox'
					aria-busy={isLoading}
					aria-expanded={isOpen}
					aria-controls={isOpen ? listboxId : undefined}
					aria-autocomplete='list'
					aria-label={placeholder}
				/>
			</div>
		</Popover.Anchor>
	)
}

AutocompleteInput.displayName = AUTOCOMPLETE_DISPLAY_NAMES.INPUT
