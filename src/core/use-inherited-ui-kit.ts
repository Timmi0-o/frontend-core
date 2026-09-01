'use client'

import { useLayoutEffect, useRef, useState, type RefObject } from 'react'

/**
 * Читает `data-ui-kit` с ближайшего предка.
 * Нужен порталам (Modal, Popover, BottomSheet): они уходят в `document.body`
 * и без этого атрибута CSS кита на них не действует.
 */
export const useInheritedUiKit = (): {
	hostRef: RefObject<HTMLSpanElement | null>
	uiKit: string | undefined
} => {
	const hostRef = useRef<HTMLSpanElement>(null)
	const [uiKit, setUiKit] = useState<string>()

	useLayoutEffect(() => {
		const kit = hostRef.current
			?.closest('[data-ui-kit]')
			?.getAttribute('data-ui-kit')

		if (kit) {
			setUiKit(kit)
		}
	}, [])

	return { hostRef, uiKit }
}
