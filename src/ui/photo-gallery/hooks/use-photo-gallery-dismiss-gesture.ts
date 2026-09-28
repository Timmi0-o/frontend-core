'use client'

import { useMediaOverlayDismissGesture } from '@/ui/photo-gallery/hooks/use-media-overlay-dismiss-gesture'
import type { MotionValue } from 'framer-motion'
import { useCallback, type RefObject } from 'react'
import type { Swiper as SwiperType } from 'swiper/types'

interface IUsePhotoGalleryDismissGestureParams {
	stageRef: RefObject<HTMLDivElement | null>
	dragY: MotionValue<number>
	backdropOpacity: MotionValue<number>
	enabled: boolean
	prefersReducedMotion: boolean | null
	swiperRef: RefObject<SwiperType | null>
	onDismiss: () => void
}

/** Vertical dismiss; при vertical drag блокируем листание Swiper. */
export const usePhotoGalleryDismissGesture = ({
	stageRef,
	dragY,
	backdropOpacity,
	enabled,
	prefersReducedMotion,
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

	useMediaOverlayDismissGesture({
		stageRef,
		dragY,
		backdropOpacity,
		enabled,
		prefersReducedMotion,
		onDismiss,
		isBlocked,
		onDismissLockChange,
	})
}
