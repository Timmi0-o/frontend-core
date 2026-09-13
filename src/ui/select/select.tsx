'use client'

import { cn } from '@/core/cn'
import { useMemo, type ReactElement } from 'react'
import { Popover } from '../popover/popover'
import { SelectClear } from './components/select-clear/select-clear'
import { SelectDropdown } from './components/select-dropdown/select-dropdown'
import { SelectIndicator } from './components/select-indicator/select-indicator'
import { SelectLabel } from './components/select-label/select-label'
import { SelectOption } from './components/select-option/select-option'
import { SelectTrigger } from './components/select-trigger/select-trigger'
import { SelectValue } from './components/select-value/select-value'
import {
	SELECT_DISPLAY_NAMES,
	SELECT_DROPDOWN_OFFSET_PX,
} from './constants/select.constants'
import { SelectContext } from './context/select-context'
import { splitSelectLabelFromChildren } from './helpers/split-select-label-from-children'
import { useSelect } from './hooks/use-select'
import type { ISelectContextValue } from './types/i-select-context-value'
import type {
	ISelectProps,
	TSelectComponent,
	TSelectSelectionMode,
	TSelectTone,
	TSelectVariant,
} from './types/i-select-props'

export type {
	ISelectClearProps,
	ISelectDropdownProps,
	ISelectIndicatorProps,
	ISelectLabelProps,
	ISelectMultiselectProps,
	ISelectOption,
	ISelectOptionItemProps,
	ISelectOptionRenderParams,
	ISelectProps,
	ISelectSingleProps,
	ISelectValueProps,
	ISelectValueRenderParams,
	ISelectValueState,
	TSelectSelectionMode,
	TSelectSize,
	TSelectTone,
	TSelectVariant,
} from './types/i-select-props'

export type SelectVariant = TSelectVariant
export type SelectTone = TSelectTone
export type SelectSelectionMode = TSelectSelectionMode

const SelectRoot = <T extends string | number = string>(
	props: ISelectProps<T>,
): ReactElement => {
	const {
		options,
		children,
		placeholder = 'Выберите элемент...',
		size = 'md',
		variant = 'default',
		tone = 'default',
		className,
		error,
		label,
		isLoading = false,
		loadingLabel = 'Загрузка...',
		indicatorIcon,
	} = props

	const {
		isOpen,
		setIsOpen,
		isMultiselect,
		isDisabled,
		isClearable,
		minDropdownWidth,
		selectedItems,
		triggerLabel,
		isOptionSelected,
		handleSelect,
		handleClear,
	} = useSelect(props)

	const visualVariant = variant === 'unstyled' ? 'default' : variant

	const contextValue = useMemo<ISelectContextValue>(
		() => ({
			options,
			selectedItems,
			isOpen,
			isMultiselect,
			isDisabled,
			isClearable,
			isLoading,
			triggerLabel,
			placeholder,
			loadingLabel,
			size,
			variant: visualVariant,
			tone,
			indicatorIcon,
			minDropdownWidth,
			isOptionSelected,
			handleSelect,
			handleClear,
			fieldLabel: label,
		}),
		[
			options,
			selectedItems,
			isOpen,
			isMultiselect,
			isDisabled,
			isClearable,
			isLoading,
			triggerLabel,
			placeholder,
			loadingLabel,
			size,
			visualVariant,
			tone,
			indicatorIcon,
			minDropdownWidth,
			isOptionSelected,
			handleSelect,
			handleClear,
			label,
		],
	)

	const { labelSlots, rest: popoverChildren } =
		splitSelectLabelFromChildren(children)

	return (
		<SelectContext.Provider value={contextValue}>
			<div
				data-slot='select'
				data-variant={variant}
				data-disabled={isDisabled ? '' : undefined}
				data-invalid={error ? '' : undefined}
				data-open={isOpen ? '' : undefined}
				className={cn(className)}
			>
				{labelSlots.length > 0 ? labelSlots : label ? <SelectLabel /> : null}

				<Popover
					open={isOpen}
					onOpenChange={(isNextOpen) => {
						if (isDisabled) {
							return
						}

						setIsOpen(isNextOpen)
					}}
					placement='bottom-start'
					offset={SELECT_DROPDOWN_OFFSET_PX}
				>
					{popoverChildren ?? (
						<>
							<SelectTrigger>
								<SelectValue />
								<SelectClear />
								<SelectIndicator />
							</SelectTrigger>
							<SelectDropdown />
						</>
					)}
				</Popover>

				{error ? (
					<p data-slot='select-error' role='alert'>
						{error}
					</p>
				) : null}
			</div>
		</SelectContext.Provider>
	)
}

SelectRoot.displayName = SELECT_DISPLAY_NAMES.ROOT

/**
 * Выпадающий список. Single: `value` + `onChange`. Несколько значений: `selectionMode="multiselect"`.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Документ"
 *   placeholder="Выберите"
 *   options={[
 *     { label: 'Паспорт', value: 'passport' },
 *     { label: 'Загранпаспорт', value: 'foreign' },
 *   ]}
 *   isClearable
 *   value={documentType}
 *   onChange={setDocumentType}
 *   onClear={() => setDocumentType(null)}
 *   error={error}
 * />
 *
 * <Select
 *   selectionMode="multiselect"
 *   options={options}
 *   value={selectedIds}
 *   onChange={setSelectedIds}
 * />
 * ```
 */
export const Select: TSelectComponent = Object.assign(SelectRoot, {
	Label: SelectLabel,
	Trigger: SelectTrigger,
	Value: SelectValue,
	Indicator: SelectIndicator,
	Clear: SelectClear,
	Dropdown: SelectDropdown,
	Option: SelectOption,
	Root: SelectRoot,
})
