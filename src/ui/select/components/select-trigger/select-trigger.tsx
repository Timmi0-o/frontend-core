'use client'

import { cn } from '@/core/cn'
import { resolveChildSlotVariant } from '@/core/slot-variant'
import { Popover } from '@/ui/popover/popover'
import { Spinner } from '@/ui/spinner/spinner'
import type { ReactElement, ReactNode } from 'react'
import { SELECT_DISPLAY_NAMES } from '../../constants/select.constants'
import { useSelectContext } from '../../context/select-context'
import { hasSelectValueChild } from '../../helpers/has-select-value-child'
import type { ISelectTriggerProps } from '../../types/i-select-props'
import { SelectIndicator } from '../select-indicator/select-indicator'
import { SelectValue } from '../select-value/select-value'

const SelectTriggerLoading = ({
	loadingLabel,
}: {
	loadingLabel: string
}): ReactElement => {
	return (
		<span data-slot='select-value'>
			<Spinner size='sm' />
			<span>{loadingLabel}</span>
		</span>
	)
}

/**
 * Состав триггера: loading, дефолтная строка Value, либо кастомный слот.
 */
const resolveTriggerContent = (
	children: ReactNode,
	isLoading: boolean,
	loadingLabel: string,
): ReactNode => {
	if (isLoading) {
		return <SelectTriggerLoading loadingLabel={loadingLabel} />
	}

	if (!children) {
		return (
			<>
				<SelectValue />
				<SelectIndicator />
			</>
		)
	}

	if (!hasSelectValueChild(children)) {
		return (
			<>
				<SelectValue />
				{children}
			</>
		)
	}

	return children
}

export const SelectTrigger = ({
	className,
	children,
	variant: variantProp,
}: ISelectTriggerProps): ReactElement => {
	const {
		isOpen,
		isDisabled,
		isLoading,
		loadingLabel,
		placeholder,
		triggerLabel,
		selectedItems,
		size,
		variant: contextVariant,
		tone,
	} = useSelectContext()
	const variant = resolveChildSlotVariant(variantProp, contextVariant, 'default')
	const isEmpty = !isLoading && selectedItems.length === 0

	return (
		<Popover.Trigger>
			<button
				type='button'
				disabled={isDisabled}
				data-slot='select-trigger'
				data-size={size}
				data-variant={variant}
				data-tone={tone}
				data-disabled={isDisabled ? '' : undefined}
				data-loading={isLoading ? '' : undefined}
				data-open={isOpen ? '' : undefined}
				data-empty={isEmpty ? '' : undefined}
				className={cn(className)}
				aria-busy={isLoading}
				aria-haspopup='listbox'
				aria-expanded={isOpen}
				aria-label={isLoading ? loadingLabel : triggerLabel || placeholder}
			>
				{resolveTriggerContent(children, isLoading, loadingLabel)}
			</button>
		</Popover.Trigger>
	)
}

SelectTrigger.displayName = SELECT_DISPLAY_NAMES.TRIGGER
