'use client'

import {
	MEDIA_OVERLAY_DISMISS_ACTIVATE_PX,
	MEDIA_OVERLAY_DISMISS_FLING_PX,
	MEDIA_OVERLAY_DISMISS_SNAP_TRANSITION,
	getMediaOverlayDismissBackdropOpacity,
	getMediaOverlayDismissFlingTransition,
	shouldDismissMediaOverlay,
} from '@/ui/photo-gallery/utils/media-overlay-dismiss'
import { REDUCED_MOTION_TRANSITION } from '@/motion'
import { animate, type MotionValue } from 'framer-motion'
import { useCallback, useEffect, useRef, type RefObject } from 'react'

type GestureMode = 'pending' | 'dismiss' | 'passthrough'

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
	stageRef: RefObject<HTMLElement | null>
	dragY: MotionValue<number>
	backdropOpacity: MotionValue<number>
	enabled: boolean
	prefersReducedMotion: boolean | null
	onDismiss: () => void
	isBlocked?: () => boolean
	onDismissLockChange?: (isLocked: boolean) => void
}

const isTouchLikePointer = (event: PointerEvent): boolean =>
	event.pointerType === 'touch' || event.pointerType === 'pen'

const isEventInsideStage = (
	event: PointerEvent,
	stage: HTMLElement | null,
): boolean => {
	if (!stage) {
		return false
	}

	return event.composedPath().includes(stage)
}

/**
 * Vertical dismiss через document capture (раньше Swiper).
 * touch-action: none на stage — иначе pan-x у Swiper съедает vertical.
 */
export const useMediaOverlayDismissGesture = ({
	stageRef,
	dragY,
	backdropOpacity,
	enabled,
	prefersReducedMotion,
	onDismiss,
	isBlocked,
	onDismissLockChange,
}: IUseMediaOverlayDismissGestureParams) => {
	const gestureRef = useRef<IGestureState | null>(null)
	const isDismissingRef = useRef(false)

	const snapTransition = prefersReducedMotion
		? REDUCED_MOTION_TRANSITION
		: MEDIA_OVERLAY_DISMISS_SNAP_TRANSITION

	const resetDrag = useCallback(() => {
		if (prefersReducedMotion) {
			dragY.set(0)
			backdropOpacity.set(1)
			return
		}

		void animate(dragY, 0, snapTransition)
		void animate(backdropOpacity, 1, snapTransition)
	}, [backdropOpacity, dragY, prefersReducedMotion, snapTransition])

	const finishDismiss = useCallback(
		async (offsetY: number) => {
			if (isDismissingRef.current) {
				return
			}

			isDismissingRef.current = true
			onDismissLockChange?.(false)

			if (prefersReducedMotion) {
				onDismiss()
				isDismissingRef.current = false
				return
			}

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
		},
		[backdropOpacity, dragY, onDismiss, onDismissLockChange, prefersReducedMotion],
	)

	const setDismissLocked = useCallback(
		(isLocked: boolean) => {
			onDismissLockChange?.(isLocked)
		},
		[onDismissLockChange],
	)

	useEffect(() => {
		if (!enabled) {
			gestureRef.current = null
			isDismissingRef.current = false
			setDismissLocked(false)
			return
		}

		const onPointerDown = (event: PointerEvent): void => {
			if (isDismissingRef.current || isBlocked?.()) {
				return
			}

			if (!isTouchLikePointer(event)) {
				return
			}

			if (event.button !== 0) {
				return
			}

			if (!isEventInsideStage(event, stageRef.current)) {
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
		}

		const onPointerMove = (event: PointerEvent): void => {
			if (!isTouchLikePointer(event)) {
				return
			}

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

				if (absX > absY) {
					gestureRef.current = null
					return
				}

				gesture.mode = 'dismiss'
				setDismissLocked(true)
				stageRef.current?.setPointerCapture(event.pointerId)
			}

			if (gesture.mode !== 'dismiss') {
				return
			}

			event.preventDefault()
			event.stopImmediatePropagation()
			dragY.set(deltaY)
			backdropOpacity.set(getMediaOverlayDismissBackdropOpacity(deltaY))
		}

		const endGesture = (event: PointerEvent): void => {
			if (!isTouchLikePointer(event)) {
				return
			}

			const gesture = gestureRef.current

			if (!gesture || gesture.pointerId !== event.pointerId) {
				return
			}

			const offsetY = dragY.get()
			const velocityY = gesture.velocityY
			const isDismissGesture = gesture.mode === 'dismiss'
			const stage = stageRef.current

			gestureRef.current = null

			if (stage?.hasPointerCapture(event.pointerId)) {
				stage.releasePointerCapture(event.pointerId)
			}

			if (!isDismissGesture) {
				return
			}

			if (shouldDismissMediaOverlay(offsetY, velocityY)) {
				void finishDismiss(offsetY)
				return
			}

			setDismissLocked(false)
			resetDrag()
		}

		const captureOptions: AddEventListenerOptions = { capture: true }
		const moveOptions: AddEventListenerOptions = {
			capture: true,
			passive: false,
		}

		document.addEventListener('pointerdown', onPointerDown, captureOptions)
		document.addEventListener('pointermove', onPointerMove, moveOptions)
		document.addEventListener('pointerup', endGesture, captureOptions)
		document.addEventListener('pointercancel', endGesture, captureOptions)

		return () => {
			document.removeEventListener('pointerdown', onPointerDown, captureOptions)
			document.removeEventListener('pointermove', onPointerMove, moveOptions)
			document.removeEventListener('pointerup', endGesture, captureOptions)
			document.removeEventListener(
				'pointercancel',
				endGesture,
				captureOptions,
			)
			gestureRef.current = null
			isDismissingRef.current = false
			setDismissLocked(false)
		}
	}, [
		backdropOpacity,
		dragY,
		enabled,
		finishDismiss,
		isBlocked,
		prefersReducedMotion,
		resetDrag,
		setDismissLocked,
		stageRef,
	])
}
