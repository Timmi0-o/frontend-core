'use client'

import { useEffect, useState } from 'react'

/**
 * Отдаёт значение с задержкой после последнего изменения.
 * Нужен поиску и фильтрам, чтобы не дёргать запрос на каждый символ.
 */
export const useDebounceValue = <T>(value: T, delayMs: number): T => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setDebouncedValue(value)
		}, delayMs)

		return () => {
			window.clearTimeout(timer)
		}
	}, [delayMs, value])

	return debouncedValue
}

export const useDebouncedValue = useDebounceValue

export default useDebounceValue
