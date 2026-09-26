'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { findHoverFloatingRoot } from '@/core/hover-floating-root'
import {
	lockOverlayParentDismissUntilPointerUp,
	registerOverlayFloatingOpen,
	shouldLockOverlayParentAfterFloatingClose,
} from '@/core/overlay-floating-dismiss-lock'
import { getOverlayPortalContainer } from '@/core/overlay-layer'
import { useInheritedUiKit } from '@/core/use-inherited-ui-kit'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from 'react'
import { PopoverAnchor } from './components/popover-anchor/popover-anchor'
import { PopoverContent } from './components/popover-content/popover-content'
import { PopoverTrigger } from './components/popover-trigger/popover-trigger'
import { POPOVER_DISPLAY_NAMES } from './constants/popover.constants'
import { PopoverContext } from './context/popover-context'
import type { IPopoverContextValue } from './types/i-popover-context-value'
import type { IPopoverProps, TPopoverComponent } from './types/i-popover-props'
import { mapPopoverPlacement } from './utils/map-popover-placement'

const PopoverRoot = ({
	children,
	open,
	onOpenChange,
	placement = 'bottom',
	offset = 8,
	modal = true,
}: IPopoverProps): ReactNode => {
	const [anchorElement, setAnchorElementState] = useState<HTMLElement | null>(
		null,
	)
	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
		null,
	)
	const isControlled = typeof open === 'boolean'
	const { side, align } = mapPopoverPlacement(placement)
	const { hostRef, uiKit } = useInheritedUiKit()
	const unregisterFloatingOpenRef = useRef<(() => void) | null>(null)

	const setAnchorElement = useCallback((element: HTMLElement | null) => {
		setAnchorElementState(element)
	}, [])

	const handleOpenChange = useCallback(
		(
			isNextOpen: boolean,
			eventDetails?: Parameters<
				NonNullable<PopoverPrimitive.Root.Props['onOpenChange']>
			>[1],
		) => {
			if (isNextOpen) {
				unregisterFloatingOpenRef.current?.()
				unregisterFloatingOpenRef.current = registerOverlayFloatingOpen()
			} else {
				unregisterFloatingOpenRef.current?.()
				unregisterFloatingOpenRef.current = null

				if (
					shouldLockOverlayParentAfterFloatingClose(eventDetails?.reason)
				) {
					lockOverlayParentDismissUntilPointerUp()
				}
			}

			onOpenChange?.(isNextOpen, eventDetails)
		},
		[onOpenChange],
	)

	useEffect(() => {
		if (!isControlled || !open) {
			return undefined
		}

		unregisterFloatingOpenRef.current?.()
		unregisterFloatingOpenRef.current = registerOverlayFloatingOpen()

		return () => {
			unregisterFloatingOpenRef.current?.()
			unregisterFloatingOpenRef.current = null
		}
	}, [isControlled, open])

	useEffect(
		() => () => {
			unregisterFloatingOpenRef.current?.()
			unregisterFloatingOpenRef.current = null
		},
		[],
	)

	useLayoutEffect(() => {
		setPortalContainer(
			findHoverFloatingRoot(hostRef.current) ?? getOverlayPortalContainer(),
		)
	}, [hostRef, open])

	const value = useMemo<IPopoverContextValue>(
		() => ({
			side,
			align,
			sideOffset: offset,
			anchorElement,
			setAnchorElement,
			uiKit,
			portalContainer,
		}),
		[
			align,
			anchorElement,
			offset,
			portalContainer,
			setAnchorElement,
			side,
			uiKit,
		],
	)

	return (
		<PopoverPrimitive.Root
			{...(isControlled ? { open } : { defaultOpen: false })}
			modal={modal}
			onOpenChange={handleOpenChange}
		>
			<span ref={hostRef} hidden />
			<PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
		</PopoverPrimitive.Root>
	)
}

PopoverRoot.displayName = POPOVER_DISPLAY_NAMES.ROOT

/**
 * Попап у якоря. Trigger открывает; Content порталится в hover-слой кита.
 *
 * @example
 * ```tsx
 * <Popover placement="bottom-start">
 *   <Popover.Trigger>
 *     <Button variant="outline">Фильтры</Button>
 *   </Popover.Trigger>
 *   <Popover.Content>Опции фильтра</Popover.Content>
 * </Popover>
 * ```
 */
export const Popover: TPopoverComponent = Object.assign(PopoverRoot, {
	Trigger: PopoverTrigger,
	Anchor: PopoverAnchor,
	Content: PopoverContent,
})

export { PopoverAnchor, PopoverContent, PopoverTrigger }
