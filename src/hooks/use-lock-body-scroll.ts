'use client'

import { useEffect } from 'react'

/**
 * Блокирует скролл `document.body`, пока `locked` true.
 * На unlock/unmount возвращает прежний `overflow`.
 */
export const useLockBodyScroll = (locked: boolean): void => {
	useEffect(() => {
		if (!locked) {
			return
		}

		const { body } = document
		const previousOverflow = body.style.overflow
		body.style.overflow = 'hidden'

		return () => {
			body.style.overflow = previousOverflow
		}
	}, [locked])
}
