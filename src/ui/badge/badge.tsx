'use client'

import { forwardRef, type ReactElement } from 'react'

import { cn } from '@/core/cn'

import type { IBadgeProps } from './types/i-badge-props'
import { resolveBadgePlacement } from './utils/resolve-badge-placement'

export type {
	IBadgeProps,
	TBadgePlacement,
	TBadgePosition,
	TBadgeVariant,
} from './types/i-badge-props'

/**
 * Бейдж: текст рядом с элементом или точка/счётчик поверх якоря (`placement` ≠ `static`).
 *
 * @example
 * ```tsx
 * <Badge variant="success">Новое</Badge>
 *
 * <Badge placement="top-right" content={3}>
 *   <Button isIconOnly aria-label="Уведомления">🔔</Button>
 * </Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, IBadgeProps>(
	(
		{
			variant = 'default',
			placement,
			position = 'static',
			content,
			className,
			children,
			...props
		},
		ref,
	): ReactElement => {
		const resolvedPlacement = resolveBadgePlacement(placement ?? position)
		const isOverlay = resolvedPlacement !== 'static'
		const hasContent = content != null && content !== ''

		if (!isOverlay) {
			return (
				<span
					{...props}
					ref={ref}
					data-slot='badge'
					data-variant={variant}
					className={cn(className)}
				>
					{children}
				</span>
			)
		}

		return (
			<span ref={ref} data-slot='badge-anchor' {...props}>
				{children}
				<span
					data-slot='badge'
					data-variant={variant}
					data-placement={resolvedPlacement}
					data-empty={!hasContent ? '' : undefined}
					className={cn(className)}
				>
					{hasContent ? content : null}
				</span>
			</span>
		)
	},
)

Badge.displayName = 'Badge'
