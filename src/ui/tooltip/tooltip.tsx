'use client'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from '@/core/cn'
import { createCompoundContext } from '@/core/create-compound-context'
import { floatingLayerStyle, useOverlayLayer } from '@/core/overlay-layer'
import type { TSlotVariant } from '@/core/slot-variant'
import { useInheritedUiKit } from '@/core/use-inherited-ui-kit'
import type { ReactNode } from 'react'

interface ITooltipContextValue {
	uiKit: string | undefined
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
	...props
}: ITooltipRootProps): ReactNode => {
	const { hostRef, uiKit } = useInheritedUiKit()

	return (
		<Context.Provider value={{ uiKit }}>
			<span ref={hostRef} hidden />
			<TooltipPrimitive.Root
				data-slot='tooltip'
				data-variant={variant}
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
	...props
}: ITooltipTriggerProps): ReactNode => {
	return (
		<TooltipPrimitive.Trigger
			data-slot='tooltip-trigger'
			data-variant={variant}
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
 * Подсказка по hover/focus. Provider — если общая задержка для дерева.
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
