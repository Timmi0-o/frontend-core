'use client'

import { cn } from '@/core/cn'
import { useMobileCondition, type TMobileCondition } from '@/hooks/use-mobile-condition'
import { AdaptiveDialog } from '@/ui/adaptive-dialog/adaptive-dialog'
import { Children, isValidElement, useMemo, type ReactElement, type ReactNode } from 'react'

import { SelectClear } from '../select/components/select-clear/select-clear'
import { SelectIndicator } from '../select/components/select-indicator/select-indicator'
import { SelectLabel } from '../select/components/select-label/select-label'
import { SelectOption } from '../select/components/select-option/select-option'
import { SelectValue } from '../select/components/select-value/select-value'
import {
	SelectChromeContext,
	SelectInteractionContext,
	SelectSelectionContext,
} from '../select/context/select-context'
import { SELECT_DISPLAY_NAMES } from '../select/constants/select.constants'
import { useSelect } from '../select/hooks/use-select'
import { Select } from '../select/select'
import type {
	ISelectChromeContextValue,
	ISelectInteractionContextValue,
	ISelectSelectionContextValue,
} from '../select/types/i-select-context-value'
import type { ISelectProps } from '../select/types/i-select-props'

export type IAdaptiveSelectProps<T extends string | number = string> =
	ISelectProps<T> & {
		isMobileCondition?: TMobileCondition
	}

const isReactNode = (value: unknown): value is ReactNode => {
	if (
		value === null ||
		value === undefined ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		typeof value === 'bigint'
	) {
		return true
	}

	if (isValidElement(value)) {
		return true
	}

	if (Array.isArray(value)) {
		return value.every(isReactNode)
	}

	return false
}

const readDropdownOptionSlots = (children: ReactNode): ReactNode => {
	for (const child of Children.toArray(children)) {
		if (
			!isValidElement(child) ||
			typeof child.type === 'string' ||
			!('displayName' in child.type) ||
			child.type.displayName !== SELECT_DISPLAY_NAMES.DROPDOWN
		) {
			continue
		}

		if (
			typeof child.props === 'object' &&
			child.props !== null &&
			'children' in child.props &&
			isReactNode(child.props.children)
		) {
			return child.props.children
		}
	}

	return null
}

const AdaptiveSelectSheet = <T extends string | number = string>(
	props: ISelectProps<T>,
): ReactElement => {
	const {
		options,
		placeholder = 'Выберите элемент...',
		size = 'md',
		variant = 'default',
		tone = 'default',
		className,
		children,
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
	const sheetTitle = label || placeholder
	const optionSlots = readDropdownOptionSlots(children)

	const chromeContextValue = useMemo<ISelectChromeContextValue>(
		() => ({
			options,
			size,
			variant: visualVariant,
			tone,
			placeholder,
			loadingLabel,
			indicatorIcon,
			minDropdownWidth,
			isMultiselect,
			isClearable,
			fieldLabel: label,
		}),
		[
			options,
			size,
			visualVariant,
			tone,
			placeholder,
			loadingLabel,
			indicatorIcon,
			minDropdownWidth,
			isMultiselect,
			isClearable,
			label,
		],
	)

	const interactionContextValue = useMemo<ISelectInteractionContextValue>(
		() => ({
			isOpen,
			isDisabled,
			isLoading,
			handleClear,
		}),
		[isOpen, isDisabled, isLoading, handleClear],
	)

	const selectionContextValue = useMemo<ISelectSelectionContextValue>(
		() => ({
			selectedItems,
			triggerLabel,
			isOptionSelected,
			handleSelect,
		}),
		[selectedItems, triggerLabel, isOptionSelected, handleSelect],
	)

	return (
		<SelectChromeContext.Provider value={chromeContextValue}>
			<SelectInteractionContext.Provider value={interactionContextValue}>
				<SelectSelectionContext.Provider value={selectionContextValue}>
					<div
						data-slot='select'
						data-variant={variant}
						data-disabled={isDisabled ? '' : undefined}
						data-invalid={error ? '' : undefined}
						data-open={isOpen ? '' : undefined}
						className={cn(className)}
					>
						<SelectLabel />

						<button
							type='button'
							disabled={isDisabled}
							data-slot='select-trigger'
							data-size={size}
							data-variant={visualVariant}
							data-tone={tone}
							data-disabled={isDisabled ? '' : undefined}
							data-loading={isLoading ? '' : undefined}
							data-open={isOpen ? '' : undefined}
							data-empty={selectedItems.length === 0 ? '' : undefined}
							aria-haspopup='dialog'
							aria-expanded={isOpen}
							aria-label={isLoading ? loadingLabel : triggerLabel || placeholder}
							onClick={() => {
								if (isDisabled) {
									return
								}

								setIsOpen(true)
							}}
						>
							<SelectValue />
							<SelectClear />
							<SelectIndicator />
						</button>

						<AdaptiveDialog
							open={isOpen}
							onOpenChange={setIsOpen}
							title={sheetTitle}
							isMobileCondition={true}
							height='auto'
						>
							<AdaptiveDialog.Content>
								<AdaptiveDialog.Header>
									<AdaptiveDialog.Title>{sheetTitle}</AdaptiveDialog.Title>
								</AdaptiveDialog.Header>
								<div data-slot='adaptive-select-sheet'>
									<div
										data-slot='select-dropdown-list'
										role='listbox'
										data-vaul-no-drag=''
									>
										{optionSlots ??
											options.map((option) => (
												<SelectOption
													key={String(option.value)}
													option={option}
												/>
											))}
									</div>
								</div>
							</AdaptiveDialog.Content>
						</AdaptiveDialog>

						{error ? (
							<p data-slot='select-error' role='alert'>
								{error}
							</p>
						) : null}
					</div>
				</SelectSelectionContext.Provider>
			</SelectInteractionContext.Provider>
		</SelectChromeContext.Provider>
	)
}

const AdaptiveSelectRoot = <T extends string | number = string>({
	isMobileCondition,
	...selectProps
}: IAdaptiveSelectProps<T>): ReactElement => {
	const isMobile = useMobileCondition(isMobileCondition)

	if (!isMobile) {
		return <Select {...selectProps} />
	}

	return <AdaptiveSelectSheet {...selectProps} />
}

AdaptiveSelectRoot.displayName = 'AdaptiveSelect'

/**
 * Тот же контракт, что у `Select`.
 * На десктопе — выпадающий список, на мобилке — шторка с пунктами.
 * Порог по умолчанию: max-width 1024px. `isMobileCondition` — boolean или media query.
 *
 * @example
 * ```tsx
 * <AdaptiveSelect
 *   label="Город"
 *   options={cities}
 *   value={cityId}
 *   onChange={setCityId}
 * />
 * ```
 */
export const AdaptiveSelect = AdaptiveSelectRoot
