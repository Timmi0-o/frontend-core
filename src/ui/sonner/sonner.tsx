'use client'

import type { TSlotVariant } from '@/core/slot-variant'
import { useInheritedUiKit } from '@/core/use-inherited-ui-kit'
import {
	useLayoutEffect,
	useRef,
	type ReactElement,
} from 'react'
import { Toaster as SonnerToaster } from 'sonner'

export interface IToasterProps {
	id?: string
	theme?: 'light' | 'dark'
	variant?: TSlotVariant
	position?:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'
}

const TOAST_SWIPE_DIRECTIONS = ['top', 'right', 'bottom', 'left'] as const

/**
 * Хост тостов. Один раз в корне приложения; показ — `toast` из `@timmi0-o/frontend-core/ui-kit`.
 *
 * @example
 * ```tsx
 * import { Toaster, toast } from '@timmi0-o/frontend-core/ui-kit'
 *
 * <Toaster position="bottom-right" />
 * toast.success('Сохранено')
 * ```
 */
export const Toaster = ({
	id,
	theme = 'light',
	variant = 'default',
	position = 'bottom-right',
}: IToasterProps): ReactElement => {
	const { hostRef, uiKit } = useInheritedUiKit()
	const toasterRef = useRef<HTMLElement | null>(null)

	useLayoutEffect(() => {
		if (!toasterRef.current) {
			return
		}

		toasterRef.current.setAttribute('data-slot', 'toaster')
		toasterRef.current.setAttribute('data-variant', variant)

		if (uiKit) {
			toasterRef.current.setAttribute('data-ui-kit', uiKit)
		}
	}, [uiKit, variant])

	return (
		<>
			<span ref={hostRef} hidden />
			<SonnerToaster
				ref={toasterRef}
				// Не прокидываем uiKit как sonner id: иначе toast() без toasterId молчит.
				id={id}
				theme={theme}
				position={position}
				closeButton
				gap={10}
				visibleToasts={3}
				swipeDirections={[...TOAST_SWIPE_DIRECTIONS]}
				toastOptions={{ unstyled: true }}
			/>
		</>
	)
}
