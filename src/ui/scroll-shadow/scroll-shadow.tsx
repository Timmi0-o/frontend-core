'use client'

import { cn } from '@/core/cn'
import {
	useRef,
	type CSSProperties,
	type ReactElement,
} from 'react'
import { useScrollShadow } from './hooks/use-scroll-shadow'
import type { IScrollShadowProps } from './types/i-scroll-shadow-props'

export type {
	IScrollShadowProps,
	TScrollShadowOrientation,
} from './types/i-scroll-shadow-props'

const ScrollShadowRoot = ({
	children,
	className,
	variant = 'default',
	orientation = 'horizontal',
	size = 40,
	offset = 0,
	isEnabled = true,
	style,
	...rest
}: IScrollShadowProps): ReactElement => {
	const containerRef = useRef<HTMLDivElement>(null)

	useScrollShadow({
		containerRef,
		orientation,
		size,
		offset,
		isEnabled,
	})

	const rootStyle = {
		'--scroll-shadow-size': `${size}px`,
		...style,
	} as CSSProperties

	return (
		<div
			ref={containerRef}
			data-slot='scroll-shadow'
			data-variant={variant}
			data-orientation={orientation}
			className={cn(className)}
			style={rootStyle}
			{...rest}
		>
			{children}
		</div>
	)
}

ScrollShadowRoot.displayName = 'ScrollShadow'

/**
 * Обёртка для overflow-контента с fade на краях, когда есть куда скроллить.
 * Интенсивность fade на краях нарастает плавно в пределах `size` по мере прокрутки.
 *
 * @example
 * ```tsx
 * <ScrollShadow className={styles.tabs} orientation="horizontal">
 *   {items.map((item) => <Chip key={item.id}>{item.label}</Chip>)}
 * </ScrollShadow>
 *
 * <ScrollShadow orientation="vertical" size={80} className={styles.list}>
 *   {paragraphs.map((text) => <p key={text}>{text}</p>)}
 * </ScrollShadow>
 * ```
 */
export const ScrollShadow = Object.assign(ScrollShadowRoot, {
	Root: ScrollShadowRoot,
})
