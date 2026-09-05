'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cn } from '@/core/cn'
import { Spinner } from '@/ui/spinner/spinner'
import {
	forwardRef,
	isValidElement,
	type MouseEvent,
	type ReactElement,
	useCallback,
} from 'react'
import type { IButtonProps, IButtonSize } from './types/i-button-props'

export type {
	IButtonClickHandler,
	IButtonProps,
	IButtonSize,
	IButtonVariant,
} from './types/i-button-props'

/**
 * Масштаб спиннера внутри кнопки: на `lg` он крупнее, иначе не раздувает мелкие размеры.
 */
const getSpinnerSize = (size: IButtonSize): 'sm' | 'md' => {
	return size === 'lg' ? 'md' : 'sm'
}

const ButtonSpinner = ({
	size = 'md',
}: {
	size?: IButtonSize
}): ReactElement => {
	return (
		<span data-slot='button-spinner'>
			<Spinner size={getSpinnerSize(size)} />
		</span>
	)
}

ButtonSpinner.displayName = 'Button.Spinner'

const isNativeButtonRender = (render: IButtonProps['render']): boolean => {
	if (render == null) {
		return true
	}

	return isValidElement(render) && render.type === 'button'
}

const ButtonRoot = forwardRef<HTMLElement, IButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
			fullWidth = false,
			isDisabled = false,
			isPending = false,
			isIconOnly = false,
			className,
			children,
			type = 'button',
			onClick,
			render,
			...rest
		},
		ref,
	): ReactElement => {
		const isButtonDisabled = Boolean(isDisabled || isPending)
		const isNativeButton = isNativeButtonRender(render)

		const handleClick = useCallback(
			(event: MouseEvent<HTMLButtonElement>) => {
				if (isButtonDisabled) {
					event.preventDefault()
					return
				}

				onClick?.(event)
			},
			[isButtonDisabled, onClick],
		)

		return (
			<ButtonPrimitive
				{...rest}
				ref={ref}
				type={type}
				disabled={isButtonDisabled}
				nativeButton={isNativeButton}
				data-slot='button'
				data-variant={variant}
				data-size={size}
				data-pending={isPending ? '' : undefined}
				data-icon-only={isIconOnly ? '' : undefined}
				data-full-width={fullWidth ? '' : undefined}
				className={cn(className)}
				onClick={handleClick}
				render={render}
			>
				{isPending ? <ButtonSpinner size={size} /> : children}
			</ButtonPrimitive>
		)
	},
)

ButtonRoot.displayName = 'Button'

/**
 * Кнопка UI-кита: варианты, размеры, pending со спиннером вместо children.
 *
 * Вызывать для действий (submit, CTA). Для `isPending` клик блокируется.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleSave}>
 *   Сохранить
 * </Button>
 *
 * <Button isPending isDisabled={false}>
 *   Отправка
 * </Button>
 *
 * <Button variant="ghost" isIconOnly aria-label="Закрыть">
 *   ×
 * </Button>
 * ```
 */
export const Button = Object.assign(ButtonRoot, {
	Root: ButtonRoot,
	Spinner: ButtonSpinner,
})
