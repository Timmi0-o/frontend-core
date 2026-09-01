'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ReactElement, TextareaHTMLAttributes } from 'react'

export type TTextareaSize = 'sm' | 'md' | 'lg'

export interface ITextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	size?: TTextareaSize
	className?: string
	variant?: TSlotVariant
}

/**
 * Многострочное поле. Для лейбла и ошибки собирай `Label` + `Textarea` сам или используй форму рядом.
 *
 * @example
 * ```tsx
 * <Textarea
 *   size="md"
 *   rows={4}
 *   placeholder="Комментарий"
 *   value={comment}
 *   onChange={(event) => setComment(event.target.value)}
 * />
 * ```
 */
export const Textarea = ({
	size = 'md',
	variant = 'default',
	className,
	...props
}: ITextareaProps): ReactElement => {
	return (
		<textarea
			{...props}
			data-slot='textarea'
			data-variant={variant}
			data-size={size}
			className={cn(className)}
		/>
	)
}

Textarea.displayName = 'Textarea'
