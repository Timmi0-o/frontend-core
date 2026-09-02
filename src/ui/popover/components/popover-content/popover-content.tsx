'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import type { ReactNode } from 'react'

import { cn } from '@/core/cn'
import { floatingLayerStyle, useOverlayLayer } from '@/core/overlay-layer'
import { POPOVER_DISPLAY_NAMES } from '../../constants/popover.constants'
import { usePopoverContext } from '../../context/popover-context'
import type { IPopoverContentProps } from '../../types/i-popover-props'

/**
 * Тело попапа. Рендерится в портале поверх кита.
 *
 * @example
 * ```tsx
 * <Popover.Content>Фильтры</Popover.Content>
 * ```
 */
export const PopoverContent = ({
	children,
	className,
	panelClassName,
	hasPanel = true,
	initialFocus = true,
	finalFocus,
	style,
	variant = 'default',
	container,
}: IPopoverContentProps): ReactNode => {
	const { side, align, sideOffset, anchorElement, uiKit, portalContainer } =
		usePopoverContext()
	const { floatingZ } = useOverlayLayer()

	return (
		<PopoverPrimitive.Portal
			container={container ?? portalContainer ?? undefined}
		>
			<PopoverPrimitive.Positioner
				side={side}
				align={align}
				sideOffset={sideOffset}
				collisionPadding={8}
				positionMethod='fixed'
				{...(anchorElement ? { anchor: anchorElement } : {})}
				data-slot='popover-positioner'
				data-ui-kit={uiKit}
				style={floatingLayerStyle(floatingZ)}
			>
				<PopoverPrimitive.Popup
					data-slot='popover-content'
					data-variant={variant}
					initialFocus={initialFocus}
					finalFocus={finalFocus}
					className={hasPanel ? undefined : cn(className)}
					style={style}
				>
					{hasPanel ? (
						<div
							data-slot='popover-panel'
							className={cn(className, panelClassName)}
						>
							{children}
						</div>
					) : (
						children
					)}
				</PopoverPrimitive.Popup>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	)
}

PopoverContent.displayName = POPOVER_DISPLAY_NAMES.CONTENT
