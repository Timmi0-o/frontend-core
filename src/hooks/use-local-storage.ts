'use client'

import {
	useEffect,
	useState,
	type Dispatch,
	type SetStateAction,
} from 'react'
import { replaceLocalStorageValue } from './helpers/replace-local-storage-value'
import { reviveLocalStorageValue } from './helpers/revive-local-storage-value'

/**
 * Держит React-state в паре с `localStorage` (SSR-безопасно).
 * Вызывать для настроек UI, которые должны переживать перезагрузку.
 */
export const useLocalStorage = <T>(
	key: string,
	initialValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === 'undefined') {
			return initialValue
		}

		try {
			const item = window.localStorage.getItem(key)

			if (item) {
				return JSON.parse(item, reviveLocalStorageValue) as T
			}
		} catch (error) {
			console.error(error)
		}

		return initialValue
	})

	useEffect(() => {
		if (typeof window === 'undefined') {
			return
		}

		try {
			window.localStorage.setItem(
				key,
				JSON.stringify(storedValue, replaceLocalStorageValue),
			)
		} catch (error) {
			console.error(error)
		}
	}, [key, storedValue])

	return [storedValue, setStoredValue]
}

export default useLocalStorage
