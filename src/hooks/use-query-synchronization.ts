'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import { useManageSearchParams } from './use-manage-search-params'
import type { TQueryFieldValue } from './types/t-query-field-value'

export interface IQuerySynchronizationItem {
	key: string
	setValue: (value: TQueryFieldValue) => void
	currentValue?: TQueryFieldValue
}

/**
 * Перекладывает изменившиеся URL-параметры в локальный state.
 * Вызывать рядом с фильтрами, которые одновременно пишут в URL и держат копию в стейте.
 */
export const useQuerySynchronization = (
	items: IQuerySynchronizationItem[] | IQuerySynchronizationItem,
): void => {
	const pathname = usePathname()
	const { searchParams, handlePushKeyInSearchParams } = useManageSearchParams()

	const normalizedItems = useMemo(
		() => (Array.isArray(items) ? items : [items]),
		[items],
	)

	const itemsRef = useRef(normalizedItems)
	const prevQueryRef = useRef<string | null>(null)
	const querySignature = searchParams.toString()

	useEffect(() => {
		itemsRef.current = normalizedItems

		return () => {
			itemsRef.current = []
		}
	}, [normalizedItems])

	useEffect(() => {
		const paramsFromUrl = new URLSearchParams(querySignature)
		const prevParams =
			prevQueryRef.current !== null
				? new URLSearchParams(prevQueryRef.current)
				: null
		const isInitialSync = prevParams === null

		prevQueryRef.current = querySignature

		itemsRef.current.forEach((item) => {
			const hasParamChanged =
				isInitialSync ||
				paramsFromUrl.get(item.key) !== prevParams?.get(item.key)

			if (!hasParamChanged) {
				return
			}

			const value = paramsFromUrl.get(item.key) ?? null
			const isEmptyValueFromUrlAndDirtyInState = Boolean(
				!value && item.currentValue && item.currentValue !== value,
			)

			if (isEmptyValueFromUrlAndDirtyInState) {
				handlePushKeyInSearchParams({
					key: item.key,
					value: item.currentValue,
				})
				return
			}

			item.setValue(value)
		})

		return () => {
			prevQueryRef.current = null
		}
	}, [pathname, querySignature])
}
