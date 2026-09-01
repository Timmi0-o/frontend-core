import type { HTMLAttributes, ReactNode } from 'react'

export type TBadgeVariant =
	| 'default'
	| 'success'
	| 'error'
	| 'warning'
	| 'info'
	| 'outline'
	| 'unstyled'

export type TBadgePlacement =
	| 'static'
	| 'top'
	| 'bottom'
	| 'top-right'
	| 'top-left'
	| 'bottom-right'
	| 'bottom-left'

export type TBadgePosition = TBadgePlacement | 'absolute'

export interface IBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
	variant?: TBadgeVariant
	placement?: TBadgePlacement
	position?: TBadgePosition
	content?: ReactNode
	className?: string
}
