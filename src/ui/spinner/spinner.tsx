'use client'

import { cn } from '@/core/cn'
import type { ReactElement } from 'react'
import type { ISpinnerProps } from './types/i-spinner-props'

export type {
	ISpinnerProps,
	ISpinnerSize,
	TSpinnerVariant,
} from './types/i-spinner-props'

const SpinnerRoot = ({
	size = 'md',
	variant = 'default',
	className,
}: ISpinnerProps): ReactElement => {
	return (
		<span
			data-slot='spinner'
			data-size={size}
			data-variant={variant}
			className={cn(className)}
			role='status'
			aria-label='Loading'
		/>
	)
}

SpinnerRoot.displayName = 'Spinner'

/**
 * Индикатор загрузки без текста. Для кнопки — `Button` с `isPending`, не Spinner вручную.
 *
 * @example
 * ```tsx
 * <Spinner size="md" />
 * <Spinner size="sm" variant="secondary" />
 * ```
 */
export const Spinner = Object.assign(SpinnerRoot, {
	Root: SpinnerRoot,
})
