'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ICompoundChildProps } from '@/core/types/i-create-compound-component.types'
import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

export type IChipVariant =
	| 'default'
	| 'secondary'
	| 'accent'
	| 'outline'
	| 'success'
	| 'warning'
	| 'danger'
	| 'soft-danger'
	| 'info'
	| 'unstyled'

export interface IChipRootProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: IChipVariant
	clickable?: boolean
	className?: string
	children?: ReactNode
}

const ChipRoot = ({
	variant = 'default',
	clickable = false,
	className,
	children,
	...rest
}: IChipRootProps): ReactElement => {
	return (
		<span
			{...rest}
			data-slot='chip'
			data-variant={variant}
			data-clickable={clickable ? '' : undefined}
			{...(clickable ? { role: 'button' as const, tabIndex: 0 } : {})}
			className={cn(className)}
		>
			{children}
		</span>
	)
}

ChipRoot.displayName = 'Chip'

export interface IChipLabelProps extends ICompoundChildProps {
	className?: string
	variant?: TSlotVariant
}

const ChipLabel = ({
	children,
	className,
	variant = 'default',
}: IChipLabelProps): ReactElement => {
	return (
		<span
			data-slot='chip-label'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</span>
	)
}

ChipLabel.displayName = 'Chip.Label'

/**
 * Компактная метка (тег, статус). `clickable` включает role=button.
 *
 * @example
 * ```tsx
 * <Chip variant="success">Подтверждён</Chip>
 * <Chip variant="outline" clickable onClick={handleFilter}>
 *   <Chip.Label>С питанием</Chip.Label>
 * </Chip>
 * ```
 */
export const Chip = Object.assign(ChipRoot, {
	Root: ChipRoot,
	Label: ChipLabel,
})
