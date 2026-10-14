'use client'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from '@/core/cn'
import { createCompoundContext } from '@/core/create-compound-context'
import { floatingLayerStyle, useOverlayLayer } from '@/core/overlay-layer'
import type { TSlotVariant } from '@/core/slot-variant'
import { useInheritedUiKit } from '@/core/use-inherited-ui-kit'
import {
	useRef,
	useState,
	type MouseEvent,
	type PointerEvent,
	type ReactNode,
} from 'react'

type TTooltipOpenChange = NonNullable<
	TooltipPrimitive.Root.Props['onOpenChange']
>
type TTooltipOpenChangeDetails = Parameters<TTooltipOpenChange>[1]

interface ITooltipContextValue {
	uiKit: string | undefined
	isTouchPointer: boolean
	onTriggerPointerDown: (event: PointerEvent<HTMLElement>) => void
	onTriggerClick: (event: MouseEvent<HTMLElement>) => void
}

const createTouchPressDetails = (
	event: MouseEvent<HTMLElement>,
): TTooltipOpenChangeDetails => {
	let isCanceled = false
	let isPropagationAllowed = false

	return {
		reason: 'trigger-press',
		event: event.nativeEvent,
		cancel() {
			isCanceled = true
		},
		allowPropagation() {
			isPropagationAllowed = true
		},
		get isCanceled() {
			return isCanceled
		},
		get isPropagationAllowed() {
			return isPropagationAllowed
		},
		trigger: event.currentTarget,
		preventUnmountOnClose() {},
	}
}

const { Context, useCompoundContext } =
	createCompoundContext<ITooltipContextValue>('Tooltip')

export interface ITooltipProviderProps extends TooltipPrimitive.Provider.Props {
	variant?: TSlotVariant
}

const TooltipProvider = ({
	delay = 0,
	variant = 'default',
	...props
}: ITooltipProviderProps): ReactNode => {
	return (
		<TooltipPrimitive.Provider
			data-slot='tooltip-provider'
			data-variant={variant}
			delay={delay}
			{...props}
		/>
	)
}

export interface ITooltipRootProps extends TooltipPrimitive.Root.Props {
	variant?: TSlotVariant
}

const TooltipRoot = ({
	variant = 'default',
	open: isOpenProp,
	defaultOpen = false,
	disabled = false,
	onOpenChange,
	...props
}: ITooltipRootProps): ReactNode => {
	const { hostRef, uiKit } = useInheritedUiKit()
	const isOpenControlled = isOpenProp !== undefined
	const [isUncontrolledOpen, setIsUncontrolledOpen] = useState(defaultOpen)
	const [isTouchPointer, setIsTouchPointer] = useState(false)
	const isOpenedByTouchRef = useRef(false)
	const pointerTypeRef = useRef('')
	const isOpenOnPointerDownRef = useRef(false)
	const isOpen = isOpenControlled ? isOpenProp : isUncontrolledOpen

	const setOpen = (isNextOpen: boolean, eventDetails: TTooltipOpenChangeDetails) => {
		if (
			!isNextOpen &&
			isOpenedByTouchRef.current &&
			eventDetails.reason === 'trigger-hover'
		) {
			eventDetails.cancel()
			return
		}

		onOpenChange?.(isNextOpen, eventDetails)
		if (eventDetails.isCanceled) return

		if (!isNextOpen) {
			isOpenedByTouchRef.current = false
		}

		if (!isOpenControlled) {
			setIsUncontrolledOpen(isNextOpen)
		}
	}

	const handleOpenChange: TTooltipOpenChange = (isNextOpen, eventDetails) => {
		setOpen(isNextOpen, eventDetails)
	}

	return (
		<Context.Provider
			value={{
				uiKit,
				isTouchPointer,
				onTriggerPointerDown: (event) => {
					pointerTypeRef.current = event.pointerType
					isOpenOnPointerDownRef.current = isOpen
					const isNextTouchPointer = event.pointerType === 'touch'
					setIsTouchPointer((isCurrentTouchPointer) =>
						isCurrentTouchPointer === isNextTouchPointer
							? isCurrentTouchPointer
							: isNextTouchPointer,
					)
				},
				onTriggerClick: (event) => {
					const pointerType = pointerTypeRef.current
					pointerTypeRef.current = ''
					if (disabled || pointerType !== 'touch') return

					const isNextOpen = !isOpenOnPointerDownRef.current
					isOpenedByTouchRef.current = isNextOpen
					setOpen(isNextOpen, createTouchPressDetails(event))
				},
			}}
		>
			<span ref={hostRef} hidden />
			<TooltipPrimitive.Root
				data-slot='tooltip'
				data-variant={variant}
				disabled={disabled}
				open={isOpen}
				onOpenChange={handleOpenChange}
				{...props}
			/>
		</Context.Provider>
	)
}

export interface ITooltipTriggerProps extends TooltipPrimitive.Trigger.Props {
	variant?: TSlotVariant
}

const TooltipTrigger = ({
	variant = 'default',
	closeOnClick,
	onPointerDown,
	onClick,
	...props
}: ITooltipTriggerProps): ReactNode => {
	const { isTouchPointer, onTriggerPointerDown, onTriggerClick } =
		useCompoundContext()

	return (
		<TooltipPrimitive.Trigger
			data-slot='tooltip-trigger'
			data-variant={variant}
			closeOnClick={closeOnClick ?? !isTouchPointer}
			onPointerDown={(event) => {
				onPointerDown?.(event)
				onTriggerPointerDown(event)
			}}
			onClick={(event) => {
				onClick?.(event)
				if (event.defaultPrevented) return
				onTriggerClick(event)
			}}
			{...props}
		/>
	)
}

export interface ITooltipContentProps
	extends TooltipPrimitive.Popup.Props,
		Pick<
			TooltipPrimitive.Positioner.Props,
			'align' | 'alignOffset' | 'side' | 'sideOffset'
		> {
	className?: string
	variant?: TSlotVariant
}

const TooltipContent = ({
	className,
	side = 'top',
	sideOffset = 6,
	align = 'center',
	alignOffset = 0,
	children,
	variant = 'default',
	...props
}: ITooltipContentProps): ReactNode => {
	const { uiKit } = useCompoundContext()
	const { floatingZ } = useOverlayLayer()

	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Positioner
				data-slot='tooltip-positioner'
				data-ui-kit={uiKit}
				style={floatingLayerStyle(floatingZ)}
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
			>
				<TooltipPrimitive.Popup
					data-slot='tooltip-content'
					data-variant={variant}
					className={cn(className)}
					{...props}
				>
					{children}
					<TooltipPrimitive.Arrow data-slot='tooltip-arrow' />
				</TooltipPrimitive.Popup>
			</TooltipPrimitive.Positioner>
		</TooltipPrimitive.Portal>
	)
}

TooltipRoot.displayName = 'Tooltip'
TooltipTrigger.displayName = 'Tooltip.Trigger'
TooltipContent.displayName = 'Tooltip.Content'
TooltipProvider.displayName = 'Tooltip.Provider'

/**
 * Подсказка по hover/focus. На тач-экране открывается тапом по триггеру.
 * Provider — если общая задержка для дерева.
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <Tooltip.Trigger>Навести</Tooltip.Trigger>
 *   <Tooltip.Content>Подсказка</Tooltip.Content>
 * </Tooltip>
 * ```
 */
export const Tooltip = Object.assign(TooltipRoot, {
	Root: TooltipRoot,
	Trigger: TooltipTrigger,
	Content: TooltipContent,
	Provider: TooltipProvider,
})
