'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ICompoundChildProps } from '@/core/types/i-create-compound-component.types'
import type { HTMLAttributes, ReactElement } from 'react'

export interface ICardRootProps
	extends ICompoundChildProps, HTMLAttributes<HTMLDivElement> {
	className?: string
	variant?: TSlotVariant
}

const CardRoot = ({
	children,
	className,
	variant = 'default',
	...rest
}: ICardRootProps): ReactElement => {
	return (
		<div
			data-slot='card'
			data-variant={variant}
			className={cn(className)}
			{...rest}
		>
			{children}
		</div>
	)
}

CardRoot.displayName = 'Card'

export interface ICardHeaderProps
	extends ICompoundChildProps, HTMLAttributes<HTMLDivElement> {
	className?: string
	variant?: TSlotVariant
}

const CardHeader = ({
	children,
	className,
	variant = 'default',
	...rest
}: ICardHeaderProps): ReactElement => {
	return (
		<div
			data-slot='card-header'
			data-variant={variant}
			className={cn(className)}
			{...rest}
		>
			{children}
		</div>
	)
}

CardHeader.displayName = 'Card.Header'

export interface ICardTitleProps
	extends ICompoundChildProps, HTMLAttributes<HTMLHeadingElement> {
	className?: string
	variant?: TSlotVariant
}

const CardTitle = ({
	children,
	className,
	variant = 'default',
	...rest
}: ICardTitleProps): ReactElement => {
	return (
		<h3
			data-slot='card-title'
			data-variant={variant}
			className={cn(className)}
			{...rest}
		>
			{children}
		</h3>
	)
}

CardTitle.displayName = 'Card.Title'

export interface ICardDescriptionProps
	extends ICompoundChildProps, HTMLAttributes<HTMLParagraphElement> {
	className?: string
	variant?: TSlotVariant
}

const CardDescription = ({
	children,
	className,
	variant = 'default',
	...rest
}: ICardDescriptionProps): ReactElement => {
	return (
		<p
			data-slot='card-description'
			data-variant={variant}
			className={cn(className)}
			{...rest}
		>
			{children}
		</p>
	)
}

CardDescription.displayName = 'Card.Description'

export interface ICardContentProps
	extends ICompoundChildProps, HTMLAttributes<HTMLDivElement> {
	className?: string
	variant?: TSlotVariant
}

const CardContent = ({
	children,
	className,
	variant = 'default',
	...rest
}: ICardContentProps): ReactElement => {
	return (
		<div
			data-slot='card-content'
			data-variant={variant}
			className={cn(className)}
			{...rest}
		>
			{children}
		</div>
	)
}

CardContent.displayName = 'Card.Content'

export interface ICardFooterProps
	extends ICompoundChildProps, HTMLAttributes<HTMLDivElement> {
	className?: string
	variant?: TSlotVariant
}

const CardFooter = ({
	children,
	className,
	variant = 'default',
	...rest
}: ICardFooterProps): ReactElement => {
	return (
		<div
			data-slot='card-footer'
			data-variant={variant}
			className={cn(className)}
			{...rest}
		>
			{children}
		</div>
	)
}

CardFooter.displayName = 'Card.Footer'

/**
 * Карточка: оболочка и слоты Header / Title / Description / Content / Footer.
 *
 * @example
 * ```tsx
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Маршрут</Card.Title>
 *     <Card.Description>Москва — Санкт-Петербург</Card.Description>
 *   </Card.Header>
 *   <Card.Content>Подробности</Card.Content>
 *   <Card.Footer>
 *     <Button>Выбрать</Button>
 *   </Card.Footer>
 * </Card>
 * ```
 */
export const Card = Object.assign(CardRoot, {
	Header: CardHeader,
	Title: CardTitle,
	Description: CardDescription,
	Content: CardContent,
	Footer: CardFooter,
})
