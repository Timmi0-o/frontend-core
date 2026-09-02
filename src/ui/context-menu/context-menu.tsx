'use client'

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu'
import type { ReactNode } from 'react'

import { cn } from '@/core/cn'
import { createCompoundContext } from '@/core/create-compound-context'
import { floatingLayerStyle, useOverlayLayer } from '@/core/overlay-layer'
import type { TSlotVariant } from '@/core/slot-variant'
import { useInheritedUiKit } from '@/core/use-inherited-ui-kit'

interface IContextMenuContextValue {
	uiKit: string | undefined
}

const { Context, useCompoundContext } =
	createCompoundContext<IContextMenuContextValue>('ContextMenu')

export interface IContextMenuRootProps extends ContextMenuPrimitive.Root.Props {
	variant?: TSlotVariant
}

/**
 * Меню по правому клику на Trigger. Для клика ЛКМ — `DropdownMenu`.
 *
 * @example
 * ```tsx
 * <ContextMenu>
 *   <ContextMenu.Trigger>
 *     <div>ПКМ здесь</div>
 *   </ContextMenu.Trigger>
 *   <ContextMenu.Content>
 *     <ContextMenu.Item onClick={handleCopy}>Копировать</ContextMenu.Item>
 *     <ContextMenu.Separator />
 *     <ContextMenu.Item onClick={handleDelete}>Удалить</ContextMenu.Item>
 *   </ContextMenu.Content>
 * </ContextMenu>
 * ```
 */
const ContextMenuRoot = ({
	children,
	variant = 'default',
	...props
}: IContextMenuRootProps): ReactNode => {
	const { hostRef, uiKit } = useInheritedUiKit()

	return (
		<ContextMenuPrimitive.Root
			data-slot='context-menu'
			data-variant={variant}
			{...props}
		>
			<span ref={hostRef} hidden />
			<Context.Provider value={{ uiKit }}>
				{children as ReactNode}
			</Context.Provider>
		</ContextMenuPrimitive.Root>
	)
}

export interface IContextMenuTriggerProps
	extends ContextMenuPrimitive.Trigger.Props {
	variant?: TSlotVariant
}

/**
 * Область, по ПКМ на которой открывается ContextMenu.
 *
 * @example
 * ```tsx
 * <ContextMenuTrigger>
 *   <div>ПКМ здесь</div>
 * </ContextMenuTrigger>
 * ```
 */
const ContextMenuTrigger = ({
	variant = 'default',
	...props
}: IContextMenuTriggerProps): ReactNode => {
	return (
		<ContextMenuPrimitive.Trigger
			data-slot='context-menu-trigger'
			data-variant={variant}
			{...props}
		/>
	)
}

export interface IContextMenuContentProps
	extends ContextMenuPrimitive.Popup.Props,
		Pick<
			ContextMenuPrimitive.Positioner.Props,
			'align' | 'alignOffset' | 'side' | 'sideOffset'
		> {
	className?: string
	variant?: TSlotVariant
}

const ContextMenuContent = ({
	align = 'start',
	alignOffset = 0,
	side = 'bottom',
	sideOffset = 4,
	className,
	variant = 'default',
	...props
}: IContextMenuContentProps): ReactNode => {
	const { uiKit } = useCompoundContext()
	const { floatingZ } = useOverlayLayer()

	return (
		<ContextMenuPrimitive.Portal>
			<ContextMenuPrimitive.Positioner
				data-slot='context-menu-positioner'
				data-ui-kit={uiKit}
				style={floatingLayerStyle(floatingZ)}
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
			>
				<ContextMenuPrimitive.Popup
					data-slot='context-menu-content'
					data-variant={variant}
					className={cn(className)}
					{...props}
				/>
			</ContextMenuPrimitive.Positioner>
		</ContextMenuPrimitive.Portal>
	)
}

export interface IContextMenuItemProps extends ContextMenuPrimitive.Item.Props {
	className?: string
	inset?: boolean
	variant?: 'default' | 'destructive' | 'unstyled'
}

const ContextMenuItem = ({
	className,
	inset = false,
	variant = 'default',
	...props
}: IContextMenuItemProps): ReactNode => {
	return (
		<ContextMenuPrimitive.Item
			{...props}
			data-slot='context-menu-item'
			data-inset={inset ? '' : undefined}
			data-variant={variant}
			className={cn(className)}
		/>
	)
}

export interface IContextMenuSeparatorProps
	extends ContextMenuPrimitive.Separator.Props {
	className?: string
	variant?: TSlotVariant
}

const ContextMenuSeparator = ({
	className,
	variant = 'default',
	...props
}: IContextMenuSeparatorProps): ReactNode => {
	return (
		<ContextMenuPrimitive.Separator
			data-slot='context-menu-separator'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export const ContextMenu = Object.assign(ContextMenuRoot, {
	Trigger: ContextMenuTrigger,
	Content: ContextMenuContent,
	Item: ContextMenuItem,
	Separator: ContextMenuSeparator,
})

export {
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
}
