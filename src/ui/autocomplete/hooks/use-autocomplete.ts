'use client'

import type { IPopoverOpenChangeDetails } from '@/ui/popover/types/i-popover-props'
import { useCallback, useId, useMemo, useState, type ChangeEvent, type FocusEvent } from 'react'
import { AUTOCOMPLETE_DROPDOWN_MIN_WIDTH_PX } from '../constants/autocomplete.constants'
import type { TAutocompleteValue } from '../types/i-autocomplete-context-value'
import type {
	IAutocompleteOption,
	IAutocompleteProps,
} from '../types/i-autocomplete-props'
import { filterAutocompleteOptions } from '../utils/filter-autocomplete-options'
import { isAutocompleteFieldPress } from '../utils/is-autocomplete-field-press'

export const useAutocomplete = <T extends string | number>(
	props: IAutocompleteProps<T>,
) => {
	const {
		options,
		value,
		onChange,
		onInputValueChange,
		inputValue: inputValueProp,
		isLoading = false,
		minDropdownWidth = AUTOCOMPLETE_DROPDOWN_MIN_WIDTH_PX,
		filterOptions = filterAutocompleteOptions,
	} = props

	const isDisabled = props.isDisabled === true || isLoading
	const isInputControlled = inputValueProp !== undefined

	const [isOpen, setIsOpen] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [query, setQuery] = useState('')
	const listboxId = useId()

	const selectedOption = useMemo(
		() => options.find((option) => option.value === value) ?? null,
		[options, value],
	)

	const fallbackInputValue =
		isFocused || !selectedOption ? query : selectedOption.label
	const inputValue = isInputControlled ? inputValueProp : fallbackInputValue

	const filteredOptions = useMemo(
		() => filterOptions(options, inputValue ?? ''),
		[filterOptions, inputValue, options],
	)

	const setInputValue = useCallback(
		(nextValue: string): void => {
			if (!isInputControlled) {
				setQuery(nextValue)
			}

			onInputValueChange?.(nextValue)
		},
		[isInputControlled, onInputValueChange],
	)

	const handleInputChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>): void => {
			const nextValue = event.target.value

			setInputValue(nextValue)
			onChange?.(null)
			setIsOpen(true)
		},
		[onChange, setInputValue],
	)

	const handleInputFocus = useCallback((): void => {
		if (isDisabled) {
			return
		}

		setIsFocused(true)

		if (selectedOption) {
			setQuery(selectedOption.label)
		}

		setIsOpen(true)
	}, [isDisabled, selectedOption])

	const handleInputBlur = useCallback(
		(event: FocusEvent<HTMLInputElement>): void => {
			const nextTarget = event.relatedTarget

			if (
				nextTarget instanceof Node &&
				document.getElementById(listboxId)?.contains(nextTarget)
			) {
				return
			}

			setIsFocused(false)
			setIsOpen(false)
		},
		[listboxId],
	)

	/**
	 * Закрывает список по сигналу Popover, кроме клика по самому полю:
	 * этот клик открывает combobox и сразу приходит как outside-press.
	 */
	const handleOpenChange = useCallback(
		(isNextOpen: boolean, details?: IPopoverOpenChangeDetails): void => {
			if (isDisabled || isNextOpen) {
				return
			}

			if (
				details?.reason === 'outside-press' &&
				isAutocompleteFieldPress(details.event)
			) {
				details.cancel?.()
				return
			}

			setIsOpen(false)
		},
		[isDisabled],
	)

	const handleSelect = useCallback(
		(option: IAutocompleteOption<TAutocompleteValue>): void => {
			if (option.disabled) {
				return
			}

			onChange?.(option.value as T)
			setQuery(option.label)
			setIsFocused(false)
			setIsOpen(false)
		},
		[onChange],
	)

	const isOptionSelected = useCallback(
		(option: IAutocompleteOption<TAutocompleteValue>): boolean =>
			option.value === value,
		[value],
	)

	return {
		isOpen,
		isDisabled,
		inputValue,
		selectedOption,
		filteredOptions,
		minDropdownWidth,
		isOptionSelected,
		handleInputChange,
		handleInputFocus,
		handleInputBlur,
		handleOpenChange,
		handleSelect,
		listboxId,
	}
}
