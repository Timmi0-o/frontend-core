import { cloneElement, type ReactElement, type Ref } from 'react'
import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'

type TAnchorChildProps = {
	className?: string
	ref?: Ref<HTMLElement>
	'data-slot'?: string
	'data-variant'?: TSlotVariant
}

/**
 * Вешает ref якоря на единственный child, без лишнего wrapper-div:
 * Positioner должен мерить существующий узел (поле, trigger-wrap), а не прокладку.
 */
export const mergePopoverAnchorProps = (
	child: ReactElement<TAnchorChildProps>,
	ref: (node: HTMLElement | null) => void,
	className?: string,
	variant: TSlotVariant = 'default',
): ReactElement => {
	return cloneElement(child, {
		ref,
		className: cn(child.props.className, className),
		'data-slot': 'popover-anchor',
		'data-variant': variant,
	})
}
