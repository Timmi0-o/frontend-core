'use client'

import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { HTMLAttributes, ReactElement } from 'react'

export type TAvatarSize = 'sm' | 'default' | 'lg'

export interface IAvatarRootProps extends AvatarPrimitive.Root.Props {
	size?: TAvatarSize
	className?: string
	variant?: TSlotVariant
}

const AvatarRoot = ({
	size = 'default',
	className,
	variant = 'default',
	...props
}: IAvatarRootProps): ReactElement => {
	return (
		<AvatarPrimitive.Root
			data-slot='avatar'
			data-size={size}
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export interface IAvatarImageProps extends AvatarPrimitive.Image.Props {
	className?: string
	variant?: TSlotVariant
}

const AvatarImage = ({
	className,
	variant = 'default',
	...props
}: IAvatarImageProps): ReactElement => {
	return (
		<AvatarPrimitive.Image
			data-slot='avatar-image'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export interface IAvatarFallbackProps extends AvatarPrimitive.Fallback.Props {
	className?: string
	variant?: TSlotVariant
}

const AvatarFallback = ({
	className,
	variant = 'default',
	...props
}: IAvatarFallbackProps): ReactElement => {
	return (
		<AvatarPrimitive.Fallback
			data-slot='avatar-fallback'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export interface IAvatarBadgeProps extends HTMLAttributes<HTMLSpanElement> {
	className?: string
	variant?: TSlotVariant
}

const AvatarBadge = ({
	className,
	variant = 'default',
	...props
}: IAvatarBadgeProps): ReactElement => {
	return (
		<span
			data-slot='avatar-badge'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export interface IAvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
	className?: string
	variant?: TSlotVariant
}

const AvatarGroup = ({
	className,
	variant = 'default',
	...props
}: IAvatarGroupProps): ReactElement => {
	return (
		<div
			data-slot='avatar-group'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export interface IAvatarGroupCountProps extends HTMLAttributes<HTMLDivElement> {
	className?: string
	variant?: TSlotVariant
}

const AvatarGroupCount = ({
	className,
	variant = 'default',
	...props
}: IAvatarGroupCountProps): ReactElement => {
	return (
		<div
			data-slot='avatar-group-count'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

AvatarRoot.displayName = 'Avatar'
AvatarImage.displayName = 'Avatar.Image'
AvatarFallback.displayName = 'Avatar.Fallback'
AvatarBadge.displayName = 'Avatar.Badge'
AvatarGroup.displayName = 'Avatar.Group'
AvatarGroupCount.displayName = 'Avatar.GroupCount'

/**
 * Аватар: картинка + fallback. Group / GroupCount — стек нескольких лиц.
 *
 * @example
 * ```tsx
 * <Avatar size="lg">
 *   <Avatar.Image src={url} alt="Иван" />
 *   <Avatar.Fallback>ИП</Avatar.Fallback>
 * </Avatar>
 *
 * <Avatar.Group>
 *   <Avatar><Avatar.Fallback>А</Avatar.Fallback></Avatar>
 *   <Avatar.GroupCount>+3</Avatar.GroupCount>
 * </Avatar.Group>
 * ```
 */
export const Avatar = Object.assign(AvatarRoot, {
	Root: AvatarRoot,
	Image: AvatarImage,
	Fallback: AvatarFallback,
	Badge: AvatarBadge,
	Group: AvatarGroup,
	GroupCount: AvatarGroupCount,
})
