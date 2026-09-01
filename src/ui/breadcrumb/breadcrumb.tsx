'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs'
import type { ComponentProps, ReactElement } from 'react'

/**
 * Алиас `Breadcrumbs` в виде `<nav>`. Предпочтительнее составной `Breadcrumbs` + `Home`/`Item`.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Главная</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Текущая</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
export const Breadcrumb = ({
	className,
	variant = 'default',
	...props
}: ComponentProps<'nav'> & { variant?: TSlotVariant }): ReactElement => {
	return <Breadcrumbs className={cn(className)} variant={variant} {...props} />
}

/**
 * Контейнер пунктов для `Breadcrumb`.
 *
 * @example
 * ```tsx
 * <BreadcrumbList>
 *   <BreadcrumbItem>
 *     <BreadcrumbLink href="/">Главная</BreadcrumbLink>
 *   </BreadcrumbItem>
 * </BreadcrumbList>
 * ```
 */
export const BreadcrumbList = ({
	className,
	variant = 'default',
	...props
}: ComponentProps<'div'> & { variant?: TSlotVariant }): ReactElement => {
	return (
		<div
			data-slot='breadcrumb-list'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

/**
 * Один пункт крошки.
 *
 * @example
 * ```tsx
 * <BreadcrumbItem>
 *   <BreadcrumbLink href="/tickets">Билеты</BreadcrumbLink>
 * </BreadcrumbItem>
 * ```
 */
export const BreadcrumbItem = ({
	className,
	variant = 'default',
	...props
}: ComponentProps<'span'> & { variant?: TSlotVariant }): ReactElement => {
	return (
		<span
			data-slot='breadcrumb-item'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

/**
 * Ссылка в крошке.
 *
 * @example
 * ```tsx
 * <BreadcrumbLink href="/tickets">Билеты</BreadcrumbLink>
 * ```
 */
export const BreadcrumbLink = ({
	className,
	variant = 'default',
	...props
}: ComponentProps<'a'> & { variant?: TSlotVariant }): ReactElement => {
	return (
		<a
			data-slot='breadcrumb-link'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

/**
 * Текущая страница (`aria-current="page"`), не ссылка.
 *
 * @example
 * ```tsx
 * <BreadcrumbPage>Поиск</BreadcrumbPage>
 * ```
 */
export const BreadcrumbPage = ({
	className,
	variant = 'default',
	...props
}: ComponentProps<'span'> & { variant?: TSlotVariant }): ReactElement => {
	return (
		<span
			data-slot='breadcrumb-page'
			data-variant={variant}
			aria-current='page'
			className={cn(className)}
			{...props}
		/>
	)
}

/**
 * Разделитель между пунктами. По умолчанию `/`.
 *
 * @example
 * ```tsx
 * <BreadcrumbSeparator />
 * ```
 */
export const BreadcrumbSeparator = ({
	className,
	children = '/',
	variant = 'default',
	...props
}: ComponentProps<'span'> & { variant?: TSlotVariant }): ReactElement => {
	return (
		<span
			data-slot='breadcrumb-separator'
			data-variant={variant}
			className={cn(className)}
			{...props}
		>
			{children}
		</span>
	)
}

/**
 * Свёрнутые промежуточные крошки (`...`).
 *
 * @example
 * ```tsx
 * <BreadcrumbEllipsis />
 * ```
 */
export const BreadcrumbEllipsis = ({
	className,
	children = '...',
	variant = 'default',
	...props
}: ComponentProps<'span'> & { variant?: TSlotVariant }): ReactElement => {
	return (
		<span
			data-slot='breadcrumb-ellipsis'
			data-variant={variant}
			className={cn(className)}
			{...props}
		>
			{children}
		</span>
	)
}
