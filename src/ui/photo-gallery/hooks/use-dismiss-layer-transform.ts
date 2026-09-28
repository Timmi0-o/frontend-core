'use client'

import { getMediaOverlayDismissScale } from '@/ui/photo-gallery/utils/media-overlay-dismiss'
import type { MotionValue } from 'framer-motion'
import { useEffect, useRef, type RefObject } from 'react'

/**
 * Transform stage только во время vertical dismiss.
 * `active` — stage в DOM (галерея открыта), иначе подписка на dragY не вешается.
 */
export const useDismissLayerTransform = (
	dragY: MotionValue<number>,
	active: boolean,
): RefObject<HTMLDivElement | null> => {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!active) {
			return
		}

		const element = ref.current

		if (!element) {
			return
		}

		const applyTransform = (offsetY: number): void => {
			if (Math.abs(offsetY) < 0.5) {
				element.style.transform = ''
				return
			}

			const scale = getMediaOverlayDismissScale(offsetY)
			element.style.transform = `translate3d(0, ${Math.round(offsetY)}px, 0) scale(${scale})`
		}

		applyTransform(dragY.get())

		return dragY.on('change', applyTransform)
	}, [active, dragY])

	return ref
}
