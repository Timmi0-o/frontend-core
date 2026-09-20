'use client'

import { cn } from '@/core/cn'
import {
	OpenOverlayZProvider,
	OverlayLayerProvider,
	overlayBackdropStyle,
	overlayLayerStyle,
	useActiveOverlayZ,
	useGuardedOverlayOpenChange,
	useHasOverlayAbove,
	useOverlayPortalContainer,
} from '@/core/overlay-layer'
import { shouldPreventOverlayDismiss } from '@/core/overlay-floating-target'
import type { TSlotVariant } from '@/core/slot-variant'
import { useInheritedUiKit } from '@/core/use-inherited-ui-kit'
import {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	type ComponentProps,
	type CSSProperties,
	type ReactElement,
	type ReactNode,
} from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

const DEFAULT_DRAWER_TITLE = 'Панель'

const DrawerKitContext = createContext<string | undefined>(undefined)

const useDrawerUiKit = (): string | undefined => useContext(DrawerKitContext)

export interface IDrawerRootProps {
	open: boolean
	onOpenChange: (isOpen: boolean) => void
	onCloseAnimationEnd?: () => void
	title?: string
	children: ReactNode
	width?: CSSProperties['width']
	direction?: 'left' | 'right'
	className?: string
	variant?: TSlotVariant
}

function DrawerPrimitiveRoot({
	shouldScaleBackground = false,
	repositionInputs = false,
	fixed = true,
	setBackgroundColorOnScale = false,
	direction = 'right',
	dismissible = true,
	modal = true,
	...props
}: ComponentProps<typeof DrawerPrimitive.Root>): ReactElement {
	const isOpen = props.open === true

	return (
		<OpenOverlayZProvider isOpen={isOpen}>
			<DrawerGuardedRoot
				shouldScaleBackground={shouldScaleBackground}
				repositionInputs={repositionInputs}
				fixed={fixed}
				setBackgroundColorOnScale={setBackgroundColorOnScale}
				direction={direction}
				dismissible={dismissible}
				modal={modal}
				{...props}
			/>
		</OpenOverlayZProvider>
	)
}

function DrawerGuardedRoot({
	dismissible = true,
	onOpenChange,
	children,
	...props
}: ComponentProps<typeof DrawerPrimitive.Root>): ReactElement {
	const { hostRef, uiKit } = useInheritedUiKit()
	const { hasOverlayAbove, onOpenChange: handleOpenChange } =
		useGuardedOverlayOpenChange(onOpenChange)

	return (
		<DrawerKitContext.Provider value={uiKit}>
			<DrawerPrimitive.Root
				data-slot='drawer'
				dismissible={dismissible && !hasOverlayAbove}
				onOpenChange={handleOpenChange}
				{...props}
			>
				<span ref={hostRef} hidden />
				{children}
			</DrawerPrimitive.Root>
		</DrawerKitContext.Provider>
	)
}

function DrawerTrigger({
	...props
}: ComponentProps<typeof DrawerPrimitive.Trigger>): ReactElement {
	return <DrawerPrimitive.Trigger data-slot='drawer-trigger' {...props} />
}

function DrawerPortal({
	container,
	...props
}: ComponentProps<typeof DrawerPrimitive.Portal>): ReactElement | null {
	const defaultContainer = useOverlayPortalContainer()
	const resolvedContainer = container ?? defaultContainer

	if (!resolvedContainer) {
		return null
	}

	return (
		<DrawerPrimitive.Portal
			data-slot='drawer-portal'
			{...props}
			container={resolvedContainer}
		/>
	)
}

function DrawerClose({
	...props
}: ComponentProps<typeof DrawerPrimitive.Close>): ReactElement {
	return <DrawerPrimitive.Close data-slot='drawer-close' {...props} />
}

const DrawerOverlay = forwardRef<
	HTMLDivElement,
	ComponentProps<typeof DrawerPrimitive.Overlay> & {
		variant?: TSlotVariant
	}
>(function DrawerOverlay(
	{ variant = 'default', className, style, ...props },
	ref,
): ReactElement {
	const uiKit = useDrawerUiKit()
	const overlayZ = useActiveOverlayZ()
	const hasOverlayAbove = useHasOverlayAbove()

	return (
		<DrawerPrimitive.Overlay
			ref={ref}
			data-ui-kit={uiKit}
			data-slot='drawer-overlay'
			data-variant={variant}
			className={cn(className)}
			style={{
				...overlayLayerStyle(overlayZ),
				...overlayBackdropStyle(),
				pointerEvents: hasOverlayAbove ? 'none' : 'auto',
				zIndex: overlayZ,
				...style,
			}}
			{...props}
		/>
	)
})

const DrawerContent = forwardRef<
	HTMLDivElement,
	ComponentProps<typeof DrawerPrimitive.Content> & {
		variant?: TSlotVariant
	}
>(function DrawerContent(
	{
		variant = 'default',
		className,
		style,
		onPointerDownOutside,
		onInteractOutside,
		onFocusOutside,
		children,
		...props
	},
	ref,
): ReactElement {
	const uiKit = useDrawerUiKit()
	const overlayZ = useActiveOverlayZ()

	const preventFloatingOutsideDismiss = useCallback(
		(event: CustomEvent<{ originalEvent: Event }>) => {
			if (shouldPreventOverlayDismiss(event)) {
				event.preventDefault()
			}
		},
		[],
	)

	const handlePointerDownOutside = useCallback(
		(event: CustomEvent<{ originalEvent: PointerEvent }>) => {
			preventFloatingOutsideDismiss(event)
			onPointerDownOutside?.(event)
		},
		[onPointerDownOutside, preventFloatingOutsideDismiss],
	)

	const handleInteractOutside = useCallback(
		(event: CustomEvent<{ originalEvent: PointerEvent | FocusEvent }>) => {
			preventFloatingOutsideDismiss(event)
			onInteractOutside?.(event)
		},
		[onInteractOutside, preventFloatingOutsideDismiss],
	)

	const handleFocusOutside = useCallback(
		(event: CustomEvent<{ originalEvent: FocusEvent }>) => {
			preventFloatingOutsideDismiss(event)
			onFocusOutside?.(event)
		},
		[onFocusOutside, preventFloatingOutsideDismiss],
	)

	return (
		<DrawerPrimitive.Content
			ref={ref}
			data-ui-kit={uiKit}
			data-slot='drawer-content'
			data-variant={variant}
			className={cn(className)}
			style={{
				...overlayLayerStyle(overlayZ),
				zIndex: overlayZ + 1,
				...style,
			}}
			onPointerDownOutside={handlePointerDownOutside}
			onInteractOutside={handleInteractOutside}
			onFocusOutside={handleFocusOutside}
			{...props}
		>
			<OverlayLayerProvider overlayZ={overlayZ}>
				{children}
			</OverlayLayerProvider>
		</DrawerPrimitive.Content>
	)
})

function DrawerHeader({
	className,
	variant = 'default',
	...props
}: ComponentProps<'div'> & { variant?: TSlotVariant }): ReactElement {
	return (
		<div
			data-slot='drawer-header'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

function DrawerBody({
	className,
	variant = 'default',
	...props
}: ComponentProps<'div'> & { variant?: TSlotVariant }): ReactElement {
	return (
		<div
			data-slot='drawer-body'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

function DrawerFooter({
	className,
	variant = 'default',
	...props
}: ComponentProps<'div'> & { variant?: TSlotVariant }): ReactElement {
	return (
		<div
			data-slot='drawer-footer'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

function DrawerTitleHidden({
	children,
	variant = 'default',
}: {
	children: ReactNode
	variant?: TSlotVariant
}): ReactElement {
	return (
		<DrawerPrimitive.Title
			data-slot='drawer-title-hidden'
			data-variant={variant}
		>
			{children}
		</DrawerPrimitive.Title>
	)
}

function DrawerTitle({
	children,
	className,
	variant = 'default',
	...props
}: ComponentProps<typeof DrawerPrimitive.Title> & {
	variant?: TSlotVariant
}): ReactElement {
	return (
		<DrawerPrimitive.Title
			data-slot='drawer-title'
			data-variant={variant}
			className={cn(className)}
			{...props}
		>
			{children}
		</DrawerPrimitive.Title>
	)
}

function DrawerDescription({
	className,
	...props
}: ComponentProps<typeof DrawerPrimitive.Description>): ReactElement {
	return (
		<DrawerPrimitive.Description
			data-slot='drawer-description'
			className={cn(className)}
			{...props}
		/>
	)
}

const DrawerRoot = ({
	open,
	onOpenChange,
	onCloseAnimationEnd,
	title = DEFAULT_DRAWER_TITLE,
	children,
	width = 'min(420px, 100vw)',
	direction = 'right',
	className,
	variant = 'default',
}: IDrawerRootProps): ReactElement => {
	return (
		<DrawerPrimitiveRoot
			open={open}
			onOpenChange={onOpenChange}
			direction={direction}
			onAnimationEnd={(isOpen) => {
				if (!isOpen) {
					onCloseAnimationEnd?.()
				}
			}}
		>
			<DrawerPortal>
				<DrawerOverlay variant={variant} />
				<DrawerContent
					className={className}
					style={{ width }}
					variant={variant}
				>
					<DrawerTitleHidden variant={variant}>{title}</DrawerTitleHidden>
					{children}
				</DrawerContent>
			</DrawerPortal>
		</DrawerPrimitiveRoot>
	)
}

DrawerRoot.displayName = 'Drawer'

type TDrawerComponent = typeof DrawerRoot & {
	Root: typeof DrawerPrimitiveRoot
	Trigger: typeof DrawerTrigger
	Portal: typeof DrawerPortal
	Close: typeof DrawerClose
	Overlay: typeof DrawerOverlay
	Content: typeof DrawerContent
	Header: typeof DrawerHeader
	Body: typeof DrawerBody
	Footer: typeof DrawerFooter
	Title: typeof DrawerTitle
	Description: typeof DrawerDescription
}

/**
 * Боковая панель. Как Modal: слоты `Header` / `Body` / `Footer`.
 *
 * @example
 * ```tsx
 * <Drawer open={isOpen} onOpenChange={setIsOpen} title="Фильтры">
 *   <Drawer.Header>
 *     <Drawer.Title>Фильтры</Drawer.Title>
 *   </Drawer.Header>
 *   <Drawer.Body>
 *     <Checkbox label="Только активные" checked={isActive} onCheckedChange={setIsActive} />
 *   </Drawer.Body>
 *   <Drawer.Footer>
 *     <Button onClick={() => setIsOpen(false)}>Закрыть</Button>
 *   </Drawer.Footer>
 * </Drawer>
 * ```
 */
export const Drawer: TDrawerComponent = Object.assign(DrawerRoot, {
	Root: DrawerPrimitiveRoot,
	Trigger: DrawerTrigger,
	Portal: DrawerPortal,
	Close: DrawerClose,
	Overlay: DrawerOverlay,
	Content: DrawerContent,
	Header: DrawerHeader,
	Body: DrawerBody,
	Footer: DrawerFooter,
	Title: DrawerTitle,
	Description: DrawerDescription,
})
