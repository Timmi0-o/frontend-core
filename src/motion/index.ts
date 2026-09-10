export type TMotionEase = [number, number, number, number]

export const MOTION_EASING = {
	enter: [0.28, 0.08, 0.16, 1],
	exit: [0.28, 0.08, 0.16, 1],
	standard: [0.25, 0.1, 0.25, 1],
	control: [0.2, 0.8, 0.2, 1],
} satisfies Record<'enter' | 'exit' | 'standard' | 'control', TMotionEase>

export const MOTION_DURATION = {
	instant: 0,
	micro: 0.1,
	fast: 0.15,
	control: 0.18,
	short: 0.22,
	standard: 0.28,
	slow: 0.32,
	medium: 0.34,
	long: 0.44,
	emphasized: 0.55,
} as const

export const MOTION_EASING_ENTER = MOTION_EASING.enter
export const MOTION_EASING_EXIT = MOTION_EASING.exit
export const MOTION_EASING_STANDARD = MOTION_EASING.standard
export const MOTION_EASING_CONTROL = MOTION_EASING.control

export const MOTION_DURATION_MICRO = MOTION_DURATION.micro
export const MOTION_DURATION_FAST = MOTION_DURATION.fast
export const MOTION_DURATION_BASE = MOTION_DURATION.short
export const MOTION_DURATION_SLOW = MOTION_DURATION.slow

export const REDUCED_MOTION_TRANSITION = {
	type: 'tween',
	duration: MOTION_DURATION.instant,
} as const
