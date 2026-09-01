'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ICompoundChildProps } from '@/core/types/i-create-compound-component.types'
import type { ReactElement, ReactNode } from 'react'

export type IAlertBannerVariant =
	| 'default'
	| 'warning'
	| 'danger'
	| 'success'
	| 'soft-danger'
	| 'error'
	| 'unstyled'

export interface IAlertBannerRootProps {
	variant?: IAlertBannerVariant
	children?: ReactNode
	className?: string
}

const AlertBannerRoot = ({
	variant = 'default',
	children,
	className,
}: IAlertBannerRootProps): ReactElement | null => {
	if (!children) {
		return null
	}

	return (
		<div
			data-slot='alert'
			data-variant={variant}
			className={cn(className)}
			role='alert'
		>
			{children}
		</div>
	)
}

AlertBannerRoot.displayName = 'AlertBanner'

export interface IAlertBannerDescriptionProps extends ICompoundChildProps {
	className?: string
	variant?: TSlotVariant
}

const AlertBannerDescription = ({
	children,
	className,
	variant = 'default',
}: IAlertBannerDescriptionProps): ReactElement => {
	return (
		<div
			data-slot='alert-description'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</div>
	)
}

AlertBannerDescription.displayName = 'AlertBanner.Description'

export type IAlertBannerProps = IAlertBannerRootProps

/**
 * Баннер-алерт (`role="alert"`). Пустые children не рендерятся.
 *
 * @example
 * ```tsx
 * <AlertBanner variant="warning">
 *   <AlertBanner.Description>Проверьте паспортные данные</AlertBanner.Description>
 * </AlertBanner>
 * ```
 */
export const AlertBanner = Object.assign(AlertBannerRoot, {
	Root: AlertBannerRoot,
	Description: AlertBannerDescription,
})
