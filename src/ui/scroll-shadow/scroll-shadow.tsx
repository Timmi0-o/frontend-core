'use client'

import { cn } from '@/core/cn'
import {
	forwardRef,
	useCallback,
	useLayoutEffect,
	useRef,
	type CSSProperties,
	type ReactElement,
} from 'react'
import { useScrollShadow } from './hooks/use-scroll-shadow'
import type { IScrollShadowProps } from './types/i-scroll-shadow-props'

export type {
	IScrollShadowProps,
	TScrollShadowOrientation,
	TScrollShadowVisibility,
} from './types/i-scroll-shadow-props'

const ScrollShadowRoot = forwardRef<HTMLDivElement, IScrollShadowProps>(
	(
		{
			children,
			className,
			variant = 'default',
			orientation = 'horizontal',
			size = 40,
			offset = 0,
			visibility = 'auto',
			isEnabled = true,
			isScrollBarHidden = false,
			onVisibilityChange,
			style,
			...rest
		},
		ref,
	): ReactElement => {
		const containerRef = useRef<HTMLDivElement | null>(null)

		useScrollShadow({
			containerRef,
			orientation,
			offset,
			visibility,
			isEnabled,
			onVisibilityChange,
		})

		useLayoutEffect(() => {
			const element = containerRef.current

			if (!element || visibility === 'auto') {
				return
			}

			delete element.dataset.topScroll
			delete element.dataset.bottomScroll
			delete element.dataset.topBottomScroll
			delete element.dataset.leftScroll
			delete element.dataset.rightScroll
			delete element.dataset.leftRightScroll

			if (visibility === 'both') {
				element.dataset[
					orientation === 'vertical' ? 'topBottomScroll' : 'leftRightScroll'
				] = 'true'
			} else if (visibility !== 'none') {
				element.dataset[`${visibility}Scroll`] = 'true'
			}
		}, [visibility, orientation])

		const handleRef = useCallback(
			(node: HTMLDivElement | null) => {
				containerRef.current = node

				if (typeof ref === 'function') {
					ref(node)
					return
				}

				if (ref) {
					ref.current = node
				}
			},
			[ref],
		)

		const rootStyle = {
			'--scroll-shadow-size': `${size}px`,
			'--scroll-shadow-offset': `${offset}px`,
			'--scroll-shadow-scrollbar-size': isScrollBarHidden ? '0px' : undefined,
			...style,
		} as CSSProperties

		return (
			<div
				ref={handleRef}
				data-slot='scroll-shadow'
				data-variant={variant}
				data-orientation={orientation}
				data-scroll-shadow-mode={isEnabled && visibility === 'auto' ? 'auto' : 'manual'}
				data-scroll-bar-hidden={isScrollBarHidden ? 'true' : undefined}
				className={cn(className)}
				style={rootStyle}
				{...rest}
			>
				{children}
			</div>
		)
	},
)

ScrollShadowRoot.displayName = 'ScrollShadow'

/**
 * Fade на краях overflow-контента. В `visibility="auto"` fade считается в CSS
 * через scroll-driven animations; в старых браузерах — через data-*-scroll и mask.
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
