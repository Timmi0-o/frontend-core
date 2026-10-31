'use client'

import { cn } from '@/core/cn'
import type { HTMLAttributes, ReactElement } from 'react'

export type TButtonGroupVariant = 'default' | 'secondary' | 'unstyled'

export interface IButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
	className?: string
	variant?: TButtonGroupVariant
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
 * Группирует соседние `Button`: `default` — один склеенный контрол,
 * `secondary` — glass-трек с отдельными сегментами внутри.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button>Сохранить</Button>
 *   <Button variant="outline">Отмена</Button>
 * </ButtonGroup>
 *
 * <ButtonGroup variant="secondary">
 *   <Button variant="primary">Фильтры</Button>
 *   <Button isIconOnly variant="primary" aria-label="Сбросить">
 *     ×
 *   </Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = Object.assign(ButtonGroupRoot, {
	Root: ButtonGroupRoot,
})
