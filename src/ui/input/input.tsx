'use client'

import { cn } from '@/core/cn'
import {
	createCompoundContext,
	type ICompoundChildProps,
} from '@/core/create-compound-context'
import type { TSlotVariant } from '@/core/slot-variant'
import {
	forwardRef,
	type CSSProperties,
	type InputHTMLAttributes,
	type ReactElement,
	type ReactNode,
} from 'react'

export type IInputSize = 'xs' | 'sm' | 'md' | 'lg'

interface IInputContextValue {
	size: IInputSize
	invalid: boolean
	isDisabled: boolean
}

const { Context, useCompoundContext } =
	createCompoundContext<IInputContextValue>('Input')

export interface IInputRootProps extends ICompoundChildProps {
	size?: IInputSize
	invalid?: boolean
	isDisabled?: boolean
	className?: string
	style?: CSSProperties
	variant?: TSlotVariant
}

const InputRoot = ({
	children,
	size = 'md',
	invalid = false,
	isDisabled = false,
	className,
	style,
	variant = 'default',
}: IInputRootProps): ReactElement => {
	return (
		<Context.Provider value={{ size, invalid, isDisabled }}>
			<div
				data-slot='input'
				data-size={size}
				data-invalid={invalid ? '' : undefined}
				data-disabled={isDisabled ? '' : undefined}
				data-variant={variant}
				className={className}
				style={style}
			>
				{children}
			</div>
		</Context.Provider>
	)
}

InputRoot.displayName = 'Input.Root'

export interface IInputFieldProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size' | 'disabled'
> {
	size?: IInputSize
	invalid?: boolean
	isDisabled?: boolean
	variant?: TSlotVariant
}

const InputField = forwardRef<HTMLInputElement, IInputFieldProps>(
	(
		{
			size: _sizeProp,
			invalid: invalidProp,
			isDisabled: isDisabledProp,
			variant = 'default',
			className,
			...rest
		},
		ref,
	): ReactElement => {
		const context = useCompoundContext()
		const isInvalid = invalidProp ?? context.invalid
		const isFieldDisabled = isDisabledProp ?? context.isDisabled

		return (
			<input
				ref={ref}
				data-slot='input-field'
				data-variant={variant}
				disabled={isFieldDisabled}
				aria-invalid={isInvalid || undefined}
				className={cn(className)}
				{...rest}
			/>
		)
	},
)

InputField.displayName = 'Input.Field'

export interface IInputProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size' | 'disabled'
> {
	size?: IInputSize
	invalid?: boolean
	isDisabled?: boolean
	containerClassName?: string
	children?: ReactNode
	variant?: TSlotVariant
}

const InputCombined = forwardRef<HTMLInputElement, IInputProps>(
	(
		{
			size = 'md',
			invalid = false,
			isDisabled = false,
			className,
			containerClassName,
			children,
			variant = 'default',
			...rest
		},
		ref,
	): ReactElement => {
		return (
			<InputRoot
				size={size}
				invalid={invalid}
				isDisabled={isDisabled}
				className={containerClassName}
				variant={variant}
			>
				{children ?? (
					<InputField
						ref={ref}
						className={className}
						isDisabled={isDisabled}
						invalid={invalid}
						{...rest}
					/>
				)}
			</InputRoot>
		)
	},
)

InputCombined.displayName = 'Input'

/**
 * Однострочный инпут. Короткий путь — пропсы как у native input.
 * `Root` + `Field` — когда внутрь оболочки кладут иконку.
 *
 * @example
 * ```tsx
 * <Input
 *   size="md"
 *   placeholder="Email"
 *   value={email}
 *   onChange={(event) => setEmail(event.target.value)}
 * />
 *
 * <Input.Root>
 *   <SearchIcon />
 *   <Input.Field placeholder="Поиск" />
 * </Input.Root>
 * ```
 */
export const Input = Object.assign(InputCombined, {
	Root: InputRoot,
	Field: InputField,
})
