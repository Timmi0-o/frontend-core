import type { Transition } from 'framer-motion'

const MEDIA_OVERLAY_EASE = [0.16, 1, 0.3, 1] as [
	number,
	number,
	number,
	number,
]

const MEDIA_OVERLAY_DISMISS_FLING_EASE = [0.22, 0.61, 0.36, 1] as [
	number,
	number,
	number,
	number,
]

/** Смещение по вертикали, после которого жест считается dismiss, а не свайпом слайда. */
export const MEDIA_OVERLAY_DISMISS_ACTIVATE_PX = 14

/** Смещение, достаточное для закрытия при отпускании. */
export const MEDIA_OVERLAY_DISMISS_OFFSET_PX = 128

/** Скорость (px/s), достаточная для закрытия при отпускании. */
export const MEDIA_OVERLAY_DISMISS_VELOCITY = 850

/** Минимальная дистанция «улёта» кадра при закрытии жестом. */
export const MEDIA_OVERLAY_DISMISS_FLING_PX = 640

/** |y|, при котором backdrop полностью прозрачный. */
export const MEDIA_OVERLAY_DISMISS_BACKDROP_FADE_PX = 180

const MEDIA_OVERLAY_DISMISS_FLING_SPEED_PX_PER_S = 1200
const MEDIA_OVERLAY_DISMISS_FLING_DURATION_MIN = 0.42
const MEDIA_OVERLAY_DISMISS_FLING_DURATION_MAX = 0.58

export const MEDIA_OVERLAY_DISMISS_SNAP_TRANSITION: Transition = {
	type: 'tween',
	duration: 0.28,
	ease: MEDIA_OVERLAY_EASE,
}

/**
 * Длительность fling зависит от оставшегося пути — кадр не «телепортируется».
 * Нужен анимации закрытия жестом в PhotoGallery.
 */
export const getMediaOverlayDismissFlingTransition = (
	remainingPx: number,
): Transition => ({
	type: 'tween',
	duration: Math.min(
		MEDIA_OVERLAY_DISMISS_FLING_DURATION_MAX,
		Math.max(
			MEDIA_OVERLAY_DISMISS_FLING_DURATION_MIN,
			remainingPx / MEDIA_OVERLAY_DISMISS_FLING_SPEED_PX_PER_S,
		),
	),
	ease: MEDIA_OVERLAY_DISMISS_FLING_EASE,
})

/**
 * Затемнение фона падает по мере вертикального смещения.
 * Нужен жесту dismiss, чтобы backdrop следовал за пальцем.
 */
export const getMediaOverlayDismissBackdropOpacity = (
	offsetY: number,
): number =>
	1 - Math.min(1, Math.abs(offsetY) / MEDIA_OVERLAY_DISMISS_BACKDROP_FADE_PX)

/**
 * Кадр слегка уменьшается при сдвиге вниз/вверх.
 * Нужен слою dismiss, чтобы жест выглядел как «срыв» оверлея.
 */
export const getMediaOverlayDismissScale = (offsetY: number): number => {
	const progress = Math.min(1, Math.abs(offsetY) / 340)
	return 1 - progress * 0.1
}

/**
 * Шапка и счётчик гаснут быстрее кадра.
 * Нужен chrome PhotoGallery, чтобы не тащить контролы вместе с фото.
 */
export const getMediaOverlayDismissChromeOpacity = (
	offsetY: number,
): number => {
	const progress = Math.min(1, Math.abs(offsetY) / 90)
	return 1 - progress
}

/**
 * Закрывать ли оверлей по смещению или скорости пальца.
 * Нужен pointer-up жеста dismiss.
 */
export const shouldDismissMediaOverlay = (
	offsetY: number,
	velocityY: number,
): boolean =>
	Math.abs(offsetY) >= MEDIA_OVERLAY_DISMISS_OFFSET_PX ||
	Math.abs(velocityY) >= MEDIA_OVERLAY_DISMISS_VELOCITY
