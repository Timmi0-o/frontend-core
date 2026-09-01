'use client'

import { BreadcrumbsHome } from './components/breadcrumbs-home/breadcrumbs-home'
import { BreadcrumbsItem } from './components/breadcrumbs-item/breadcrumbs-item'
import { BreadcrumbsRoot } from './components/breadcrumbs-root/breadcrumbs-root'

export { BreadcrumbsHome, BreadcrumbsItem, BreadcrumbsRoot }

type TBreadcrumbsComponent = typeof BreadcrumbsRoot & {
	Home: typeof BreadcrumbsHome
	Item: typeof BreadcrumbsItem
}

/**
 * Хлебные крошки кита: Home + Item. Текущая страница — Item без `href`.
 *
 * @example
 * ```tsx
 * <Breadcrumbs>
 *   <Breadcrumbs.Home href="/" />
 *   <Breadcrumbs.Item href="/tickets">Билеты</Breadcrumbs.Item>
 *   <Breadcrumbs.Item>Поиск</Breadcrumbs.Item>
 * </Breadcrumbs>
 * ```
 */
export const Breadcrumbs: TBreadcrumbsComponent = Object.assign(
	BreadcrumbsRoot,
	{
		Home: BreadcrumbsHome,
		Item: BreadcrumbsItem,
	},
)

export type { TBreadcrumbsVariant } from './constants/breadcrumbs.constants'
export type { IBreadcrumbsHomeProps } from './components/breadcrumbs-home/breadcrumbs-home'
export type { IBreadcrumbsItemProps } from './components/breadcrumbs-item/breadcrumbs-item'
export type { IBreadcrumbsRootProps } from './components/breadcrumbs-root/breadcrumbs-root'
