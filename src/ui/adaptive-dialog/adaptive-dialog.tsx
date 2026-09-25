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
import { BottomSheet, type TBottomSheetVariant } from '../modal/bottom-sheet/bottom-sheet'
import { ModalBody } from '../modal/components/modal-body/modal-body'
import { ModalFooter } from '../modal/components/modal-footer/modal-footer'
import { ModalHeader } from '../modal/components/modal-header/modal-header'
import { Drawer } from '../modal/drawer/drawer'
import { Modal } from '../modal/modal'

const DEFAULT_DIALOG_TITLE = 'Диалог'

export type TAdaptiveDialogMode = 'drawer' | 'modal'

type TAdaptiveDialogShell = 'sheet' | TAdaptiveDialogMode

interface IAdaptiveDialogContextValue {
	isMobile: boolean
	shell: TAdaptiveDialogShell
	isOpen: boolean
	onOpenChange: (isNextOpen: boolean) => void
	title: string
	variant: TBottomSheetVariant
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
	variant?: TBottomSheetVariant
	height?: CSSProperties['height']
	isMobileCondition?: TMobileCondition
	/** `modal` — диалог по центру. `drawer` — боковая панель. На мобилке всегда шторка. */
	mode?: TAdaptiveDialogMode
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
	mode = 'modal',
}: IAdaptiveDialogRootProps): ReactElement => {
	const isMobile = useMobileCondition(isMobileCondition)
	const shell: TAdaptiveDialogShell = isMobile ? 'sheet' : mode

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
			shell,
			isOpen,
			onOpenChange: handleOpenChange,
			title,
			variant,
			height,
			hasMounted,
		}),
		[
			handleOpenChange,
			hasMounted,
			height,
			isMobile,
			isOpen,
			shell,
			title,
			variant,
		],
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
	variant?: TBottomSheetVariant
}

const AdaptiveDialogContent = ({
	className,
	contentClassName,
	children,
	variant: variantProp,
}: IAdaptiveDialogContentProps): ReactElement | null => {
	const {
		shell,
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

	if (shell === 'sheet') {
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

	if (shell === 'drawer') {
		return (
			<Drawer
				open={isOpen}
				onOpenChange={onOpenChange}
				title={title}
				className={className}
				variant={variant === 'unstyled' ? 'unstyled' : 'default'}
			>
				{children}
			</Drawer>
		)
	}

	return (
		<Modal
			open={isOpen}
			onOpenChange={onOpenChange}
			title={title}
			className={className}
			variant={variant === 'secondary' ? 'default' : variant}
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
	const { shell } = useAdaptiveDialog()

	if (shell === 'sheet') {
		return (
			<BottomSheet.Header className={className}>{children}</BottomSheet.Header>
		)
	}

	if (shell === 'drawer') {
		return (
			<Drawer.Header className={className} variant={variant}>
				{children}
			</Drawer.Header>
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
	const { shell } = useAdaptiveDialog()

	if (shell === 'sheet') {
		return <div className={cn(className)}>{children}</div>
	}

	if (shell === 'drawer') {
		return (
			<Drawer.Body className={className} variant={variant}>
				{children}
			</Drawer.Body>
		)
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
	const { shell } = useAdaptiveDialog()

	if (shell === 'sheet') {
		return (
			<BottomSheet.Footer className={className}>{children}</BottomSheet.Footer>
		)
	}

	if (shell === 'drawer') {
		return (
			<Drawer.Footer className={className} variant={variant}>
				{children}
			</Drawer.Footer>
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
	const { shell } = useAdaptiveDialog()

	if (shell === 'sheet') {
		return (
			<h2 data-slot='modal-title' data-variant={variant} className={className}>
				{children}
			</h2>
		)
	}

	if (shell === 'drawer') {
		return (
			<Drawer.Title className={className} variant={variant}>
				{children}
			</Drawer.Title>
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
	const { shell } = useAdaptiveDialog()

	if (shell === 'sheet') {
		return (
			<BottomSheet.Description className={className}>
				{children}
			</BottomSheet.Description>
		)
	}

	if (shell === 'drawer') {
		return <Drawer.Description className={className}>{children}</Drawer.Description>
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
	const { shell } = useAdaptiveDialog()

	if (shell === 'sheet') {
		return (
			<BottomSheet.Close className={className}>{children}</BottomSheet.Close>
		)
	}

	if (shell === 'drawer') {
		return <Drawer.Close className={className}>{children}</Drawer.Close>
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
 * `mode="drawer"` на десктопе открывает боковую панель, на мобилке остаётся шторка.
 * `isMobileCondition` — boolean или CSS media query.
 * `variant="secondary"` на мобилке даёт парящую шторку с отступами от краёв.
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
