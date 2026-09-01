'use client'

import { cn } from '@/core/cn'
import { createCompoundContext } from '@/core/create-compound-context'
import type { TSlotVariant } from '@/core/slot-variant'
import {
	forwardRef,
	useCallback,
	useState,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactElement,
} from 'react'
import {
	Input,
	type IInputFieldProps,
	type IInputRootProps,
} from '../input/input'
import { useOptionalTextFieldContext } from '../text-field/text-field'

interface IInputGroupContextValue {
	isPasswordVisible: boolean
	isDisabled: boolean
	togglePasswordVisibility: () => void
}

const { Context, useCompoundContext } =
	createCompoundContext<IInputGroupContextValue>('InputGroup')

const EyeIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 24 24'
			width='20'
			height='20'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinejoin='round'
			/>
			<circle
				cx='12'
				cy='12'
				r='3'
				stroke='currentColor'
				strokeWidth='2'
			/>
		</svg>
	)
}

const EyeOffIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 24 24'
			width='20'
			height='20'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M3 3l18 18'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<path
				d='M9.9 5.2A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a16.6 16.6 0 0 1-3.2 3.8M6.1 6.1A16.7 16.7 0 0 0 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinejoin='round'
			/>
			<path
				d='M9.9 9.9a3 3 0 0 0 4.2 4.2'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
		</svg>
	)
}

export type IInputGroupRootProps = IInputRootProps

const InputGroupRoot = ({
	children,
	size = 'md',
	invalid: invalidProp,
	isDisabled = false,
	className,
	style,
	variant = 'default',
}: IInputGroupRootProps): ReactElement => {
	const textField = useOptionalTextFieldContext()

	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const isInvalid = invalidProp ?? textField?.invalid ?? false

	const togglePasswordVisibility = useCallback(() => {
		setIsPasswordVisible((current) => !current)
	}, [])

	return (
		<Context.Provider
			value={{
				isPasswordVisible,
				isDisabled,
				togglePasswordVisibility,
			}}
		>
			<Input.Root
				size={size}
				invalid={isInvalid}
				isDisabled={isDisabled}
				className={className}
				style={style}
				variant={variant}
			>
				{children}
			</Input.Root>
		</Context.Provider>
	)
}

InputGroupRoot.displayName = 'InputGroup'

export type IInputGroupInputProps = IInputFieldProps

/**
 * Поле группы. Рендерит `Input.Field` внутри оболочки `Input.Root`.
 * `type="password"` переключается в `text`, если нажат PasswordToggle.
 */
const InputGroupInput = forwardRef<HTMLInputElement, IInputGroupInputProps>(
	(
		{
			id,
			invalid: invalidProp,
			type,
			...rest
		},
		ref,
	): ReactElement => {
		const group = useCompoundContext()
		const textField = useOptionalTextFieldContext()

		const isInvalid = invalidProp ?? textField?.invalid
		const resolvedId = id ?? textField?.inputId ?? rest.name
		const resolvedType =
			type === 'password' && group.isPasswordVisible ? 'text' : type

		return (
			<Input.Field
				ref={ref}
				{...rest}
				id={resolvedId}
				invalid={isInvalid}
				type={resolvedType}
				aria-describedby={
					isInvalid && textField?.errorMessage
						? `${resolvedId}-error`
						: undefined
				}
			/>
		)
	},
)

InputGroupInput.displayName = 'InputGroup.Input'

export interface IInputGroupAddonProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: TSlotVariant
}

const InputGroupPrefix = ({
	children,
	className,
	variant = 'default',
	...rest
}: IInputGroupAddonProps): ReactElement => {
	useCompoundContext()

	return (
		<span
			data-slot='input-group-prefix'
			data-variant={variant}
			className={cn(className)}
			{...rest}
		>
			{children}
		</span>
	)
}

InputGroupPrefix.displayName = 'InputGroup.Prefix'

const InputGroupSuffix = ({
	children,
	className,
	variant = 'default',
	...rest
}: IInputGroupAddonProps): ReactElement => {
	useCompoundContext()

	return (
		<span
			data-slot='input-group-suffix'
			data-variant={variant}
			className={cn(className)}
			{...rest}
		>
			{children}
		</span>
	)
}

InputGroupSuffix.displayName = 'InputGroup.Suffix'

export interface IInputGroupPasswordToggleProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'type' | 'children'
> {
	showPasswordLabel: string
	hidePasswordLabel: string
	variant?: TSlotVariant
}

/**
 * Кнопка показа/скрытия пароля. Ставится в `InputGroup.Suffix`.
 */
const InputGroupPasswordToggle = ({
	showPasswordLabel,
	hidePasswordLabel,
	className,
	variant = 'default',
	onClick,
	...rest
}: IInputGroupPasswordToggleProps): ReactElement => {
	const { isPasswordVisible, isDisabled, togglePasswordVisibility } =
		useCompoundContext()

	return (
		<button
			{...rest}
			type='button'
			data-slot='input-group-password-toggle'
			data-variant={variant}
			className={cn(className)}
			aria-label={isPasswordVisible ? hidePasswordLabel : showPasswordLabel}
			aria-pressed={isPasswordVisible}
			disabled={isDisabled}
			onClick={(event) => {
				togglePasswordVisibility()
				onClick?.(event)
			}}
		>
			{isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
		</button>
	)
}

InputGroupPasswordToggle.displayName = 'InputGroup.PasswordToggle'

/**
 * Поле на всю ширину оболочки, prefix/suffix — поверх.
 * Отступ текста задаёт `--input-addon-inline` (ширина иконок + зазор).
 * Несколько иконок: `style={{ '--input-addon-inline': '56px' }}`.
 *
 * @example
 * ```tsx
 * <InputGroup>
 *   <InputGroup.Input className="w-full max-w-[280px]" />
 *   <InputGroup.Suffix>
 *     <Spinner size="sm" />
 *   </InputGroup.Suffix>
 * </InputGroup>
 *
 * <InputGroup>
 *   <InputGroup.Input type="password" autoComplete="current-password" />
 *   <InputGroup.Suffix>
 *     <InputGroup.PasswordToggle
 *       showPasswordLabel="Показать пароль"
 *       hidePasswordLabel="Скрыть пароль"
 *     />
 *   </InputGroup.Suffix>
 * </InputGroup>
 * ```
 */
export const InputGroup = Object.assign(InputGroupRoot, {
	Root: InputGroupRoot,
	Input: InputGroupInput,
	Prefix: InputGroupPrefix,
	Suffix: InputGroupSuffix,
	PasswordToggle: InputGroupPasswordToggle,
})
