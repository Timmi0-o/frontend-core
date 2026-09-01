'use client'

import { cn } from '@/core/cn'
import type { ReactElement } from 'react'
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
export const Badge = ({
	variant = 'default',
	placement,
	position = 'static',
	content,
	className,
	children,
	...props
}: IBadgeProps): ReactElement => {
	const resolvedPlacement = resolveBadgePlacement(placement ?? position)
	const isOverlay = resolvedPlacement !== 'static'
	const hasContent = content != null && content !== ''
	const badge = (
		<span
			{...props}
			data-slot='badge'
			data-variant={variant}
			data-placement={isOverlay ? resolvedPlacement : undefined}
			data-empty={isOverlay && !hasContent ? '' : undefined}
			className={cn(className)}
		>
			{isOverlay ? (hasContent ? content : null) : children}
		</span>
	)

	if (!isOverlay) {
		return badge
	}

	return (
		<span data-slot='badge-anchor'>
			{children}
			{badge}
		</span>
	)
}

Badge.displayName = 'Badge'
