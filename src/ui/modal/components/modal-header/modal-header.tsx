'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ReactElement, ReactNode } from 'react'
import { MODAL_DISPLAY_NAMES } from '../../constants/modal.constants'

/**
 * Шапка модалки: Title и Close.
 *
 * @example
 * ```tsx
 * <Modal.Header>
 *   <Modal.Title>Заголовок</Modal.Title>
 *   <Modal.Close />
 * </Modal.Header>
 * ```
 */
export const ModalHeader = ({
	children,
	className,
	variant = 'default',
}: {
	children: ReactNode
	className?: string
	variant?: TSlotVariant
}): ReactElement => {
	return (
		<div
			data-slot='modal-header'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</div>
	)
}

ModalHeader.displayName = MODAL_DISPLAY_NAMES.HEADER
