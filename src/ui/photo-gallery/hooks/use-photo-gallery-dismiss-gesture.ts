'use client'

import { useMediaOverlayDismissGesture } from '@/ui/photo-gallery/hooks/use-media-overlay-dismiss-gesture'
import type { MotionValue } from 'framer-motion'
import { useCallback, type RefObject } from 'react'
import type { Swiper as SwiperType } from 'swiper/types'

interface IUsePhotoGalleryDismissGestureParams {
	dragY: MotionValue<number>
	backdropOpacity: MotionValue<number>
	enabled: boolean
	swiperRef: RefObject<SwiperType | null>
	onDismiss: () => void
}

/**
 * Жест закрытия галереи поверх общего media-overlay dismiss:
 * при зуме dismiss выключен, на захвате — Swiper не листает.
 *
 * Нужен PhotoGallery, чтобы вертикальный свайп не спорил с pinch-zoom.
 */
export const usePhotoGalleryDismissGesture = ({
	dragY,
	backdropOpacity,
	enabled,
	swiperRef,
	onDismiss,
}: IUsePhotoGalleryDismissGestureParams) => {
	const isBlocked = useCallback(() => {
		const scale = swiperRef.current?.zoom?.scale ?? 1
		return scale > 1.02
	}, [swiperRef])

	const onDismissLockChange = useCallback(
		(isLocked: boolean) => {
			const swiper = swiperRef.current

			if (!swiper || swiper.destroyed) {
				return
			}

			swiper.allowTouchMove = !isLocked
		},
		[swiperRef],
	)

	return useMediaOverlayDismissGesture({
		dragY,
		backdropOpacity,
		enabled,
		onDismiss,
		isBlocked,
		onDismissLockChange,
	})
}
