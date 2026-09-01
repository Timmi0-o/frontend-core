'use client'

import { cn } from '@/core/cn'
import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import {
	BREADCRUMBS_DISPLAY_NAMES,
	type TBreadcrumbsVariant,
} from '../../constants/breadcrumbs.constants'
import { BreadcrumbsItemContext } from '../../context/breadcrumbs-context'

export type { TBreadcrumbsVariant }

export interface IBreadcrumbsRootProps {
	children?: ReactNode
	className?: string
	variant?: TBreadcrumbsVariant
	'aria-label'?: string
}

/**
 * Корень хлебных крошек. Пункты — `Breadcrumbs.Home` / `Breadcrumbs.Item`.
 *
 * @example
 * ```tsx
 * <Breadcrumbs>
 *   <Breadcrumbs.Home href="/" />
 *   <Breadcrumbs.Item href="/tickets">Билеты</Breadcrumbs.Item>
 *   <Breadcrumbs.Item>Поиск</Breadcrumbs.Item>
 * </Breadcrumbs>
 * ```
 */
export const BreadcrumbsRoot = ({
	children,
	className,
	variant = 'default',
	'aria-label': ariaLabel = 'Хлебные крошки',
}: IBreadcrumbsRootProps): ReactElement => {
	const items = Children.toArray(children).filter(isValidElement)

	return (
		<nav
			data-slot='breadcrumbs'
			data-variant={variant}
			className={cn(className)}
			aria-label={ariaLabel}
		>
			<ol>
				{items.map((child, index) => (
					<BreadcrumbsItemContext.Provider
						key={child.key ?? index}
						value={{ index }}
					>
						{child}
					</BreadcrumbsItemContext.Provider>
				))}
			</ol>
		</nav>
	)
}

BreadcrumbsRoot.displayName = BREADCRUMBS_DISPLAY_NAMES.ROOT
