'use client'

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ReactElement } from 'react'

export type TSeparatorMode = 'solid' | 'dashed'

export interface ISeparatorProps extends SeparatorPrimitive.Props {
	className?: string
	variant?: TSlotVariant
	/** Сплошная или пунктирная линия. Пунктир — для секций внутри карточек. */
	mode?: TSeparatorMode
}

const SeparatorRoot = ({
	className,
	orientation = 'horizontal',
	variant = 'default',
	mode = 'solid',
	...props
}: ISeparatorProps): ReactElement => {
	return (
		<SeparatorPrimitive
			{...props}
			orientation={orientation}
			data-slot='separator'
			data-variant={variant}
			data-mode={mode}
			className={cn(className)}
		/>
	)
}

SeparatorRoot.displayName = 'Separator'

/**
 * Разделитель секций. `mode="dashed"` — внутри карточек, `orientation="vertical"` — в ряд.
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator mode="dashed" />
 * <Separator orientation="vertical" />
 * ```
 */
export const Separator = Object.assign(SeparatorRoot, {
	Root: SeparatorRoot,
})
