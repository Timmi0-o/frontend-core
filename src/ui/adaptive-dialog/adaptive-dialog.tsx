'use client'

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ButtonHTMLAttributes,
	type CSSProperties,
	type ReactElement,
	type ReactNode,
} from 'react'

import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import {
	useMobileCondition,
	type TMobileCondition,
} from '@/hooks/use-mobile-condition'
import { BottomSheet } from '../modal/bottom-sheet/bottom-sheet'
import { ModalBody } from '../modal/components/modal-body/modal-body'
import { ModalFooter } from '../modal/components/modal-footer/modal-footer'
import { ModalHeader } from '../modal/components/modal-header/modal-header'
import { Modal } from '../modal/modal'

const DEFAULT_DIALOG_TITLE = 'Диалог'

interface IAdaptiveDialogContextValue {
	isMobile: boolean
	isOpen: boolean
	onOpenChange: (isNextOpen: boolean) => void
	title: string
	variant: TSlotVariant
	height: CSSProperties['height']
	hasMounted: boolean
}

const AdaptiveDialogContext = createContext<IAdaptiveDialogContextValue | null>(
	null,
)

/**
 * Читает режим AdaptiveDialog (модал vs шторка).
 * Вызывать только из слотов AdaptiveDialog.
 */
export const useAdaptiveDialog = (): IAdaptiveDialogContextValue => {
	const context = useContext(AdaptiveDialogContext)

	if (!context) {
		throw new Error(
			'AdaptiveDialog compound components must be used within AdaptiveDialog',
		)
	}

	return context
}

export interface IAdaptiveDialogRootProps {
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (isOpen: boolean) => void
	children?: ReactNode
	title?: string
	variant?: TSlotVariant
	height?: CSSProperties['height']
	isMobileCondition?: TMobileCondition
}

const AdaptiveDialogRoot = ({
	open,
	defaultOpen = false,
	onOpenChange,
	children,
	title = DEFAULT_DIALOG_TITLE,
	variant = 'default',
	height = 'auto',
	isMobileCondition,
}: IAdaptiveDialogRootProps): ReactElement => {
	const isMobile = useMobileCondition(isMobileCondition)

	const [hasMounted, setHasMounted] = useState(false)
	const [isUncontrolledOpen, setIsUncontrolledOpen] = useState(defaultOpen)

	const isControlled = typeof open === 'boolean'
	const isOpen = isControlled ? open : isUncontrolledOpen

	const handleOpenChange = useCallback(
		(isNextOpen: boolean): void => {
			if (!isControlled) {
				setIsUncontrolledOpen(isNextOpen)
			}

			onOpenChange?.(isNextOpen)
		},
		[isControlled, onOpenChange],
	)

	const contextValue = useMemo(
		(): IAdaptiveDialogContextValue => ({
			isMobile,
			isOpen,
			onOpenChange: handleOpenChange,
			title,
			variant,
			height,
			hasMounted,
		}),
		[handleOpenChange, hasMounted, height, isMobile, isOpen, title, variant],
	)

	useEffect(() => {
		setHasMounted(true)
	}, [])

	return (
		<AdaptiveDialogContext.Provider value={contextValue}>
			{children}
		</AdaptiveDialogContext.Provider>
	)
}

AdaptiveDialogRoot.displayName = 'AdaptiveDialog'

export interface IAdaptiveDialogContentProps {
	className?: string
	contentClassName?: string
	children?: ReactNode
	variant?: TSlotVariant
}

const AdaptiveDialogContent = ({
	className,
	contentClassName,
	children,
	variant: variantProp,
}: IAdaptiveDialogContentProps): ReactElement | null => {
	const {
		isMobile,
		isOpen,
		onOpenChange,
		title,
		variant: contextVariant,
		height,
		hasMounted,
	} = useAdaptiveDialog()
	const variant = variantProp ?? contextVariant

	if (!hasMounted) {
		return null
	}

	if (isMobile) {
		return (
			<BottomSheet
				open={isOpen}
				onOpenChange={onOpenChange}
				title={title}
				height={height}
				contentClassName={cn(className, contentClassName)}
				variant={variant}
			>
				{children}
			</BottomSheet>
		)
	}

	return (
		<Modal
			open={isOpen}
			onOpenChange={onOpenChange}
			title={title}
			className={className}
			variant={variant}
		>
			{children}
		</Modal>
	)
}

AdaptiveDialogContent.displayName = 'AdaptiveDialog.Content'

export interface IAdaptiveDialogSlotProps {
	className?: string
	children?: ReactNode
	variant?: TSlotVariant
}

const AdaptiveDialogHeader = ({
	className,
	children,
	variant = 'default',
}: IAdaptiveDialogSlotProps): ReactElement => {
	const { isMobile } = useAdaptiveDialog()

	if (isMobile) {
		return (
			<BottomSheet.Header className={className}>{children}</BottomSheet.Header>
		)
	}

	return (
		<ModalHeader className={className} variant={variant}>
			{children}
		</ModalHeader>
	)
}

AdaptiveDialogHeader.displayName = 'AdaptiveDialog.Header'

const AdaptiveDialogBody = ({
	className,
	children,
	variant = 'default',
}: IAdaptiveDialogSlotProps): ReactElement => {
	const { isMobile } = useAdaptiveDialog()

	if (isMobile) {
		return <div className={cn(className)}>{children}</div>
	}

	return (
		<ModalBody className={className} variant={variant}>
			{children}
		</ModalBody>
	)
}

AdaptiveDialogBody.displayName = 'AdaptiveDialog.Body'

const AdaptiveDialogFooter = ({
	className,
	children,
	variant = 'default',
}: IAdaptiveDialogSlotProps): ReactElement => {
	const { isMobile } = useAdaptiveDialog()

	if (isMobile) {
		return (
			<BottomSheet.Footer className={className}>{children}</BottomSheet.Footer>
		)
	}

	return (
		<ModalFooter className={className} variant={variant}>
			{children}
		</ModalFooter>
	)
}

AdaptiveDialogFooter.displayName = 'AdaptiveDialog.Footer'

const AdaptiveDialogTitle = ({
	className,
	children,
	variant = 'default',
}: IAdaptiveDialogSlotProps): ReactElement => {
	const { isMobile } = useAdaptiveDialog()

	if (isMobile) {
		return (
			<h2 data-slot='modal-title' data-variant={variant} className={className}>
				{children}
			</h2>
		)
	}

	return (
		<Modal.Title className={className} variant={variant}>
			{children}
		</Modal.Title>
	)
}

AdaptiveDialogTitle.displayName = 'AdaptiveDialog.Title'

/**
 * Подзаголовок диалога. На десктопе — `modal-description`, на мобилке — слот шторки.
 * Нужен, чтобы description не наследовал размер и вес title из шапки.
 */
const AdaptiveDialogDescription = ({
	className,
	children,
	variant = 'default',
}: IAdaptiveDialogSlotProps): ReactElement => {
	const { isMobile } = useAdaptiveDialog()

	if (isMobile) {
		return (
			<BottomSheet.Description className={className}>
				{children}
			</BottomSheet.Description>
		)
	}

	return (
		<Modal.Description className={className} variant={variant}>
			{children}
		</Modal.Description>
	)
}

AdaptiveDialogDescription.displayName = 'AdaptiveDialog.Description'

const AdaptiveDialogTrigger = ({
	children,
	onClick,
	type = 'button',
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>): ReactElement => {
	const { onOpenChange } = useAdaptiveDialog()

	return (
		<button
			{...props}
			type={type}
			onClick={(event) => {
				onClick?.(event)
				onOpenChange(true)
			}}
		>
			{children}
		</button>
	)
}

AdaptiveDialogTrigger.displayName = 'AdaptiveDialog.Trigger'

const AdaptiveDialogClose = ({
	children,
	className,
	variant = 'default',
}: IAdaptiveDialogSlotProps): ReactElement => {
	const { isMobile } = useAdaptiveDialog()

	if (isMobile) {
		return (
			<BottomSheet.Close className={className}>{children}</BottomSheet.Close>
		)
	}

	return (
		<Modal.Close className={className} variant={variant}>
			{children}
		</Modal.Close>
	)
}

AdaptiveDialogClose.displayName = 'AdaptiveDialog.Close'

type TAdaptiveDialogComponent = typeof AdaptiveDialogRoot & {
	Trigger: typeof AdaptiveDialogTrigger
	Close: typeof AdaptiveDialogClose
	Content: typeof AdaptiveDialogContent
	Header: typeof AdaptiveDialogHeader
	Body: typeof AdaptiveDialogBody
	Footer: typeof AdaptiveDialogFooter
	Title: typeof AdaptiveDialogTitle
	Description: typeof AdaptiveDialogDescription
}

/**
 * На десктопе — Modal, на мобилке — BottomSheet. Порог по умолчанию: max-width 1024px.
 * `isMobileCondition` — boolean или CSS media query.
 *
 * @example
 * ```tsx
 * <AdaptiveDialog open={isOpen} onOpenChange={setIsOpen} title="Фильтры">
 *   <AdaptiveDialog.Content>
 *     <AdaptiveDialog.Header>
 *       <AdaptiveDialog.Title>Фильтры</AdaptiveDialog.Title>
 *     </AdaptiveDialog.Header>
 *     <AdaptiveDialog.Body>…</AdaptiveDialog.Body>
 *   </AdaptiveDialog.Content>
 * </AdaptiveDialog>
 * ```
 */
export const AdaptiveDialog: TAdaptiveDialogComponent = Object.assign(
	AdaptiveDialogRoot,
	{
		Trigger: AdaptiveDialogTrigger,
		Close: AdaptiveDialogClose,
		Content: AdaptiveDialogContent,
		Header: AdaptiveDialogHeader,
		Body: AdaptiveDialogBody,
		Footer: AdaptiveDialogFooter,
		Title: AdaptiveDialogTitle,
		Description: AdaptiveDialogDescription,
	},
)
