'use client'

import { cn } from '@/core/cn'
import {
	OverlayLayerProvider,
	overlayLayerStyle,
	useOverlayLayer,
} from '@/core/overlay-layer'
import type { TSlotVariant } from '@/core/slot-variant'
import { useInheritedUiKit } from '@/core/use-inherited-ui-kit'
import {
	createContext,
	forwardRef,
	useContext,
	type ComponentProps,
	type CSSProperties,
	type ReactElement,
	type ReactNode,
} from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

const BottomSheetKitContext = createContext<string | undefined>(undefined)

const useBottomSheetUiKit = (): string | undefined => useContext(BottomSheetKitContext)

export interface IBottomSheetRootProps {
	open: boolean
	onOpenChange: (isOpen: boolean) => void
	onCloseAnimationEnd?: () => void
	title: string
	children: ReactNode
	height?: CSSProperties['height']
	className?: string
	contentClassName?: string
	variant?: TSlotVariant
}

function BottomSheetPrimitiveRoot({
	shouldScaleBackground = false,
	repositionInputs = false,
	fixed = true,
	setBackgroundColorOnScale = false,
	direction = 'bottom',
	dismissible = true,
	modal = true,
	...props
}: ComponentProps<typeof DrawerPrimitive.Root>): ReactElement {
	const { hostRef, uiKit } = useInheritedUiKit()

	return (
		<BottomSheetKitContext.Provider value={uiKit}>
			<DrawerPrimitive.Root
			data-slot='bottom-sheet'
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
		</BottomSheetKitContext.Provider>
	)
}

function BottomSheetTrigger({
	...props
}: ComponentProps<typeof DrawerPrimitive.Trigger>): ReactElement {
	return (
		<DrawerPrimitive.Trigger data-slot='bottom-sheet-trigger' {...props} />
	)
}

function BottomSheetPortal({
	...props
}: ComponentProps<typeof DrawerPrimitive.Portal>): ReactElement {
	return (
		<DrawerPrimitive.Portal data-slot='bottom-sheet-portal' {...props} />
	)
}

function BottomSheetClose({
	...props
}: ComponentProps<typeof DrawerPrimitive.Close>): ReactElement {
	return <DrawerPrimitive.Close data-slot='bottom-sheet-close' {...props} />
}

const BottomSheetOverlay = forwardRef<
	HTMLDivElement,
	ComponentProps<typeof DrawerPrimitive.Overlay> & {
		uiKit?: string
		variant?: TSlotVariant
	}
>(function BottomSheetOverlay(
	{ uiKit, variant = 'default', className, style, ...props },
	ref,
): ReactElement {
	return (
		<DrawerPrimitive.Overlay
			ref={ref}
			data-ui-kit={uiKit}
			data-slot='bottom-sheet-overlay'
			data-variant={variant}
			className={cn(className)}
			style={style}
			{...props}
		/>
	)
})

const BottomSheetContent = forwardRef<
	HTMLDivElement,
	ComponentProps<typeof DrawerPrimitive.Content> & {
		uiKit?: string
		bodyClassName?: string
		variant?: TSlotVariant
	}
>(function BottomSheetContent(
	{
		uiKit,
		bodyClassName,
		variant = 'default',
		className,
		style,
		children,
		...props
	},
	ref,
): ReactElement {
	return (
		<DrawerPrimitive.Content
			ref={ref}
			data-ui-kit={uiKit}
			data-slot='bottom-sheet-content'
			data-variant={variant}
			className={cn(className)}
			style={style}
			{...props}
		>
			{children}
		</DrawerPrimitive.Content>
	)
})

function BottomSheetHeader({
	className,
	...props
}: ComponentProps<'div'>): ReactElement {
	return (
		<div
			data-slot='bottom-sheet-header'
			className={cn(className)}
			{...props}
		/>
	)
}

function BottomSheetFooter({
	className,
	...props
}: ComponentProps<'div'>): ReactElement {
	return (
		<div
			data-slot='bottom-sheet-footer'
			className={cn(className)}
			{...props}
		/>
	)
}

function BottomSheetTitle({
	children,
	className,
	variant = 'default',
	...props
}: ComponentProps<typeof DrawerPrimitive.Title> & {
	variant?: TSlotVariant
}): ReactElement {
	return (
		<DrawerPrimitive.Title
			data-slot='bottom-sheet-title'
			data-variant={variant}
			className={cn(className)}
			{...props}
		>
			{children}
		</DrawerPrimitive.Title>
	)
}

function BottomSheetDescription({
	className,
	...props
}: ComponentProps<typeof DrawerPrimitive.Description>): ReactElement {
	return (
		<DrawerPrimitive.Description
			data-slot='bottom-sheet-description'
			className={cn(className)}
			{...props}
		/>
	)
}

function BottomSheetHandle({
	variant = 'default',
	className,
	...props
}: ComponentProps<typeof DrawerPrimitive.Handle> & {
	variant?: TSlotVariant
}): ReactElement {
	return (
		<DrawerPrimitive.Handle
			data-slot='bottom-sheet-handle'
			data-variant={variant}
			className={cn(className)}
			aria-hidden='true'
			{...props}
		/>
	)
}

/**
 * Готовая шторка с порталом, оверлеем и a11y-заголовком.
 * Для кастомной разметки используйте BottomSheet.Root + BottomSheet.Content.
 */
const BottomSheetConvenience = ({
	open,
	onOpenChange,
	onCloseAnimationEnd,
	title,
	children,
	height = 'calc(100svh - 10px)',
	className,
	contentClassName,
	variant = 'default',
}: IBottomSheetRootProps): ReactElement => {
	return (
		<BottomSheetPrimitiveRoot
			open={open}
			onOpenChange={onOpenChange}
			onAnimationEnd={(isOpen) => {
				if (!isOpen) {
					onCloseAnimationEnd?.()
				}
			}}
		>
			<BottomSheetConvenienceBody
				title={title}
				height={height}
				className={className}
				contentClassName={contentClassName}
				variant={variant}
			>
				{children}
			</BottomSheetConvenienceBody>
		</BottomSheetPrimitiveRoot>
	)
}

function BottomSheetConvenienceBody({
	title,
	children,
	height,
	className,
	contentClassName,
	variant = 'default',
}: Pick<
	IBottomSheetRootProps,
	'title' | 'children' | 'height' | 'className' | 'contentClassName' | 'variant'
>): ReactElement {
	const uiKit = useBottomSheetUiKit()
	const { overlayZ } = useOverlayLayer()
	const layerStyle = overlayLayerStyle(overlayZ)

	const overlayStyle: CSSProperties = { ...layerStyle, zIndex: overlayZ }
	const contentStyle: CSSProperties = {
		...layerStyle,
		zIndex: overlayZ + 1,
		height,
	}

	return (
		<BottomSheetPortal>
			<BottomSheetOverlay
				uiKit={uiKit}
				style={overlayStyle}
				variant={variant}
			/>
			<BottomSheetContent
				uiKit={uiKit}
				className={className}
				style={contentStyle}
				variant={variant}
			>
				<OverlayLayerProvider overlayZ={overlayZ}>
					<BottomSheetTitle variant={variant}>{title}</BottomSheetTitle>
					<BottomSheetHandle variant={variant} />
					<div
						data-slot='bottom-sheet-body'
						className={cn(contentClassName)}
					>
						{children}
					</div>
				</OverlayLayerProvider>
			</BottomSheetContent>
		</BottomSheetPortal>
	)
}

BottomSheetConvenience.displayName = 'BottomSheet'

type TBottomSheetComponent = typeof BottomSheetConvenience & {
	Root: typeof BottomSheetPrimitiveRoot
	Trigger: typeof BottomSheetTrigger
	Portal: typeof BottomSheetPortal
	Close: typeof BottomSheetClose
	Overlay: typeof BottomSheetOverlay
	Content: typeof BottomSheetContent
	Header: typeof BottomSheetHeader
	Footer: typeof BottomSheetFooter
	Title: typeof BottomSheetTitle
	Description: typeof BottomSheetDescription
	Handle: typeof BottomSheetHandle
}

/**
 * Нижняя шторка. Короткий путь: `open`, `title`, дети. Кастом — `Root` + `Content`.
 *
 * @example
 * ```tsx
 * <BottomSheet open={isOpen} onOpenChange={setIsOpen} title="Фильтры">
 *   <Checkbox label="Только с питанием" checked={hasMeal} onCheckedChange={setHasMeal} />
 * </BottomSheet>
 * ```
 */
export const BottomSheet: TBottomSheetComponent = Object.assign(
	BottomSheetConvenience,
	{
		Root: BottomSheetPrimitiveRoot,
		Trigger: BottomSheetTrigger,
		Portal: BottomSheetPortal,
		Close: BottomSheetClose,
		Overlay: BottomSheetOverlay,
		Content: BottomSheetContent,
		Header: BottomSheetHeader,
		Footer: BottomSheetFooter,
		Title: BottomSheetTitle,
		Description: BottomSheetDescription,
		Handle: BottomSheetHandle,
	},
)
