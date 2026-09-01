'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ReactElement, ReactNode } from 'react'
import { BREADCRUMBS_DISPLAY_NAMES } from '../../constants/breadcrumbs.constants'
import { useBreadcrumbsItemContext } from '../../context/breadcrumbs-context'

export interface IBreadcrumbsItemProps {
	children?: ReactNode
	href?: string
	className?: string
	variant?: TSlotVariant
}

/**
 * Пункт крошки. Без `href` — текущая страница.
 *
 * @example
 * ```tsx
 * <Breadcrumbs.Item href="/tickets">Билеты</Breadcrumbs.Item>
 * <Breadcrumbs.Item>Поиск</Breadcrumbs.Item>
 * ```
 */
export const BreadcrumbsItem = ({
	children,
	href,
	className,
	variant = 'default',
}: IBreadcrumbsItemProps): ReactElement => {
	const { index } = useBreadcrumbsItemContext()
	const isCurrent = !href

	return (
		<li data-slot='breadcrumbs-item' data-variant={variant} className={cn(className)}>
			{index > 0 ? (
				<span data-slot='breadcrumbs-separator' aria-hidden='true'>
					›
				</span>
			) : null}

			{isCurrent ? (
				<span data-slot='breadcrumbs-current' aria-current='page'>
					{children}
				</span>
			) : (
				<a href={href} data-slot='breadcrumbs-link'>
					{children}
				</a>
			)}
		</li>
	)
}

BreadcrumbsItem.displayName = BREADCRUMBS_DISPLAY_NAMES.ITEM
