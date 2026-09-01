'use client'

import { cn } from '@/core/cn'
import { useMemo, type ReactElement } from 'react'
import { Popover } from '../popover/popover'
import { AutocompleteDropdown } from './components/autocomplete-dropdown/autocomplete-dropdown'
import { AutocompleteInput } from './components/autocomplete-input/autocomplete-input'
import {
	AUTOCOMPLETE_DISPLAY_NAMES,
	AUTOCOMPLETE_DROPDOWN_OFFSET_PX,
} from './constants/autocomplete.constants'
import { AutocompleteContext } from './context/autocomplete-context'
import { useAutocomplete } from './hooks/use-autocomplete'
import type { IAutocompleteContextValue } from './types/i-autocomplete-context-value'
import type {
	IAutocompleteProps,
	TAutocompleteComponent,
} from './types/i-autocomplete-props'

export type {
	IAutocompleteDropdownProps,
	IAutocompleteInputProps,
	IAutocompleteOption,
	IAutocompleteOptionItemProps,
	IAutocompleteProps,
	TAutocompleteSize,
	TAutocompleteVariant,
} from './types/i-autocomplete-props'

const AutoCompleteRoot = <T extends string | number = string>(
	props: IAutocompleteProps<T>,
): ReactElement => {
	const {
		options,
		children,
		placeholder = 'Начните вводить...',
		size = 'md',
		variant = 'default',
		className,
		error,
		label,
		isLoading = false,
		loadingLabel = 'Загрузка...',
		noResultsLabel = 'Ничего не найдено',
		value,
	} = props

	const {
		isOpen,
		isDisabled,
		inputValue,
		filteredOptions,
		minDropdownWidth,
		isOptionSelected,
		handleInputChange,
		handleInputFocus,
		handleInputBlur,
		handleOpenChange,
		handleSelect,
		listboxId,
	} = useAutocomplete(props)

	const visualVariant = variant === 'unstyled' ? 'default' : variant

	const contextValue = useMemo<IAutocompleteContextValue>(
		() => ({
			options,
			filteredOptions,
			inputValue,
			isOpen,
			isDisabled,
			isLoading,
			selectedValue: value,
			placeholder,
			loadingLabel,
			noResultsLabel,
			size,
			variant: visualVariant,
			minDropdownWidth,
			isOptionSelected,
			handleInputChange,
			handleInputFocus,
			handleInputBlur,
			listboxId,
			handleSelect,
		}),
		[
			options,
			filteredOptions,
			inputValue,
			isOpen,
			isDisabled,
			isLoading,
			value,
			placeholder,
			loadingLabel,
			noResultsLabel,
			size,
			visualVariant,
			minDropdownWidth,
			isOptionSelected,
			handleInputChange,
			handleInputFocus,
			handleInputBlur,
			listboxId,
			handleSelect,
		],
	)

	return (
		<AutocompleteContext.Provider value={contextValue}>
			<div
				data-slot='autocomplete'
				data-variant={variant}
				data-disabled={isDisabled ? '' : undefined}
				data-invalid={error ? '' : undefined}
				data-open={isOpen ? '' : undefined}
				className={cn(className)}
			>
				{label ? (
					<label data-slot='autocomplete-label'>{label}</label>
				) : null}

				<Popover
					open={isOpen}
					onOpenChange={handleOpenChange}
					placement='bottom-start'
					offset={AUTOCOMPLETE_DROPDOWN_OFFSET_PX}
				>
					{children ?? (
						<>
							<AutocompleteInput />
							<AutocompleteDropdown />
						</>
					)}
				</Popover>

				{error ? (
					<p data-slot='autocomplete-error' role='alert'>
						{error}
					</p>
				) : null}
			</div>
		</AutocompleteContext.Provider>
	)
}

AutoCompleteRoot.displayName = AUTOCOMPLETE_DISPLAY_NAMES.ROOT

/**
 * Поиск с подсказками: фильтрует `options` по вводу. Значение — `value` опции.
 *
 * @example
 * ```tsx
 * <AutoComplete
 *   label="Станция"
 *   options={stations}
 *   value={stationId}
 *   onChange={setStationId}
 *   placeholder="Начните вводить..."
 * />
 * ```
 */
export const AutoComplete: TAutocompleteComponent = Object.assign(
	AutoCompleteRoot,
	{
		Input: AutocompleteInput,
		Dropdown: AutocompleteDropdown,
		Root: AutoCompleteRoot,
	},
)
