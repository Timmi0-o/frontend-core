'use client'

import { useCallback, useMemo, useState } from 'react'
import { SELECT_DROPDOWN_MIN_WIDTH_PX } from '../constants/select.constants'
import type { TSelectValue } from '../types/i-select-context-value'
import type {
	ISelectMultiselectProps,
	ISelectOption,
	ISelectProps,
	ISelectSingleProps,
} from '../types/i-select-props'
import { getSelectTriggerLabel } from '../utils/get-select-trigger-label'

export const useSelect = <T extends string | number>(props: ISelectProps<T>) => {
	const {
		options,
		isLoading = false,
		minDropdownWidth = SELECT_DROPDOWN_MIN_WIDTH_PX,
	} = props

	const selectionMode = props.selectionMode ?? 'single'
	const isMultiselect = selectionMode === 'multiselect'
	const isDisabled = props.isDisabled === true || isLoading

	const [isOpen, setIsOpen] = useState(false)

	const valueSingle = !isMultiselect
		? ((props as ISelectSingleProps<T>).value ?? null)
		: undefined
	const valueMulti: T[] | undefined = isMultiselect
		? ((props as ISelectMultiselectProps<T>).value ?? [])
		: undefined

	const selectedSingle = useMemo(
		() =>
			valueSingle !== undefined
				? (options.find((option) => option.value === valueSingle) ?? null)
				: null,
		[options, valueSingle],
	)

	const selectedOptionsMulti = useMemo(
		() =>
			valueMulti !== undefined
				? options.filter((option) => valueMulti.includes(option.value))
				: [],
		[options, valueMulti],
	)

	const selectedItems = useMemo(
		() =>
			isMultiselect
				? selectedOptionsMulti
				: selectedSingle
					? [selectedSingle]
					: [],
		[isMultiselect, selectedOptionsMulti, selectedSingle],
	)

	const triggerLabel = useMemo(
		() =>
			getSelectTriggerLabel({
				isMultiselect,
				selectedSingle,
				selectedOptionsMulti,
			}),
		[isMultiselect, selectedSingle, selectedOptionsMulti],
	)

	const isOptionSelected = useCallback(
		(option: ISelectOption<TSelectValue>): boolean => {
			const selectedValue = option.value as T

			if (isMultiselect && valueMulti) {
				return valueMulti.includes(selectedValue)
			}

			return selectedSingle?.value === selectedValue
		},
		[isMultiselect, valueMulti, selectedSingle],
	)

	const handleSelect = useCallback(
		(option: ISelectOption<TSelectValue>): void => {
			if (option.disabled) {
				return
			}

			const selectedValue = option.value as T

			if (isMultiselect && props.onChange) {
				const current = valueMulti ?? []
				const next = current.includes(selectedValue)
					? current.filter((value) => value !== selectedValue)
					: [...current, selectedValue]

				;(props.onChange as (value: T[]) => void)(next)
				return
			}

			if (!isMultiselect && props.onChange) {
				;(props.onChange as (value: T | null) => void)(selectedValue)
				setIsOpen(false)
			}
		},
		[isMultiselect, props, valueMulti],
	)

	return {
		isOpen,
		setIsOpen,
		isMultiselect,
		isDisabled,
		minDropdownWidth,
		selectedItems,
		triggerLabel,
		isOptionSelected,
		handleSelect,
	}
}
