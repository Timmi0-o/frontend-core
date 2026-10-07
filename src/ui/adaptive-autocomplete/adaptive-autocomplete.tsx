'use client'

import { cn } from '@/core/cn'
import { useMobileCondition, type TMobileCondition } from '@/hooks/use-mobile-condition'
import { AdaptiveDialog } from '@/ui/adaptive-dialog/adaptive-dialog'
import { Spinner } from '@/ui/spinner/spinner'
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'

import { AutocompleteOption } from '../autocomplete/components/autocomplete-option/autocomplete-option'
import { AutoComplete } from '../autocomplete/autocomplete'
import { AutocompleteContext } from '../autocomplete/context/autocomplete-context'
import { useAutocomplete } from '../autocomplete/hooks/use-autocomplete'
import type { IAutocompleteContextValue } from '../autocomplete/types/i-autocomplete-context-value'
import type {
	IAutocompleteOption,
	IAutocompleteProps,
} from '../autocomplete/types/i-autocomplete-props'

export type IAdaptiveAutocompleteProps<T extends string | number = string> =
	IAutocompleteProps<T> & {
		isMobileCondition?: TMobileCondition
	}

const AdaptiveAutocompleteSheet = <T extends string | number = string>(
	props: IAutocompleteProps<T>,
): ReactElement => {
	const {
		options,
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

	const [isSheetOpen, setIsSheetOpen] = useState(false)
	const searchRef = useRef<HTMLInputElement>(null)

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
		handleSelect,
		listboxId,
	} = useAutocomplete(props)

	const visualVariant = variant === 'unstyled' ? 'default' : variant
	const sheetTitle = label || placeholder
	const selectedOption = options.find((option) => option.value === value) ?? null
	const triggerLabel = selectedOption?.label ?? ''

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

	const handleSheetSelect = (option: IAutocompleteOption<string | number>): void => {
		handleSelect(option)
		setIsSheetOpen(false)
	}

	useEffect(() => {
		if (!isSheetOpen) {
			return
		}

		const frame = requestAnimationFrame(() => {
			searchRef.current?.focus()
		})

		return () => {
			cancelAnimationFrame(frame)
		}
	}, [isSheetOpen])

	return (
		<AutocompleteContext.Provider value={contextValue}>
			<div
				data-slot='autocomplete'
				data-variant={variant}
				data-disabled={isDisabled ? '' : undefined}
				data-invalid={error ? '' : undefined}
				data-open={isSheetOpen ? '' : undefined}
				className={cn(className)}
			>
				{label ? (
					<label data-slot='autocomplete-label'>{label}</label>
				) : null}

				<button
					type='button'
					disabled={isDisabled}
					data-slot='autocomplete-input'
					data-adaptive-trigger=''
					data-size={size}
					data-variant={visualVariant}
					data-disabled={isDisabled ? '' : undefined}
					data-empty={triggerLabel ? undefined : ''}
					aria-haspopup='dialog'
					aria-expanded={isSheetOpen}
					aria-label={placeholder}
					onClick={() => {
						if (isDisabled) {
							return
						}

						setIsSheetOpen(true)
					}}
				>
					{triggerLabel || placeholder}
				</button>

				<AdaptiveDialog
					open={isSheetOpen}
					onOpenChange={setIsSheetOpen}
					title={sheetTitle}
					isMobileCondition={true}
					height='auto'
				>
					<AdaptiveDialog.Content>
						<AdaptiveDialog.Header>
							<AdaptiveDialog.Title>{sheetTitle}</AdaptiveDialog.Title>
						</AdaptiveDialog.Header>
						<div data-slot='adaptive-autocomplete-sheet'>
							<input
								ref={searchRef}
								type='text'
								value={inputValue}
								placeholder={placeholder}
								autoComplete='off'
								data-slot='autocomplete-input'
								data-size={size}
								data-variant={visualVariant}
								aria-controls={listboxId}
								aria-autocomplete='list'
								onChange={handleInputChange}
								onFocus={handleInputFocus}
							/>
							<div
								id={listboxId}
								role='listbox'
								data-slot='autocomplete-dropdown-list'
								data-vaul-no-drag=''
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
													onSelect={handleSheetSelect}
												/>
											))
										: null}
								</div>
							</div>
						</AdaptiveDialog.Content>
					</AdaptiveDialog>

				{error ? (
					<p data-slot='autocomplete-error' role='alert'>
						{error}
					</p>
				) : null}
			</div>
		</AutocompleteContext.Provider>
	)
}

const AdaptiveAutocompleteRoot = <T extends string | number = string>({
	isMobileCondition,
	...autocompleteProps
}: IAdaptiveAutocompleteProps<T>): ReactElement => {
	const isMobile = useMobileCondition(isMobileCondition)

	if (!isMobile) {
		return <AutoComplete {...autocompleteProps} />
	}

	return <AdaptiveAutocompleteSheet {...autocompleteProps} />
}

AdaptiveAutocompleteRoot.displayName = 'AdaptiveAutocomplete'

/**
 * Тот же контракт, что у `AutoComplete`.
 * На десктопе — поле с выпадающим списком, на мобилке — шторка с поиском.
 * Порог по умолчанию: max-width 1024px. `isMobileCondition` — boolean или media query.
 *
 * @example
 * ```tsx
 * <AdaptiveAutocomplete
 *   label="Город"
 *   options={cities}
 *   value={cityId}
 *   onChange={setCityId}
 *   inputValue={query}
 *   onInputValueChange={setQuery}
 * />
 * ```
 */
export const AdaptiveAutocomplete = AdaptiveAutocompleteRoot
