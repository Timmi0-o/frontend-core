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

const iconProps = {
	viewBox: '0 0 24 24',
	width: 24,
	height: 24,
	fill: 'none',
	'aria-hidden': true,
} as const

const InfoIcon = (): ReactElement => {
	return (
		<svg {...iconProps}>
			<circle
				cx='12'
				cy='12'
				r='10'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<path
				d='M12 16v-4M12 8h.01'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
		</svg>
	)
}

const WarningIcon = (): ReactElement => {
	return (
		<svg {...iconProps}>
			<path
				d='M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinejoin='round'
			/>
			<path
				d='M12 9v4M12 17h.01'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
		</svg>
	)
}

const SuccessIcon = (): ReactElement => {
	return (
		<svg {...iconProps}>
			<circle
				cx='12'
				cy='12'
				r='10'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<path
				d='m9 12 2 2 4-4'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

const DangerIcon = (): ReactElement => {
	return (
		<svg {...iconProps}>
			<circle
				cx='12'
				cy='12'
				r='10'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<path
				d='M12 8v4M12 16h.01'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
		</svg>
	)
}

const VARIANT_ICON: Record<
	Exclude<IAlertBannerVariant, 'unstyled'>,
	() => ReactElement
> = {
	default: InfoIcon,
	warning: WarningIcon,
	success: SuccessIcon,
	danger: DangerIcon,
	error: DangerIcon,
	'soft-danger': DangerIcon,
}

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

	const Icon = variant === 'unstyled' ? null : VARIANT_ICON[variant]

	return (
		<div
			data-slot='alert'
			data-variant={variant}
			className={cn(className)}
			role='alert'
		>
			{Icon ? (
				<span data-slot='alert-icon' aria-hidden='true'>
					<Icon />
				</span>
			) : null}
			<div data-slot='alert-body'>{children}</div>
		</div>
	)
}

AlertBannerRoot.displayName = 'AlertBanner'

export interface IAlertBannerTitleProps extends ICompoundChildProps {
	className?: string
	variant?: TSlotVariant
}

const AlertBannerTitle = ({
	children,
	className,
	variant = 'default',
}: IAlertBannerTitleProps): ReactElement => {
	return (
		<div
			data-slot='alert-title'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</div>
	)
}

AlertBannerTitle.displayName = 'AlertBanner.Title'

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
 * Баннер-алерт (`role="alert"`). Иконка ставится по `variant`. Пустые children не рендерятся.
 *
 * @example
 * ```tsx
 * <AlertBanner variant="warning">
 *   <AlertBanner.Title>Проверьте данные</AlertBanner.Title>
 *   <AlertBanner.Description>Паспортные поля заполнены не полностью.</AlertBanner.Description>
 * </AlertBanner>
 * ```
 */
export const AlertBanner = Object.assign(AlertBannerRoot, {
	Root: AlertBannerRoot,
	Title: AlertBannerTitle,
	Description: AlertBannerDescription,
})
