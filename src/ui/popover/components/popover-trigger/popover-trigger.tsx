'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import type { ReactNode } from 'react'
import { POPOVER_DISPLAY_NAMES } from '../../constants/popover.constants'
import type { IPopoverTriggerProps } from '../../types/i-popover-props'
import { isNativeButtonTrigger } from '../../utils/is-native-button-trigger'

/**
 * Элемент, клик по которому открывает Popover. Ребёнок — один React-элемент (`Button`).
 *
 * @example
 * ```tsx
 * <Popover.Trigger>
 *   <Button variant="outline">Открыть</Button>
 * </Popover.Trigger>
 * ```
 */
export const PopoverTrigger = ({
	children,
	className,
	variant = 'default',
}: IPopoverTriggerProps): ReactNode => {
	return (
		<PopoverPrimitive.Trigger
			render={children}
			nativeButton={isNativeButtonTrigger(children)}
			className={className}
			data-slot='popover-trigger'
			data-variant={variant}
		/>
	)
}

PopoverTrigger.displayName = POPOVER_DISPLAY_NAMES.TRIGGER
