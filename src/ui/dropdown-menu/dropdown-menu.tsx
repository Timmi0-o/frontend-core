'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { cn } from '@/core/cn'
import { createCompoundContext } from '@/core/create-compound-context'
import { floatingLayerStyle, useOverlayLayer } from '@/core/overlay-layer'
import type { TSlotVariant } from '@/core/slot-variant'
import { useInheritedUiKit } from '@/core/use-inherited-ui-kit'
import type { ReactNode } from 'react'

interface IDropdownMenuContextValue {
	uiKit: string | undefined
}

const { Context, useCompoundContext } =
	createCompoundContext<IDropdownMenuContextValue>('DropdownMenu')

export interface IDropdownMenuRootProps extends MenuPrimitive.Root.Props {
	variant?: TSlotVariant
}

const DropdownMenuRoot = ({
	children,
	modal = false,
	variant = 'default',
	...props
}: IDropdownMenuRootProps): ReactNode => {
	const { hostRef, uiKit } = useInheritedUiKit()

	return (
		<MenuPrimitive.Root
			data-slot='dropdown-menu'
			data-variant={variant}
			modal={modal}
			{...props}
		>
			<span ref={hostRef} hidden />
			<Context.Provider value={{ uiKit }}>
				{children as ReactNode}
			</Context.Provider>
		</MenuPrimitive.Root>
	)
}

export interface IDropdownMenuTriggerProps extends MenuPrimitive.Trigger.Props {
	variant?: TSlotVariant
}

const DropdownMenuTrigger = ({
	variant = 'default',
	...props
}: IDropdownMenuTriggerProps): ReactNode => {
	return (
		<MenuPrimitive.Trigger
			data-slot='dropdown-menu-trigger'
			data-variant={variant}
			{...props}
		/>
	)
}

export interface IDropdownMenuContentProps
	extends MenuPrimitive.Popup.Props,
		Pick<
			MenuPrimitive.Positioner.Props,
			'align' | 'alignOffset' | 'side' | 'sideOffset'
		> {
	className?: string
	variant?: TSlotVariant
}

const DropdownMenuContent = ({
	align = 'start',
	alignOffset = 0,
	side = 'bottom',
	sideOffset = 4,
	className,
	variant = 'default',
	...props
}: IDropdownMenuContentProps): ReactNode => {
	const { uiKit } = useCompoundContext()
	const { floatingZ } = useOverlayLayer()

	return (
		<MenuPrimitive.Portal>
			<MenuPrimitive.Positioner
				data-slot='dropdown-menu-positioner'
				data-ui-kit={uiKit}
				style={floatingLayerStyle(floatingZ)}
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
			>
				<MenuPrimitive.Popup
					data-slot='dropdown-menu-content'
					data-variant={variant}
					className={cn(className)}
					{...props}
				/>
			</MenuPrimitive.Positioner>
		</MenuPrimitive.Portal>
	)
}

export interface IDropdownMenuItemProps extends MenuPrimitive.Item.Props {
	className?: string
	inset?: boolean
	variant?: 'default' | 'destructive' | 'unstyled'
}

const DropdownMenuItem = ({
	className,
	inset = false,
	variant = 'default',
	...props
}: IDropdownMenuItemProps): ReactNode => {
	return (
		<MenuPrimitive.Item
			{...props}
			data-slot='dropdown-menu-item'
			data-inset={inset ? '' : undefined}
			data-variant={variant}
			className={cn(className)}
		/>
	)
}

export interface IDropdownMenuSeparatorProps
	extends MenuPrimitive.Separator.Props {
	className?: string
	variant?: TSlotVariant
}

const DropdownMenuSeparator = ({
	className,
	variant = 'default',
	...props
}: IDropdownMenuSeparatorProps): ReactNode => {
	return (
		<MenuPrimitive.Separator
			data-slot='dropdown-menu-separator'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export interface IDropdownMenuLabelProps extends MenuPrimitive.GroupLabel.Props {
	className?: string
	variant?: TSlotVariant
}

/**
 * Заголовок секции. Класть внутрь DropdownMenu.Section —
 * Base UI связывает его с группой только внутри Group.
 */
const DropdownMenuLabel = ({
	className,
	variant = 'default',
	...props
}: IDropdownMenuLabelProps): ReactNode => {
	return (
		<MenuPrimitive.GroupLabel
			data-slot='dropdown-menu-label'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export interface IDropdownMenuSectionProps
	extends Omit<MenuPrimitive.Group.Props, 'title'> {
	label?: ReactNode
	className?: string
	variant?: TSlotVariant
}

/**
 * Именованная группа пунктов. Нужна, когда в одном меню несколько блоков
 * (действия / опасная зона). Заголовок — через label или DropdownMenu.Label.
 */
const DropdownMenuSection = ({
	label,
	className,
	children,
	variant = 'default',
	...props
}: IDropdownMenuSectionProps): ReactNode => {
	return (
		<MenuPrimitive.Group
			data-slot='dropdown-menu-section'
			data-variant={variant}
			className={cn(className)}
			{...props}
		>
			{label != null && label !== '' ? (
				<DropdownMenuLabel>{label}</DropdownMenuLabel>
			) : null}
			{children}
		</MenuPrimitive.Group>
	)
}

export interface IDropdownMenuCheckboxItemProps
	extends MenuPrimitive.CheckboxItem.Props {
	className?: string
	variant?: TSlotVariant
}

const DropdownMenuCheckboxItem = ({
	className,
	children,
	variant = 'default',
	...props
}: IDropdownMenuCheckboxItemProps): ReactNode => {
	return (
		<MenuPrimitive.CheckboxItem
			data-slot='dropdown-menu-checkbox-item'
			data-variant={variant}
			className={cn(className)}
			{...props}
		>
			<span data-slot='dropdown-menu-checkbox-item-label'>{children}</span>
			<MenuPrimitive.CheckboxItemIndicator data-slot='dropdown-menu-checkbox-item-indicator'>
				<span data-slot='dropdown-menu-checkbox-check' />
			</MenuPrimitive.CheckboxItemIndicator>
		</MenuPrimitive.CheckboxItem>
	)
}

DropdownMenuRoot.displayName = 'DropdownMenu'
DropdownMenuTrigger.displayName = 'DropdownMenu.Trigger'
DropdownMenuContent.displayName = 'DropdownMenu.Content'
DropdownMenuItem.displayName = 'DropdownMenu.Item'
DropdownMenuCheckboxItem.displayName = 'DropdownMenu.CheckboxItem'
DropdownMenuSeparator.displayName = 'DropdownMenu.Separator'
DropdownMenuSection.displayName = 'DropdownMenu.Section'
DropdownMenuLabel.displayName = 'DropdownMenu.Label'

/**
 * Меню по клику на Trigger. Не путать с ContextMenu (ПКМ).
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenu.Trigger render={<Button variant="ghost" />}>Ещё</DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <DropdownMenu.Item onClick={handleEdit}>Изменить</DropdownMenu.Item>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item onClick={handleRemove}>Удалить</DropdownMenu.Item>
 *   </DropdownMenu.Content>
 * </DropdownMenu>
 * ```
 */
export const DropdownMenu = Object.assign(DropdownMenuRoot, {
	Trigger: DropdownMenuTrigger,
	Content: DropdownMenuContent,
	Item: DropdownMenuItem,
	CheckboxItem: DropdownMenuCheckboxItem,
	Separator: DropdownMenuSeparator,
	Section: DropdownMenuSection,
	Label: DropdownMenuLabel,
})
