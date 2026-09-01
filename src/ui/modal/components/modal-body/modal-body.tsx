'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ReactElement, ReactNode } from 'react'
import { MODAL_DISPLAY_NAMES } from '../../constants/modal.constants'

/**
 * Основной контент модалки.
 *
 * @example
 * ```tsx
 * <Modal.Body>Текст диалога</Modal.Body>
 * ```
 */
export const ModalBody = ({
	children,
	className,
	variant = 'default',
}: {
	children: ReactNode
	className?: string
	variant?: TSlotVariant
}): ReactElement => {
	return (
		<div data-slot='modal-body' data-variant={variant} className={cn(className)}>
			{children}
		</div>
	)
}

ModalBody.displayName = MODAL_DISPLAY_NAMES.BODY
