'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { HTMLAttributes, ReactElement } from 'react'

export interface IButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
	className?: string
	variant?: TSlotVariant
}

const ButtonGroupRoot = ({
	className,
	variant = 'default',
	...props
}: IButtonGroupProps): ReactElement => {
	return (
		<div
			role='group'
			data-slot='button-group'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

ButtonGroupRoot.displayName = 'ButtonGroup'

/**
 * Склеивает соседние `Button` в один контрол: общие внешние радиусы, без щели.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button variant="primary">Фильтры</Button>
 *   <Button variant="primary" isIconOnly aria-label="Сбросить">
 *     ×
 *   </Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = Object.assign(ButtonGroupRoot, {
	Root: ButtonGroupRoot,
})
