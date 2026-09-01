'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import { Spinner } from '@/ui/spinner/spinner'
import type { ReactElement, ReactNode } from 'react'

export type TTabsVariant = 'default' | 'solid' | 'light' | 'unstyled'
export type TTabActionColor = 'default' | 'danger' | 'soft-danger'

interface IBaseTabItem {
	value: string
	label: string
	icon?: ReactNode
	isDisabled?: boolean
}

export interface IDisplayTabItem extends IBaseTabItem {
	type?: 'tab'
	/**
	 * Контент вкладки для приложения (например activeTabContent снаружи).
	 * Кит его не монтирует: панель появляется только как `<Tabs.Panel>`.
	 */
	content?: ReactNode | (() => ReactNode)
	isContentDisabled?: boolean
}

interface IActionTabItem extends IBaseTabItem {
	type: 'action'
	color?: TTabActionColor
	onClick: () => void | Promise<void>
	isLoading?: boolean
}

export type ITabItem = IDisplayTabItem | IActionTabItem

/**
 * Отличает обычную вкладку от action-кнопки в общем `items`.
 * Нужен рендеру списка: action не меняет value и не открывает panel.
 */
const isDisplayTabItem = (item: ITabItem): item is IDisplayTabItem => {
	return item.type !== 'action'
}

/**
 * Вызывает onClick action-вкладки и дожидается Promise, если он есть.
 * Использовать из обработчика клика по пункту с `type: 'action'`.
 */
const invokeTabAction = async (
	action: () => void | Promise<void>,
): Promise<void> => {
	await Promise.resolve(action())
}

export interface ITabsRootProps {
	value?: string
	defaultValue?: string
	onChange?: (value: string) => void
	items?: ITabItem[]
	variant?: TTabsVariant
	className?: string
	children?: ReactNode
}

export type ITabsProps = ITabsRootProps

export interface ITabsListContainerProps {
	className?: string
	children?: ReactNode
	variant?: TSlotVariant
}

export interface ITabsListProps {
	className?: string
	children?: ReactNode
	variant?: TSlotVariant
	'aria-label'?: string
}

export interface ITabsTabProps {
	value: string
	isDisabled?: boolean
	icon?: ReactNode
	className?: string
	children?: ReactNode
	variant?: TSlotVariant
}

export interface ITabsIndicatorProps {
	className?: string
	variant?: TSlotVariant
}

export interface ITabsSeparatorProps {
	className?: string
	variant?: TSlotVariant
}

export interface ITabsPanelProps {
	value: string
	keepMounted?: boolean
	className?: string
	children?: ReactNode
	variant?: TSlotVariant
}

const TabsRoot = ({
	value,
	defaultValue,
	onChange,
	items,
	variant = 'default',
	className,
	children,
}: ITabsRootProps): ReactElement => {
	const firstTabValue = items?.find(isDisplayTabItem)?.value
	const isControlled = value !== undefined

	return (
		<TabsPrimitive.Root
			{...(isControlled
				? { value }
				: { defaultValue: defaultValue ?? firstTabValue })}
			onValueChange={(nextValue) => {
				if (nextValue == null) {
					return
				}

				onChange?.(String(nextValue))
			}}
			data-slot='tabs'
			data-variant={variant}
			className={cn(className)}
		>
			{items != null ? <TabsItems items={items} /> : null}
			{children}
		</TabsPrimitive.Root>
	)
}

TabsRoot.displayName = 'Tabs'

const TabsListContainer = ({
	className,
	children,
	variant = 'default',
}: ITabsListContainerProps): ReactElement => {
	return (
		<div
			data-slot='tabs-list-container'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</div>
	)
}

TabsListContainer.displayName = 'Tabs.ListContainer'

const TabsList = ({
	className,
	children,
	variant = 'default',
	'aria-label': ariaLabel,
}: ITabsListProps): ReactElement => {
	return (
		<TabsPrimitive.List
			aria-label={ariaLabel}
			data-slot='tabs-list'
			data-variant={variant}
			className={cn(className)}
		>
			<TabsIndicator variant={variant} />
			{children}
		</TabsPrimitive.List>
	)
}

TabsList.displayName = 'Tabs.List'

const TabsTab = ({
	value,
	isDisabled = false,
	icon,
	className,
	children,
	variant = 'default',
}: ITabsTabProps): ReactElement => {
	return (
		<TabsPrimitive.Tab
			value={value}
			disabled={isDisabled}
			data-slot='tab'
			data-variant={variant}
			className={cn(className)}
		>
			{icon != null ? (
				<span data-slot='tab-icon' aria-hidden>
					{icon}
				</span>
			) : null}
			<span data-slot='tab-label'>{children}</span>
		</TabsPrimitive.Tab>
	)
}

TabsTab.displayName = 'Tabs.Tab'

const TabsIndicator = ({
	className,
	variant = 'default',
}: ITabsIndicatorProps): ReactElement => {
	return (
		<TabsPrimitive.Indicator
			data-slot='tabs-indicator'
			data-variant={variant}
			className={cn(className)}
		/>
	)
}

TabsIndicator.displayName = 'Tabs.Indicator'

const TabsSeparator = ({
	className,
	variant = 'default',
}: ITabsSeparatorProps): ReactElement => {
	return (
		<span
			data-slot='tabs-separator'
			data-variant={variant}
			aria-hidden
			className={cn(className)}
		/>
	)
}

TabsSeparator.displayName = 'Tabs.Separator'

/**
 * Контент вкладки. `value` совпадает с `Tabs.Tab` / пунктом `items`.
 *
 * @example
 * ```tsx
 * <Tabs.Panel value="route">Список поездов</Tabs.Panel>
 * ```
 */
const TabsPanel = ({
	value,
	keepMounted = false,
	className,
	children,
	variant = 'default',
}: ITabsPanelProps): ReactElement | null => {
	if (children == null) {
		return null
	}

	return (
		<TabsPrimitive.Panel
			value={value}
			keepMounted={keepMounted}
			data-slot='tabs-panel'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</TabsPrimitive.Panel>
	)
}

TabsPanel.displayName = 'Tabs.Panel'

interface ITabsActionProps {
	item: IActionTabItem
}

const TabsAction = ({ item }: ITabsActionProps): ReactElement => {
	const isPressDisabled = Boolean(item.isDisabled) || Boolean(item.isLoading)

	return (
		<button
			type='button'
			data-slot='tab'
			data-type='action'
			data-color={item.color ?? 'default'}
			data-loading={item.isLoading ? '' : undefined}
			disabled={isPressDisabled || undefined}
			aria-busy={item.isLoading ? true : undefined}
			onClick={() => {
				void invokeTabAction(item.onClick)
			}}
		>
			{item.icon != null ? (
				<span data-slot='tab-icon' aria-hidden>
					{item.icon}
				</span>
			) : null}
			<span data-slot='tab-label'>{item.label}</span>
			{item.isLoading ? (
				<span data-slot='tab-spinner' aria-hidden>
					<Spinner size='sm' />
				</span>
			) : null}
		</button>
	)
}

interface ITabsItemsProps {
	items: ITabItem[]
}

/**
 * Рисует только полосу вкладок из `items`.
 * Панели не создаёт: контент либо снаружи, либо явный `<Tabs.Panel>`.
 */
const TabsItems = ({ items }: ITabsItemsProps): ReactElement => {
	return (
		<TabsListContainer>
			<TabsList>
				{items.map((item) => {
					if (!isDisplayTabItem(item)) {
						return <TabsAction key={item.value} item={item} />
					}

					return (
						<TabsTab
							key={item.value}
							value={item.value}
							isDisabled={item.isDisabled}
							icon={item.icon}
						>
							{item.label}
						</TabsTab>
					)
				})}
			</TabsList>
		</TabsListContainer>
	)
}

/**
 * Вкладки. `items` рисует список; панели — только `<Tabs.Panel>` (кит content из items не монтирует).
 *
 * @example
 * ```tsx
 * <Tabs
 *   value={tab}
 *   onChange={setTab}
 *   items={[
 *     { value: 'route', label: 'Маршрут' },
 *     { value: 'seats', label: 'Места' },
 *   ]}
 * >
 *   <Tabs.Panel value="route">Поезда</Tabs.Panel>
 *   <Tabs.Panel value="seats">Схема вагона</Tabs.Panel>
 * </Tabs>
 * ```
 */
export const Tabs = Object.assign(TabsRoot, {
	Root: TabsRoot,
	ListContainer: TabsListContainer,
	List: TabsList,
	Tab: TabsTab,
	Indicator: TabsIndicator,
	Separator: TabsSeparator,
	Panel: TabsPanel,
})
