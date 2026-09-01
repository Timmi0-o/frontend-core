'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { Checkbox } from '@/ui/checkbox/checkbox'
import type { ReactElement, ReactNode } from 'react'
import { SELECT_DISPLAY_NAMES } from '../../constants/select.constants'
import { useSelectContext } from '../../context/select-context'
import { renderSelectSlot } from '../../helpers/render-select-slot'
import type { ISelectOptionItemProps } from '../../types/i-select-props'

const DefaultOptionContent = ({
	isMultiselect,
	isSelected,
	label,
	isDisabled,
}: {
	isMultiselect: boolean
	isSelected: boolean
	label: string
	isDisabled?: boolean
}): ReactElement => {
	if (isMultiselect) {
		return (
			<Checkbox
				label={label}
				checked={isSelected}
				readOnly
				isDisabled={isDisabled}
			/>
		)
	}

	return <span>{label}</span>
}

/**
 * Пункт выпадающего списка. Обычно рисуется самим `Select` из `options`.
 *
 * @example
 * ```tsx
 * <Select.Dropdown>
 *   {options.map((option) => (
 *     <Select.Option key={option.value} option={option} />
 *   ))}
 * </Select.Dropdown>
 * ```
 */
export const SelectOption = ({
	option,
	className,
	variant: variantProp,
	children,
}: ISelectOptionItemProps): ReactElement => {
	const { isMultiselect, isOptionSelected, handleSelect, variant: contextVariant } =
		useSelectContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')
	const isSelected = isOptionSelected(option)
	const defaultChildren = (
		<DefaultOptionContent
			isMultiselect={isMultiselect}
			isSelected={isSelected}
			label={option.label}
			isDisabled={option.disabled}
		/>
	)
	const content: ReactNode = renderSelectSlot(
		children,
		{ option, isSelected, defaultChildren },
		defaultChildren,
	)

	const onSelect = (): void => {
		handleSelect(option)
	}

	if (isMultiselect) {
		return (
			<div
				role='option'
				aria-selected={isSelected}
				aria-disabled={option.disabled}
				data-slot='select-option'
				data-variant={variant}
				data-selected={isSelected ? '' : undefined}
				data-disabled={option.disabled ? '' : undefined}
				data-rich={children != null ? '' : undefined}
				className={cn(className)}
				onClick={onSelect}
			>
				{content}
			</div>
		)
	}

	return (
		<button
			type='button'
			role='option'
			aria-selected={isSelected}
			disabled={option.disabled}
			data-slot='select-option'
			data-variant={variant}
			data-selected={isSelected ? '' : undefined}
			data-disabled={option.disabled ? '' : undefined}
			data-rich={children != null ? '' : undefined}
			className={cn(className)}
			onClick={onSelect}
		>
			{content}
		</button>
	)
}

SelectOption.displayName = SELECT_DISPLAY_NAMES.OPTION
