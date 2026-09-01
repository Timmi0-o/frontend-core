'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { QUERY_ARRAY_SEPARATOR } from './constants/query-array-separator'

export enum ENavigationMode {
	BY_REFRESH_SERVER = 'BY_REFRESH_SERVER',
	BY_NO_REFRESH_SERVER = 'BY_NO_REFRESH_SERVER',
}

export interface IHandlePushKeyInSearchParamsItem {
	key: string
	value: string | number | boolean | object | string[] | null | undefined
}

export interface IHandlePushKeyInSearchParamsOptions {
	navigationMode?: keyof typeof ENavigationMode
}

export type THandlePushKeyInSearchParamsProps =
	| IHandlePushKeyInSearchParamsItem
	| IHandlePushKeyInSearchParamsItem[]

export interface IUseManageSearchParamsReturn {
	pathname: string
	searchParams: URLSearchParams
	handlePushKeyInSearchParams: (
		props: THandlePushKeyInSearchParamsProps,
		options?: IHandlePushKeyInSearchParamsOptions,
	) => void
	buildQueryValue: (props: THandlePushKeyInSearchParamsProps) => string
	buildUrlByPathnameAndQueryString: (
		pathname: string,
		queryString: string,
	) => string
}

/**
 * Читает и меняет search params текущего Next-маршрута без скролла.
 * Вызывать в клиентских фильтрах, таблицах и шагах, где состояние живёт в URL.
 * `BY_NO_REFRESH_SERVER` — только URL, без RSC-запроса.
 */
export const useManageSearchParams = (): IUseManageSearchParamsReturn => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const buildQueryValue = (props: THandlePushKeyInSearchParamsProps) => {
		const nextSearchParams = new URLSearchParams(searchParams.toString())
		const items = Array.isArray(props) ? props : [props]

		items.forEach((paramsItem) => {
			const { key, value } = paramsItem

			const formattedValue = Array.isArray(value)
				? value.join(QUERY_ARRAY_SEPARATOR)
				: value

			if (!formattedValue) {
				nextSearchParams.delete(key)
			} else {
				nextSearchParams.set(key, String(formattedValue))
			}
		})

		return nextSearchParams.toString()
	}

	const buildUrlByPathnameAndQueryString = (
		nextPathname: string,
		queryString: string,
	) => {
		return queryString ? `${nextPathname}?${queryString}` : nextPathname
	}

	const handlePushKeyInSearchParams = (
		props: THandlePushKeyInSearchParamsProps,
		navigationOptions: IHandlePushKeyInSearchParamsOptions = {},
	) => {
		const queryString = buildQueryValue(props)
		const nextUrl = buildUrlByPathnameAndQueryString(pathname, queryString)
		const currentUrl = buildUrlByPathnameAndQueryString(
			pathname,
			searchParams.toString(),
		)

		if (nextUrl === currentUrl) {
			return
		}

		if (
			navigationOptions.navigationMode === ENavigationMode.BY_NO_REFRESH_SERVER
		) {
			window.history.replaceState(null, '', nextUrl)
			return
		}

		router.replace(nextUrl, { scroll: false })
	}

	return {
		pathname,
		searchParams,
		handlePushKeyInSearchParams,
		buildQueryValue,
		buildUrlByPathnameAndQueryString,
	}
}
