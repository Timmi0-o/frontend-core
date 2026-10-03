import type { TSlotVariant } from '@/core/slot-variant'
import type { HTMLAttributes, ReactNode } from 'react'

export type TScrollShadowOrientation = 'horizontal' | 'vertical'

export type TScrollShadowVisibility =
	| 'auto'
	| 'both'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'none'

export interface IScrollShadowProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode
	className?: string
	variant?: TSlotVariant
	/** Направление прокрутки. */
	orientation?: TScrollShadowOrientation
	/** Глубина fade-градиента, px. */
	size?: number
	/** Отступ до начала fade, px. */
	offset?: number
	/** Управление видимостью теней; `auto` — scroll-driven CSS + fallback-хук. */
	visibility?: TScrollShadowVisibility
	/** Выключает детекцию overflow и scroll-driven fade. */
	isEnabled?: boolean
	/** Скрывает нативный scrollbar, сохраняя прокрутку. */
	isScrollBarHidden?: boolean
	onVisibilityChange?: (visibility: TScrollShadowVisibility) => void
}
