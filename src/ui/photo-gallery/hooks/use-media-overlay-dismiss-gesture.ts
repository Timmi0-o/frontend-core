'use client'

import {
	MEDIA_OVERLAY_DISMISS_ACTIVATE_PX,
	MEDIA_OVERLAY_DISMISS_FLING_PX,
	MEDIA_OVERLAY_DISMISS_SNAP_TRANSITION,
	getMediaOverlayDismissBackdropOpacity,
	getMediaOverlayDismissFlingTransition,
	shouldDismissMediaOverlay,
} from '@/ui/photo-gallery/utils/media-overlay-dismiss'
import { animate, type MotionValue } from 'framer-motion'
import {
	useCallback,
	useEffect,
	useRef,
	type PointerEvent as ReactPointerEvent,
} from 'react'

type GestureMode = 'idle' | 'pending' | 'dismiss' | 'passthrough'

interface IGestureState {
	pointerId: number
	startX: number
	startY: number
	lastY: number
	lastTime: number
	velocityY: number
	mode: GestureMode
}

interface IUseMediaOverlayDismissGestureParams {
	dragY: MotionValue<number>
	backdropOpacity: MotionValue<number>
	enabled: boolean
	onDismiss: () => void
	isBlocked?: () => boolean
	onDismissLockChange?: (isLocked: boolean) => void
}

/**
 * Вертикальный жест закрытия медиа-оверлея: pending → dismiss или passthrough.
 * Нужен PhotoGallery (и потенциально другим fullscreen-просмотрщикам),
 * чтобы не конфликтовать со свайпом слайдера, пока жест не захвачен.
 */
export const useMediaOverlayDismissGesture = ({
	dragY,
	backdropOpacity,
	enabled,
	onDismiss,
	isBlocked,
	onDismissLockChange,
}: IUseMediaOverlayDismissGestureParams) => {
	const gestureRef = useRef<IGestureState | null>(null)
	const isDismissingRef = useRef(false)

	const resetDrag = useCallback(() => {
		void animate(dragY, 0, MEDIA_OVERLAY_DISMISS_SNAP_TRANSITION)
		void animate(backdropOpacity, 1, MEDIA_OVERLAY_DISMISS_SNAP_TRANSITION)
	}, [backdropOpacity, dragY])

	const setDismissLocked = useCallback(
		(isLocked: boolean) => {
			onDismissLockChange?.(isLocked)
		},
		[onDismissLockChange],
	)

	const finishDismiss = useCallback(
		async (offsetY: number) => {
			if (isDismissingRef.current) {
				return
			}

			isDismissingRef.current = true
			const direction = offsetY === 0 ? 1 : Math.sign(offsetY)
			const flingDistance = Math.max(
				typeof window !== 'undefined' ? window.innerHeight * 1.08 : 0,
				MEDIA_OVERLAY_DISMISS_FLING_PX,
			)
			const target = direction * flingDistance
			const flingTransition = getMediaOverlayDismissFlingTransition(
				Math.abs(target - offsetY),
			)

			await Promise.all([
				animate(dragY, target, flingTransition),
				animate(backdropOpacity, 0, flingTransition),
			])
			onDismiss()
			isDismissingRef.current = false
			setDismissLocked(false)
		},
		[backdropOpacity, dragY, onDismiss, setDismissLocked],
	)

	const onPointerDown = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			if (!enabled || isDismissingRef.current || isBlocked?.()) {
				return
			}

			if (event.button !== 0 && event.pointerType === 'mouse') {
				return
			}

			gestureRef.current = {
				pointerId: event.pointerId,
				startX: event.clientX,
				startY: event.clientY,
				lastY: event.clientY,
				lastTime: event.timeStamp,
				velocityY: 0,
				mode: 'pending',
			}
		},
		[enabled, isBlocked],
	)

	const onPointerMove = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			const gesture = gestureRef.current

			if (!gesture || gesture.pointerId !== event.pointerId) {
				return
			}

			const deltaX = event.clientX - gesture.startX
			const deltaY = event.clientY - gesture.startY
			const now = event.timeStamp
			const dt = Math.max(1, now - gesture.lastTime)
			gesture.velocityY = ((event.clientY - gesture.lastY) / dt) * 1000
			gesture.lastY = event.clientY
			gesture.lastTime = now

			if (gesture.mode === 'pending') {
				const absX = Math.abs(deltaX)
				const absY = Math.abs(deltaY)

				if (
					absX < MEDIA_OVERLAY_DISMISS_ACTIVATE_PX &&
					absY < MEDIA_OVERLAY_DISMISS_ACTIVATE_PX
				) {
					return
				}

				if (absY > absX * 1.15) {
					gesture.mode = 'dismiss'
					setDismissLocked(true)
					event.currentTarget.setPointerCapture(event.pointerId)
				} else {
					gesture.mode = 'passthrough'
					return
				}
			}

			if (gesture.mode !== 'dismiss') {
				return
			}

			event.preventDefault()
			dragY.set(deltaY)
			backdropOpacity.set(getMediaOverlayDismissBackdropOpacity(deltaY))
		},
		[backdropOpacity, dragY, setDismissLocked],
	)

	const endGesture = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			const gesture = gestureRef.current

			if (!gesture || gesture.pointerId !== event.pointerId) {
				return
			}

			const offsetY = dragY.get()
			const velocityY = gesture.velocityY
			const isDismissGesture = gesture.mode === 'dismiss'

			gestureRef.current = null

			if (event.currentTarget.hasPointerCapture(event.pointerId)) {
				event.currentTarget.releasePointerCapture(event.pointerId)
			}

			if (!isDismissGesture) {
				setDismissLocked(false)
				return
			}

			if (shouldDismissMediaOverlay(offsetY, velocityY)) {
				void finishDismiss(offsetY)
				return
			}

			setDismissLocked(false)
			resetDrag()
		},
		[dragY, finishDismiss, resetDrag, setDismissLocked],
	)

	useEffect(() => {
		if (enabled) {
			return
		}

		gestureRef.current = null
		isDismissingRef.current = false
		setDismissLocked(false)
	}, [enabled, setDismissLocked])

	return {
		onPointerDown,
		onPointerMove,
		onPointerUp: endGesture,
		onPointerCancel: endGesture,
	}
}
