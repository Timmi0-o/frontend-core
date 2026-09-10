import type { MotionProps, Transition, Variants } from 'framer-motion'
import {
	MOTION_DURATION_FAST,
	MOTION_DURATION_MICRO,
	MOTION_DURATION_SLOW,
	MOTION_EASING_ENTER,
	MOTION_EASING_EXIT,
	REDUCED_MOTION_TRANSITION,
} from '@/motion'

export const GALLERY_OVERLAY_TRANSITION: Transition = {
	type: 'tween',
	duration: MOTION_DURATION_SLOW,
	ease: MOTION_EASING_ENTER,
}

export const GALLERY_OVERLAY_TRANSITION_REDUCED: Transition = {
	type: 'tween',
	...REDUCED_MOTION_TRANSITION,
}

export const GALLERY_OVERLAY_ROOT_VARIANTS: Variants = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	exit: {
		opacity: 0,
		pointerEvents: 'none',
		transition: {
			type: 'tween',
			duration: MOTION_DURATION_SLOW,
			ease: MOTION_EASING_EXIT,
			pointerEvents: { duration: 0 },
		},
	},
}

export const GALLERY_OVERLAY_STAGE_VARIANTS: Variants = {
	initial: {
		opacity: 0,
		scale: 0.92,
	},
	animate: {
		opacity: 1,
		scale: 1,
	},
}

export const GALLERY_OVERLAY_CHROME_TOP_VARIANTS: Variants = {
	initial: {
		y: -10,
	},
	animate: {
		y: 0,
		transition: {
			type: 'tween',
			duration: MOTION_DURATION_SLOW,
			ease: MOTION_EASING_ENTER,
			delay: MOTION_DURATION_MICRO,
		},
	},
}

export const GALLERY_OVERLAY_CHROME_BOTTOM_VARIANTS: Variants = {
	initial: {
		y: 14,
	},
	animate: {
		y: 0,
		transition: {
			type: 'tween',
			duration: MOTION_DURATION_SLOW,
			ease: MOTION_EASING_ENTER,
			delay: MOTION_DURATION_FAST,
		},
	},
}

/**
 * initial/animate/exit для корня оверлея с учётом prefers-reduced-motion.
 * Нужен PhotoGallery, чтобы не дублировать ветку «без анимации» в JSX.
 */
export const galleryOverlayMotionProps = (
	prefersReducedMotion: boolean | null,
): Pick<MotionProps, 'initial' | 'animate' | 'exit' | 'transition'> => ({
	initial: 'initial',
	animate: 'animate',
	exit: 'exit',
	transition: prefersReducedMotion
		? GALLERY_OVERLAY_TRANSITION_REDUCED
		: GALLERY_OVERLAY_TRANSITION,
})

/**
 * initial/animate для шапки, сцены и футера при входе.
 * Нужен тем же слоям, у которых нет собственного exit, кроме opacity жеста.
 */
export const galleryOverlayEnterMotionProps = (
	prefersReducedMotion: boolean | null,
): Pick<MotionProps, 'initial' | 'animate' | 'transition'> => ({
	initial: 'initial',
	animate: 'animate',
	transition: prefersReducedMotion
		? GALLERY_OVERLAY_TRANSITION_REDUCED
		: GALLERY_OVERLAY_TRANSITION,
})
