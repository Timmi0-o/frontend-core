'use client'

import { useCallback, useSyncExternalStore } from 'react'

const isServerMatch = (): boolean => false

/**
 * Подписывается на `window.matchMedia`.
 * Вызывать для адаптивной вёрстки, когда CSS-брейкпоинта недостаточно
 * (условный рендер сайдбара, action bar и т.п.).
 */
export const useMediaQuery = (query: string): boolean => {
	const subscribe = useCallback(
		(callback: () => void) => {
			const mediaQuery = window.matchMedia(query)
			mediaQuery.addEventListener('change', callback)

			return () => {
				mediaQuery.removeEventListener('change', callback)
			}
		},
		[query],
	)

	const isClientMatch = useCallback((): boolean => {
		return window.matchMedia(query).matches
	}, [query])

	return useSyncExternalStore(subscribe, isClientMatch, isServerMatch)
}
