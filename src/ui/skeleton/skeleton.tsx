'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { HTMLAttributes, ReactElement } from 'react'

export interface ISkeletonRootProps extends HTMLAttributes<HTMLDivElement> {
	className?: string
	variant?: TSlotVariant
}

const SkeletonRoot = ({
	className,
	variant = 'default',
	...rest
}: ISkeletonRootProps): ReactElement => {
	return (
		<div
			data-slot='skeleton'
			data-variant={variant}
			className={cn(className)}
			aria-hidden='true'
			{...rest}
		/>
	)
}

SkeletonRoot.displayName = 'Skeleton'

export type ISkeletonProps = ISkeletonRootProps

/**
 * Плейсхолдер загрузки: прямоугольник с shimmer кита. Размер задаёт `className`.
 *
 * Ставить на место контента, пока нет данных. `aria-hidden` — не дублирует status.
 *
 * @example
 * ```tsx
 * <Skeleton className={styles.card} />
 * <Skeleton className={styles.title} />
 * ```
 */
export const Skeleton = Object.assign(SkeletonRoot, {
	Root: SkeletonRoot,
})
