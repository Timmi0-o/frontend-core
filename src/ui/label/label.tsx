'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { LabelHTMLAttributes, ReactElement } from 'react'

export interface ILabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	className?: string
	variant?: TSlotVariant
}

const LabelRoot = ({
	className,
	variant = 'default',
	...props
}: ILabelProps): ReactElement => {
	return (
		<label
			data-slot='label'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

LabelRoot.displayName = 'Label'

/**
 * Подпись к контролу (`htmlFor` = id инпута). Для полей с ошибкой — `TextField.Label`.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" />
 * ```
 */
export const Label = Object.assign(LabelRoot, {
	Root: LabelRoot,
})
