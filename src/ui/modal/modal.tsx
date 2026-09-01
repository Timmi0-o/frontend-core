'use client'

import { Dialog } from '@base-ui/react/dialog'
import { cn } from '@/core/cn'
import {
	OverlayLayerProvider,
	overlayLayerStyle,
	useOverlayLayer,
} from '@/core/overlay-layer'
import type { TSlotVariant } from '@/core/slot-variant'
import { useInheritedUiKit } from '@/core/use-inherited-ui-kit'
import { useLayoutEffect, useState, type ReactElement, type ReactNode } from 'react'
import { ModalBody } from './components/modal-body/modal-body'
import { ModalFooter } from './components/modal-footer/modal-footer'
import { ModalHeader } from './components/modal-header/modal-header'
import { MODAL_DISPLAY_NAMES } from './constants/modal.constants'
import { ModalContext, useModalContext } from './context/modal-context'

const DEFAULT_DIALOG_TITLE = 'Диалог'

export interface IModalRootProps {
	open: boolean
	onOpenChange: (isOpen: boolean) => void
	children: ReactNode
	className?: string
	animation?: 'default' | 'bottom-sheet'
	title?: string
	variant?: TSlotVariant
}

const ModalRoot = ({
	open,
	onOpenChange,
	children,
	className,
	animation = 'default',
	title,
	variant = 'default',
}: IModalRootProps): ReactElement => {
	const [hasVisibleTitle, setHasVisibleTitle] = useState(false)
	const { hostRef, uiKit } = useInheritedUiKit()
	const { overlayZ } = useOverlayLayer()

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<span ref={hostRef} hidden />
			<ModalContext.Provider
				value={{ isOpen: open, onOpenChange, setHasVisibleTitle }}
			>
				<Dialog.Portal>
					<div data-ui-kit={uiKit} style={overlayLayerStyle(overlayZ)}>
						<Dialog.Backdrop data-slot='modal-overlay' />
						<Dialog.Popup
							data-slot='modal-content'
							data-variant={variant}
							data-animation={animation}
							className={cn(className)}
						>
							<OverlayLayerProvider overlayZ={overlayZ}>
								{hasVisibleTitle ? null : (
									<Dialog.Title data-slot='modal-title-hidden'>
										{title ?? DEFAULT_DIALOG_TITLE}
									</Dialog.Title>
								)}
								{children}
							</OverlayLayerProvider>
						</Dialog.Popup>
					</div>
				</Dialog.Portal>
			</ModalContext.Provider>
		</Dialog.Root>
	)
}

ModalRoot.displayName = MODAL_DISPLAY_NAMES.ROOT

export interface IModalTitleProps {
	children: ReactNode
	className?: string
	variant?: TSlotVariant
}

const ModalTitle = ({
	children,
	className,
	variant = 'default',
}: IModalTitleProps): ReactElement => {
	const { setHasVisibleTitle } = useModalContext()

	useLayoutEffect(() => {
		setHasVisibleTitle(true)
		return () => setHasVisibleTitle(false)
	}, [setHasVisibleTitle])

	return (
		<Dialog.Title
			data-slot='modal-title'
			data-variant={variant}
			className={className}
		>
			{children}
		</Dialog.Title>
	)
}

ModalTitle.displayName = MODAL_DISPLAY_NAMES.TITLE

export interface IModalCloseProps {
	children?: ReactNode
	className?: string
	variant?: TSlotVariant
}

const ModalClose = ({
	children,
	className,
	variant = 'default',
}: IModalCloseProps): ReactElement => {
	return (
		<Dialog.Close
			data-slot='modal-close'
			data-variant={variant}
			className={className}
		>
			{children}
		</Dialog.Close>
	)
}

ModalClose.displayName = MODAL_DISPLAY_NAMES.CLOSE

type TModalComponent = typeof ModalRoot & {
	Header: typeof ModalHeader
	Body: typeof ModalBody
	Footer: typeof ModalFooter
	Title: typeof ModalTitle
	Close: typeof ModalClose
	Root: typeof ModalRoot
}

/**
 * Модалка. Контролируется `open` / `onOpenChange`. Без видимого Title кит ставит скрытый заголовок.
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onOpenChange={setIsOpen} title="Подтверждение">
 *   <Modal.Header>
 *     <Modal.Title>Отменить заказ?</Modal.Title>
 *     <Modal.Close />
 *   </Modal.Header>
 *   <Modal.Body>Бронь снимется.</Modal.Body>
 *   <Modal.Footer>
 *     <Button variant="ghost" onClick={() => setIsOpen(false)}>Назад</Button>
 *     <Button variant="danger" onClick={handleCancel}>Отменить</Button>
 *   </Modal.Footer>
 * </Modal>
 * ```
 */
export const Modal: TModalComponent = Object.assign(ModalRoot, {
	Root: ModalRoot,
	Header: ModalHeader,
	Body: ModalBody,
	Footer: ModalFooter,
	Title: ModalTitle,
	Close: ModalClose,
})
