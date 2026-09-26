import { isOverlayParentDismissLocked } from './overlay-floating-dismiss-lock'

const OVERLAY_FLOATING_TARGET_SELECTOR = [
	'[data-slot="popover-content"]',
	'[data-slot="popover-positioner"]',
	'[data-slot="popover-panel"]',
	'[data-slot="dropdown-menu-content"]',
	'[data-slot="dropdown-menu-positioner"]',
	'[data-slot="select-dropdown"]',
	'[data-slot="select-dropdown-list"]',
	'[data-slot="autocomplete-dropdown"]',
	'[data-slot="autocomplete-dropdown-list"]',
	'[data-slot="context-menu-content"]',
	'[data-slot="tooltip-content"]',
	'[data-slot="date-picker-popover"]',
	'[data-slot="date-picker-day"]',
].join(', ')

type TOutsideDismissEvent = CustomEvent<{ originalEvent: Event }>

/** Клик по порталу Popover/Select/меню внутри Modal/BottomSheet. */
export const isOverlayFloatingTarget = (
	target: EventTarget | null,
): boolean => {
	return (
		target instanceof Element &&
		target.closest(OVERLAY_FLOATING_TARGET_SELECTOR) !== null
	)
}

export const getOutsideDismissEventTarget = (
	event: TOutsideDismissEvent,
): EventTarget | null => {
	return event.detail?.originalEvent?.target ?? null
}

export const shouldPreventOverlayDismiss = (
	event: TOutsideDismissEvent,
): boolean => {
	if (isOverlayParentDismissLocked()) {
		return true
	}

	return isOverlayFloatingTarget(getOutsideDismissEventTarget(event))
}

/** @deprecated Используйте getOutsideDismissEventTarget */
export const getPointerDownOutsideTarget = getOutsideDismissEventTarget
