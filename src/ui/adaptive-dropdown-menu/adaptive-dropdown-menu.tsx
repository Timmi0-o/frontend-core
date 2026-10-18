'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import {
	cloneElement,
	createContext,
	isValidElement,
	useCallback,
	useContext,
	useState,
	type ButtonHTMLAttributes,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
} from 'react'

import { cn } from '@/core/cn'
import { useMobileCondition, type TMobileCondition } from '@/hooks/use-mobile-condition'
import { AdaptiveDialog } from '@/ui/adaptive-dialog/adaptive-dialog'
import { assertMenuSectionChildren } from '@/ui/menu/assert-menu-section-children'

import { DropdownMenu } from '../dropdown-menu/dropdown-menu'
import type {
	IDropdownMenuCheckboxItemProps,
	IDropdownMenuContentProps,
	IDropdownMenuItemProps,
	IDropdownMenuLabelProps,
	IDropdownMenuRootProps,
	IDropdownMenuSectionProps,
	IDropdownMenuSeparatorProps,
	IDropdownMenuTriggerProps,
} from '../dropdown-menu/dropdown-menu'

const DEFAULT_SHEET_TITLE = 'Меню'

type TMenuOpenChangeDetails = Parameters<
	NonNullable<IDropdownMenuRootProps['onOpenChange']>
>[1]

type TCheckboxChangeDetails = Parameters<
	NonNullable<IDropdownMenuCheckboxItemProps['onCheckedChange']>
>[1]

interface IAdaptiveDropdownMenuSheetContextValue {
	isOpen: boolean
	isDisabled: boolean
	title: ReactNode
	setIsOpen: (isNextOpen: boolean) => void
}

const AdaptiveDropdownMenuSheetContext =
	createContext<IAdaptiveDropdownMenuSheetContextValue | null>(null)

/**
 * Контекст шторки. `null` на десктопе: части меню тогда делегируют в `DropdownMenu`.
 */
const useAdaptiveDropdownMenuSheet =
	(): IAdaptiveDropdownMenuSheetContextValue | null => {
		return useContext(AdaptiveDropdownMenuSheetContext)
	}

const createNoneChangeDetails = (): TMenuOpenChangeDetails => {
	return {
		reason: 'none',
		event: new Event('base-ui'),
		cancel() {},
		allowPropagation() {},
		isCanceled: false,
		isPropagationAllowed: false,
		trigger: undefined,
		preventUnmountOnClose() {},
	}
}

const createItemPressDetails = (
	event: globalThis.MouseEvent,
): TCheckboxChangeDetails => {
	return {
		reason: 'item-press',
		event,
		cancel() {},
		allowPropagation() {},
		isCanceled: false,
		isPropagationAllowed: false,
		trigger: undefined,
		preventUnmountOnClose() {},
	}
}

export interface IAdaptiveDropdownMenuRootProps extends IDropdownMenuRootProps {
	isMobileCondition?: TMobileCondition
	/** Заголовок шторки. На десктопе не показывается. */
	title?: ReactNode
}

const AdaptiveDropdownMenuSheetTrigger = ({
	variant = 'default',
	render,
	children,
	disabled = false,
	onClick,
	className,
	id,
	style,
}: IDropdownMenuTriggerProps): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()
	const isDisabled = disabled || sheet?.isDisabled === true
	const triggerState = { open: sheet?.isOpen ?? false, disabled: isDisabled }
	const resolvedClassName =
		typeof className === 'function' ? className(triggerState) : className
	const resolvedStyle = typeof style === 'function' ? style(triggerState) : style

	const handleClick: NonNullable<IDropdownMenuTriggerProps['onClick']> = (
		event,
	) => {
		onClick?.(event)

		if (event.defaultPrevented || isDisabled) {
			return
		}

		sheet?.setIsOpen(true)
	}

	const handleButtonClick = (event: MouseEvent<HTMLButtonElement>): void => {
		handleClick(Object.assign(event, { preventBaseUIHandler() {} }))
	}

	if (isValidElement<ButtonHTMLAttributes<HTMLButtonElement>>(render)) {
		return cloneElement(render, {
			id,
			className: resolvedClassName,
			style: resolvedStyle,
			disabled: isDisabled,
			onClick: (event) => {
				render.props.onClick?.(event)
				handleButtonClick(event)
			},
			children: children ?? render.props.children,
		})
	}

	return (
		<button
			id={id}
			className={resolvedClassName}
			style={resolvedStyle}
			type='button'
			disabled={isDisabled}
			data-slot='dropdown-menu-trigger'
			data-variant={variant}
			onClick={handleButtonClick}
		>
			{children}
		</button>
	)
}

const AdaptiveDropdownMenuTrigger = (
	props: IDropdownMenuTriggerProps,
): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()

	if (!sheet) {
		return <DropdownMenu.Trigger {...props} />
	}

	return <AdaptiveDropdownMenuSheetTrigger {...props} />
}

const AdaptiveDropdownMenuSheetContent = ({
	className,
	children,
	align: _align,
	alignOffset: _alignOffset,
	side: _side,
	sideOffset: _sideOffset,
	variant: _variant,
}: IDropdownMenuContentProps): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()
	const title = sheet?.title ?? DEFAULT_SHEET_TITLE

	return (
		<AdaptiveDialog
			open={sheet?.isOpen ?? false}
			onOpenChange={(isNextOpen) => {
				sheet?.setIsOpen(isNextOpen)
			}}
			title={typeof title === 'string' ? title : DEFAULT_SHEET_TITLE}
			isMobileCondition={true}
			height='auto'
		>
			<AdaptiveDialog.Content>
				<AdaptiveDialog.Header>
					<AdaptiveDialog.Title>{title}</AdaptiveDialog.Title>
				</AdaptiveDialog.Header>
				<div
					data-slot='adaptive-dropdown-menu-sheet'
					data-vaul-no-drag=''
					role='menu'
					className={cn(className)}
				>
					{children}
				</div>
			</AdaptiveDialog.Content>
		</AdaptiveDialog>
	)
}

const AdaptiveDropdownMenuContent = (
	props: IDropdownMenuContentProps,
): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()

	if (!sheet) {
		return <DropdownMenu.Content {...props} />
	}

	return <AdaptiveDropdownMenuSheetContent {...props} />
}

const AdaptiveDropdownMenuSheetItem = ({
	className,
	inset = false,
	variant = 'default',
	closeOnClick = true,
	disabled = false,
	children,
	onClick,
	id,
	style,
}: IDropdownMenuItemProps): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()
	const resolvedClassName = typeof className === 'string' ? className : undefined
	const resolvedStyle = style != null && typeof style !== 'function' ? style : undefined

	const handleClick: NonNullable<IDropdownMenuItemProps['onClick']> = (event) => {
		onClick?.(event)

		if (event.defaultPrevented || disabled || !closeOnClick) {
			return
		}

		sheet?.setIsOpen(false)
	}

	const controlProps = {
		id,
		style: resolvedStyle,
		role: 'menuitem' as const,
		tabIndex: disabled ? -1 : 0,
		'data-slot': 'dropdown-menu-item',
		'data-inset': inset ? '' : undefined,
		'data-variant': variant,
		'data-disabled': disabled ? '' : undefined,
		className: cn(resolvedClassName),
		onClick: (event: MouseEvent<HTMLDivElement>) => {
			handleClick(Object.assign(event, { preventBaseUIHandler() {} }))
		},
	}

	return <div {...controlProps}>{children}</div>
}

const AdaptiveDropdownMenuItem = (
	props: IDropdownMenuItemProps,
): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()

	if (!sheet) {
		return <DropdownMenu.Item {...props} />
	}

	return <AdaptiveDropdownMenuSheetItem {...props} />
}

const AdaptiveDropdownMenuSheetCheckboxItem = ({
	className,
	variant = 'default',
	closeOnClick = false,
	disabled = false,
	checked,
	defaultChecked = false,
	onCheckedChange,
	children,
	onClick,
	id,
	style,
}: IDropdownMenuCheckboxItemProps): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()
	const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked)
	const isChecked = checked ?? uncontrolledChecked
	const resolvedClassName = typeof className === 'string' ? className : undefined
	const resolvedStyle = style != null && typeof style !== 'function' ? style : undefined

	const handleClick: NonNullable<IDropdownMenuCheckboxItemProps['onClick']> = (
		event,
	) => {
		onClick?.(event)

		if (event.defaultPrevented || disabled) {
			return
		}

		const isNextChecked = !isChecked

		if (checked === undefined) {
			setUncontrolledChecked(isNextChecked)
		}

		onCheckedChange?.(isNextChecked, createItemPressDetails(event.nativeEvent))

		if (closeOnClick) {
			sheet?.setIsOpen(false)
		}
	}

	const checkboxChildren = (
		<>
			<span data-slot='dropdown-menu-checkbox-item-label'>{children}</span>
			<span data-slot='dropdown-menu-checkbox-item-indicator'>
				{isChecked ? <span data-slot='dropdown-menu-checkbox-check' /> : null}
			</span>
		</>
	)

	return (
		<div
			id={id}
			style={resolvedStyle}
			role='menuitemcheckbox'
			tabIndex={disabled ? -1 : 0}
			aria-checked={isChecked}
			data-slot='dropdown-menu-checkbox-item'
			data-variant={variant}
			data-disabled={disabled ? '' : undefined}
			data-checked={isChecked ? '' : undefined}
			className={cn(resolvedClassName)}
			onClick={(event) => {
				handleClick(Object.assign(event, { preventBaseUIHandler() {} }))
			}}
		>
			{checkboxChildren}
		</div>
	)
}

const AdaptiveDropdownMenuCheckboxItem = (
	props: IDropdownMenuCheckboxItemProps,
): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()

	if (!sheet) {
		return <DropdownMenu.CheckboxItem {...props} />
	}

	return <AdaptiveDropdownMenuSheetCheckboxItem {...props} />
}

const AdaptiveDropdownMenuSeparator = ({
	className,
	variant = 'default',
	...props
}: IDropdownMenuSeparatorProps): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()

	if (!sheet) {
		return <DropdownMenu.Separator className={className} variant={variant} {...props} />
	}

	return (
		<div
			data-slot='dropdown-menu-separator'
			data-variant={variant}
			role='separator'
			className={cn(className)}
		/>
	)
}

const AdaptiveDropdownMenuLabel = ({
	className,
	variant = 'default',
	...props
}: IDropdownMenuLabelProps): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()

	if (!sheet) {
		return <DropdownMenu.Label className={className} variant={variant} {...props} />
	}

	return (
		<div
			data-slot='dropdown-menu-label'
			data-variant={variant}
			className={cn(className)}
		>
			{props.children}
		</div>
	)
}

const AdaptiveDropdownMenuSection = ({
	title,
	label,
	className,
	children,
	variant = 'default',
	...props
}: IDropdownMenuSectionProps): ReactElement => {
	const sheet = useAdaptiveDropdownMenuSheet()
	const heading = title ?? label

	assertMenuSectionChildren(
		children,
		[
			AdaptiveDropdownMenuItem,
			AdaptiveDropdownMenuSeparator,
			AdaptiveDropdownMenuCheckboxItem,
			AdaptiveDropdownMenuLabel,
		],
		'AdaptiveDropdownMenu.Section',
	)

	if (!sheet) {
		return (
			<MenuPrimitive.Group
				data-slot='dropdown-menu-section'
				data-variant={variant}
				className={cn(className)}
				{...props}
			>
				{heading != null && heading !== '' ? (
					<AdaptiveDropdownMenuLabel>{heading}</AdaptiveDropdownMenuLabel>
				) : null}
				{children}
			</MenuPrimitive.Group>
		)
	}

	return (
		<div
			data-slot='dropdown-menu-section'
			data-variant={variant}
			className={cn(className)}
		>
			{heading != null && heading !== '' ? (
				<AdaptiveDropdownMenuLabel>{heading}</AdaptiveDropdownMenuLabel>
			) : null}
			{children}
		</div>
	)
}

const AdaptiveDropdownMenuMobile = ({
	open,
	defaultOpen = false,
	onOpenChange,
	onOpenChangeComplete,
	disabled = false,
	variant = 'default',
	title = DEFAULT_SHEET_TITLE,
	children,
}: IAdaptiveDropdownMenuRootProps): ReactElement => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
	const isControlled = typeof open === 'boolean'
	const isOpen = isControlled ? open : uncontrolledOpen

	const setIsOpen = useCallback(
		(isNextOpen: boolean): void => {
			if (disabled && isNextOpen) {
				return
			}

			if (!isControlled) {
				setUncontrolledOpen(isNextOpen)
			}

			onOpenChange?.(isNextOpen, createNoneChangeDetails())
			onOpenChangeComplete?.(isNextOpen)
		},
		[disabled, isControlled, onOpenChange, onOpenChangeComplete],
	)

	return (
		<AdaptiveDropdownMenuSheetContext.Provider
			value={{
				isOpen,
				isDisabled: disabled,
				title,
				setIsOpen,
			}}
		>
			<div
				data-slot='dropdown-menu'
				data-variant={variant}
				data-disabled={disabled ? '' : undefined}
			>
				{typeof children === 'function' ? children({ payload: undefined }) : children}
			</div>
		</AdaptiveDropdownMenuSheetContext.Provider>
	)
}

const AdaptiveDropdownMenuRoot = ({
	isMobileCondition,
	title,
	...menuProps
}: IAdaptiveDropdownMenuRootProps): ReactElement => {
	const isMobile = useMobileCondition(isMobileCondition)

	if (!isMobile) {
		return <DropdownMenu {...menuProps} />
	}

	return (
		<AdaptiveDropdownMenuMobile
			{...menuProps}
			isMobileCondition={isMobileCondition}
			title={title}
		/>
	)
}

AdaptiveDropdownMenuRoot.displayName = 'AdaptiveDropdownMenu'
AdaptiveDropdownMenuTrigger.displayName = 'AdaptiveDropdownMenu.Trigger'
AdaptiveDropdownMenuContent.displayName = 'AdaptiveDropdownMenu.Content'
AdaptiveDropdownMenuItem.displayName = 'AdaptiveDropdownMenu.Item'
AdaptiveDropdownMenuCheckboxItem.displayName = 'AdaptiveDropdownMenu.CheckboxItem'
AdaptiveDropdownMenuSeparator.displayName = 'AdaptiveDropdownMenu.Separator'
AdaptiveDropdownMenuSection.displayName = 'AdaptiveDropdownMenu.Section'
AdaptiveDropdownMenuLabel.displayName = 'AdaptiveDropdownMenu.Label'

type TAdaptiveDropdownMenuComponent = typeof AdaptiveDropdownMenuRoot & {
	Trigger: typeof AdaptiveDropdownMenuTrigger
	Content: typeof AdaptiveDropdownMenuContent
	Item: typeof AdaptiveDropdownMenuItem
	CheckboxItem: typeof AdaptiveDropdownMenuCheckboxItem
	Separator: typeof AdaptiveDropdownMenuSeparator
	Section: typeof AdaptiveDropdownMenuSection
	Label: typeof AdaptiveDropdownMenuLabel
}

/**
 * Тот же контракт, что у `DropdownMenu`.
 * На десктопе — выпадающее меню, на мобилке — шторка с теми же пунктами.
 * Порог по умолчанию: max-width 1024px. `isMobileCondition` — boolean или media query.
 *
 * @example
 * ```tsx
 * <AdaptiveDropdownMenu title="Ещё">
 *   <AdaptiveDropdownMenu.Trigger render={<Button variant="ghost" />}>
 *     Ещё
 *   </AdaptiveDropdownMenu.Trigger>
 *   <AdaptiveDropdownMenu.Content>
 *     <AdaptiveDropdownMenu.Item onClick={handleEdit}>Изменить</AdaptiveDropdownMenu.Item>
 *   </AdaptiveDropdownMenu.Content>
 * </AdaptiveDropdownMenu>
 * ```
 */
export const AdaptiveDropdownMenu: TAdaptiveDropdownMenuComponent = Object.assign(
	AdaptiveDropdownMenuRoot,
	{
		Trigger: AdaptiveDropdownMenuTrigger,
		Content: AdaptiveDropdownMenuContent,
		Item: AdaptiveDropdownMenuItem,
		CheckboxItem: AdaptiveDropdownMenuCheckboxItem,
		Separator: AdaptiveDropdownMenuSeparator,
		Section: AdaptiveDropdownMenuSection,
		Label: AdaptiveDropdownMenuLabel,
	},
)
