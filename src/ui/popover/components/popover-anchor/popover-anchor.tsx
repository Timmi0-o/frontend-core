'use client'

import { cn } from '@/core/cn'
import type { ReactNode } from 'react'
import { POPOVER_DISPLAY_NAMES } from '../../constants/popover.constants'
import { usePopoverContext } from '../../context/popover-context'
import type { IPopoverAnchorProps } from '../../types/i-popover-props'
import { mergePopoverAnchorProps } from '../../utils/merge-popover-anchor-props'

export const PopoverAnchor = ({
	children,
	className,
	variant = 'default',
}: IPopoverAnchorProps): ReactNode => {
	const { setAnchorElement } = usePopoverContext()

	return mergePopoverAnchorProps(
		children,
		setAnchorElement,
		cn(className),
		variant,
	)
}

PopoverAnchor.displayName = POPOVER_DISPLAY_NAMES.ANCHOR
