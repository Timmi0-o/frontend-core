const FLOATING_OUTSIDE_DISMISS_REASONS = new Set([
	'outside-press',
	'focus-out',
])

let openFloatingCount = 0
let dismissLockedUntilPointerUp = false
let unlockListenerAttached = false

const unlockDismissLock = (): void => {
	dismissLockedUntilPointerUp = false
	unlockListenerAttached = false
}

const attachUnlockListeners = (): void => {
	if (unlockListenerAttached || typeof document === 'undefined') {
		return
	}

	unlockListenerAttached = true
	document.addEventListener('pointerup', unlockDismissLock, { once: true })
	document.addEventListener('pointercancel', unlockDismissLock, { once: true })
}

/** Popover/Select открыт поверх Modal/Drawer — родитель не закрываем. */
export const registerOverlayFloatingOpen = (): (() => void) => {
	openFloatingCount += 1

	return () => {
		openFloatingCount = Math.max(0, openFloatingCount - 1)
	}
}

/** После outside-dismiss попапа — блок до pointerup, чтобы жест не закрыл родителя. */
export const lockOverlayParentDismissUntilPointerUp = (): void => {
	if (typeof document === 'undefined') {
		return
	}

	dismissLockedUntilPointerUp = true
	attachUnlockListeners()
}

export const isOverlayParentDismissLocked = (): boolean =>
	openFloatingCount > 0 || dismissLockedUntilPointerUp

export const shouldLockOverlayParentAfterFloatingClose = (
	reason?: string,
): boolean => (reason ? FLOATING_OUTSIDE_DISMISS_REASONS.has(reason) : false)
