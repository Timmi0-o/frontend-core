import type { Button as ButtonPrimitive } from '@base-ui/react/button'
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'

export type IButtonVariant =
	| 'primary'
	| 'secondary'
	| 'tertiary'
	| 'outline'
	| 'ghost'
	| 'light'
	| 'danger'
	| 'soft-danger'
	/** Без chrome кита: внешний вид задаёт className потребителя (хедер, иконки). */
	| 'unstyled'

export type IButtonSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg'

export interface IButtonProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'disabled' | 'className'
> {
	variant?: IButtonVariant
	size?: IButtonSize
	fullWidth?: boolean
	isDisabled?: boolean
	isPending?: boolean
	isIconOnly?: boolean
	className?: string
	children?: ReactNode
	render?: ButtonPrimitive.Props['render']
}

export type IButtonClickHandler = (event: MouseEvent<HTMLButtonElement>) => void
