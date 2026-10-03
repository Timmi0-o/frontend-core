import type { TSlotVariant } from '@/core/slot-variant'
import type { HTMLAttributes, ReactNode } from 'react'

export type TScrollShadowOrientation = 'horizontal' | 'vertical'

export interface IScrollShadowProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode
	className?: string
	variant?: TSlotVariant
	/** Направление прокрутки. */
	orientation?: TScrollShadowOrientation
	/** Глубина градиента на краях, px. */
	size?: number
	/** Отступ от края до появления тени, px. */
	offset?: number
	/** Выключает отслеживание overflow и сброс data-*-scroll. */
	isEnabled?: boolean
}
