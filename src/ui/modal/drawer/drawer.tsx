'use client'

import { cn } from '@/core/cn'
import {
	OverlayLayerProvider,
	overlayBackdropStyle,
	overlayLayerStyle,
	useOverlayLayer,
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

const DrawerKitContext = createContext<string | undefined>(undefined)

const useDrawerUiKit = (): string | undefined => useContext(DrawerKitContext)

export interface IDrawerRootProps {
	open: boolean
	onOpenChange: (isOpen: boolean) => void
	onCloseAnimationEnd?: () => void
	title: string
	children: ReactNode
	width?: CSSProperties['width']
	direction?: 'left' | 'right'
	className?: string
	contentClassName?: string
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
	const { hostRef, uiKit } = useInheritedUiKit()

	return (
		<DrawerKitContext.Provider value={uiKit}>
			<DrawerPrimitive.Root
				data-slot='drawer'
				shouldScaleBackground={shouldScaleBackground}
				repositionInputs={repositionInputs}
				fixed={fixed}
				setBackgroundColorOnScale={setBackgroundColorOnScale}
				direction={direction}
				dismissible={dismissible}
				modal={modal}
				{...props}
			>
				<span ref={hostRef} hidden />
				{props.children}
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
		uiKit?: string
		variant?: TSlotVariant
	}
>(function DrawerOverlay(
	{ uiKit, variant = 'default', className, style, ...props },
	ref,
): ReactElement {
	return (
		<DrawerPrimitive.Overlay
			ref={ref}
			data-ui-kit={uiKit}
			data-slot='drawer-overlay'
			data-variant={variant}
			className={cn(className)}
			style={{ ...overlayBackdropStyle(), ...style }}
			{...props}
		/>
	)
})

const DrawerContent = forwardRef<
	HTMLDivElement,
	ComponentProps<typeof DrawerPrimitive.Content> & {
		uiKit?: string
		bodyClassName?: string
		variant?: TSlotVariant
	}
>(function DrawerContent(
	{
		uiKit,
		bodyClassName,
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
			style={style}
			onPointerDownOutside={handlePointerDownOutside}
			onInteractOutside={handleInteractOutside}
			onFocusOutside={handleFocusOutside}
			{...props}
		>
			{children}
		</DrawerPrimitive.Content>
	)
})

function DrawerHeader({
	className,
	...props
}: ComponentProps<'div'>): ReactElement {
	return (
		<div data-slot='drawer-header' className={cn(className)} {...props} />
	)
}

function DrawerFooter({
	className,
	...props
}: ComponentProps<'div'>): ReactElement {
	return (
		<div data-slot='drawer-footer' className={cn(className)} {...props} />
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

const DrawerConvenience = ({
	open,
	onOpenChange,
	onCloseAnimationEnd,
	title,
	children,
	width = 'min(480px, 100vw)',
	direction = 'right',
	className,
	contentClassName,
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
			<DrawerConvenienceBody
				title={title}
				width={width}
				className={className}
				contentClassName={contentClassName}
				variant={variant}
			>
				{children}
			</DrawerConvenienceBody>
		</DrawerPrimitiveRoot>
	)
}

function DrawerConvenienceBody({
	title,
	children,
	width,
	className,
	contentClassName,
	variant = 'default',
}: Pick<
	IDrawerRootProps,
	'title' | 'children' | 'width' | 'className' | 'contentClassName' | 'variant'
>): ReactElement {
	const uiKit = useDrawerUiKit()
	const { overlayZ } = useOverlayLayer()
	const layerStyle = overlayLayerStyle(overlayZ)

	const overlayStyle: CSSProperties = {
		...layerStyle,
		...overlayBackdropStyle(),
		zIndex: overlayZ,
	}
	const contentStyle: CSSProperties = {
		...layerStyle,
		zIndex: overlayZ + 1,
		width,
	}

	return (
		<DrawerPortal>
			<DrawerOverlay uiKit={uiKit} style={overlayStyle} variant={variant} />
			<DrawerContent
				uiKit={uiKit}
				className={className}
				style={contentStyle}
				variant={variant}
			>
				<OverlayLayerProvider overlayZ={overlayZ}>
					<DrawerTitle variant={variant}>{title}</DrawerTitle>
					<div data-slot='drawer-body' className={cn(contentClassName)}>
						{children}
					</div>
				</OverlayLayerProvider>
			</DrawerContent>
		</DrawerPortal>
	)
}

DrawerConvenience.displayName = 'Drawer'

type TDrawerComponent = typeof DrawerConvenience & {
	Root: typeof DrawerPrimitiveRoot
	Trigger: typeof DrawerTrigger
	Portal: typeof DrawerPortal
	Close: typeof DrawerClose
	Overlay: typeof DrawerOverlay
	Content: typeof DrawerContent
	Header: typeof DrawerHeader
	Footer: typeof DrawerFooter
	Title: typeof DrawerTitle
	Description: typeof DrawerDescription
}

/**
 * Боковая панель (drawer). Короткий путь: `open`, `title`, дети. Кастом — `Root` + `Content`.
 *
 * @example
 * ```tsx
 * <Drawer open={isOpen} onOpenChange={setIsOpen} title="Фильтры">
 *   <Checkbox label="Только активные" checked={isActive} onCheckedChange={setIsActive} />
 * </Drawer>
 * ```
 */
export const Drawer: TDrawerComponent = Object.assign(DrawerConvenience, {
	Root: DrawerPrimitiveRoot,
	Trigger: DrawerTrigger,
	Portal: DrawerPortal,
	Close: DrawerClose,
	Overlay: DrawerOverlay,
	Content: DrawerContent,
	Header: DrawerHeader,
	Footer: DrawerFooter,
	Title: DrawerTitle,
	Description: DrawerDescription,
})
