import type { TSlotVariant } from '@/core/slot-variant'
import type {
	CSSProperties,
	ReactElement,
	ReactNode,
	Ref,
	RefObject,
} from 'react'

export type TPopoverPortalContainer =
	| HTMLElement
	| ShadowRoot
	| RefObject<HTMLElement | ShadowRoot | null>
	| null

export type TPopoverPlacement =
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'right'
	| 'right-start'
	| 'right-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'left-start'
	| 'left-end'

export interface IPopoverOpenChangeDetails {
	reason?: string
	event?: Event
	cancel?: () => void
}

export interface IPopoverProps {
	children: ReactNode
	open?: boolean
	onOpenChange?: (isOpen: boolean, details?: IPopoverOpenChangeDetails) => void
	placement?: TPopoverPlacement
	offset?: number
}

export interface IPopoverTriggerProps {
	children: ReactElement
	className?: string
	variant?: TSlotVariant
}

export interface IPopoverAnchorProps {
	children: ReactElement<{ className?: string; ref?: Ref<HTMLElement> }>
	className?: string
	variant?: TSlotVariant
}

export interface IPopoverContentProps {
	children: ReactNode
	className?: string
	panelClassName?: string
	hasPanel?: boolean
	initialFocus?: boolean
	finalFocus?: boolean
	style?: CSSProperties
	variant?: TSlotVariant
	/** Куда порталить попап. По умолчанию — hover-корень или document.body. */
	container?: TPopoverPortalContainer
}

export type TPopoverComponent = ((props: IPopoverProps) => ReactNode) & {
	Trigger: (props: IPopoverTriggerProps) => ReactNode
	Anchor: (props: IPopoverAnchorProps) => ReactNode
	Content: (props: IPopoverContentProps) => ReactNode
}
