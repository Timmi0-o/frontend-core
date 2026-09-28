'use client'

import {
	getPhotoGalleryEdgeZoneWidthPx,
	PHOTO_GALLERY_EDGE_TAP_MAX_MOVE_PX,
	PHOTO_GALLERY_EDGE_TAP_MAX_MS,
} from '@/ui/photo-gallery/photo-gallery-edge.constants'
import { useEffect, useRef, type RefObject } from 'react'
import type { Swiper as SwiperType } from 'swiper/types'

interface IEdgeTapStart {
	pointerId: number
	x: number
	y: number
	time: number
}

interface IUsePhotoGalleryEdgeTapParams {
	stageRef: RefObject<HTMLElement | null>
	swiperRef: RefObject<SwiperType | null>
	enabled: boolean
	canGoPrevious: boolean
	canGoNext: boolean
}

/**
 * Edge-tap prev/next на touch: зоны с pointer-events: none, чтобы не мешать Swiper.
 * Короткий тап у края → slidePrev/slideNext.
 */
export const usePhotoGalleryEdgeTap = ({
	stageRef,
	swiperRef,
	enabled,
	canGoPrevious,
	canGoNext,
}: IUsePhotoGalleryEdgeTapParams) => {
	const startRef = useRef<IEdgeTapStart | null>(null)
	const canGoPreviousRef = useRef(canGoPrevious)
	const canGoNextRef = useRef(canGoNext)

	canGoPreviousRef.current = canGoPrevious
	canGoNextRef.current = canGoNext

	useEffect(() => {
		if (!enabled) {
			startRef.current = null
			return
		}

		const isCoarsePointer =
			typeof window !== 'undefined' &&
			window.matchMedia('(pointer: coarse)').matches

		if (!isCoarsePointer) {
			return
		}

		const isTouchLike = (event: PointerEvent): boolean =>
			event.pointerType === 'touch' || event.pointerType === 'pen'

		const onPointerDown = (event: PointerEvent): void => {
			if (!isTouchLike(event) || event.button !== 0) {
				return
			}

			const stage = stageRef.current

			if (!stage || !event.composedPath().includes(stage)) {
				return
			}

			startRef.current = {
				pointerId: event.pointerId,
				x: event.clientX,
				y: event.clientY,
				time: event.timeStamp,
			}
		}

		const onPointerUp = (event: PointerEvent): void => {
			if (!isTouchLike(event)) {
				return
			}

			const start = startRef.current

			if (!start || start.pointerId !== event.pointerId) {
				return
			}

			startRef.current = null

			const stage = stageRef.current

			if (!stage) {
				return
			}

			const dx = event.clientX - start.x
			const dy = event.clientY - start.y
			const elapsed = event.timeStamp - start.time

			if (
				Math.hypot(dx, dy) > PHOTO_GALLERY_EDGE_TAP_MAX_MOVE_PX ||
				elapsed > PHOTO_GALLERY_EDGE_TAP_MAX_MS
			) {
				return
			}

			const rect = stage.getBoundingClientRect()
			const zoneWidth = getPhotoGalleryEdgeZoneWidthPx(rect.width)
			const xInStage = event.clientX - rect.left
			const fromRight = rect.right - event.clientX
			const swiper = swiperRef.current

			if (!swiper || swiper.destroyed) {
				return
			}

			if (xInStage <= zoneWidth && canGoPreviousRef.current) {
				swiper.slidePrev()
				return
			}

			if (fromRight <= zoneWidth && canGoNextRef.current) {
				swiper.slideNext()
			}
		}

		const captureOptions: AddEventListenerOptions = { capture: true }

		document.addEventListener('pointerdown', onPointerDown, captureOptions)
		document.addEventListener('pointerup', onPointerUp, captureOptions)
		document.addEventListener('pointercancel', onPointerUp, captureOptions)

		return () => {
			document.removeEventListener('pointerdown', onPointerDown, captureOptions)
			document.removeEventListener('pointerup', onPointerUp, captureOptions)
			document.removeEventListener('pointercancel', onPointerUp, captureOptions)
			startRef.current = null
		}
	}, [canGoNext, canGoPrevious, enabled, stageRef, swiperRef])
}
