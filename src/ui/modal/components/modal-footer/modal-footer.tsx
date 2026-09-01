'use client'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ReactElement, ReactNode } from 'react'
import { MODAL_DISPLAY_NAMES } from '../../constants/modal.constants'

/**
 * Низ модалки: действия.
 *
 * @example
 * ```tsx
 * <Modal.Footer>
 *   <Button variant="ghost">Отмена</Button>
 *   <Button>Ок</Button>
 * </Modal.Footer>
 * ```
 */
export const ModalFooter = ({
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
			data-slot='modal-footer'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</div>
	)
}

ModalFooter.displayName = MODAL_DISPLAY_NAMES.FOOTER
