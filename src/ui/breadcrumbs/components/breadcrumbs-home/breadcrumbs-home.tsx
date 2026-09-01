'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ReactElement } from 'react'
import { BREADCRUMBS_DISPLAY_NAMES } from '../../constants/breadcrumbs.constants'
import { useBreadcrumbsItemContext } from '../../context/breadcrumbs-context'

export interface IBreadcrumbsHomeProps {
	href?: string
	className?: string
	variant?: TSlotVariant
	'aria-label'?: string
}

const HomeIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 24 24'
			width='16'
			height='16'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

/**
 * Иконка «домой» в крошках. Класть первым ребёнком `Breadcrumbs`.
 *
 * @example
 * ```tsx
 * <Breadcrumbs.Home href="/" />
 * ```
 */
export const BreadcrumbsHome = ({
	href = '/',
	className,
	variant = 'default',
	'aria-label': ariaLabel = 'На главную',
}: IBreadcrumbsHomeProps): ReactElement => {
	const { index } = useBreadcrumbsItemContext()

	return (
		<li data-slot='breadcrumbs-item' data-variant={variant} className={cn(className)}>
			{index > 0 ? (
				<span data-slot='breadcrumbs-separator' aria-hidden='true'>
					›
				</span>
			) : null}

			<a href={href} data-slot='breadcrumbs-home' aria-label={ariaLabel}>
				<HomeIcon />
			</a>
		</li>
	)
}

BreadcrumbsHome.displayName = BREADCRUMBS_DISPLAY_NAMES.HOME
