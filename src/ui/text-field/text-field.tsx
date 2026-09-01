'use client'

import { cn } from '@/core/cn'
import {
	createCompoundContext,
	type ICompoundChildProps,
} from '@/core/create-compound-context'
import type { TSlotVariant } from '@/core/slot-variant'
import {
	forwardRef,
	useContext,
	type LabelHTMLAttributes,
	type ReactElement,
	type ReactNode,
} from 'react'
import { Input, type IInputProps, type IInputSize } from '../input/input'

interface ITextFieldContextValue {
	required?: boolean
	invalid?: boolean
	errorMessage?: string
	inputId?: string
}

const { Context, useCompoundContext } =
	createCompoundContext<ITextFieldContextValue>('TextField')

/**
 * Контекст TextField, если слот внутри поля; иначе `null`.
 * Нужен InputGroup, чтобы подхватить id / invalid / aria ошибки без второго Root.
 */
export const useOptionalTextFieldContext = (): ITextFieldContextValue | null => {
	return useContext(Context)
}

export interface ITextFieldRootProps extends ICompoundChildProps {
	className?: string
	required?: boolean
	invalid?: boolean
	errorMessage?: string
	name?: string
	id?: string
	variant?: TSlotVariant
}

const TextFieldRoot = ({
	children,
	className,
	required,
	invalid,
	errorMessage,
	name,
	id,
	variant = 'default',
}: ITextFieldRootProps): ReactElement => {
	const inputId = id ?? name

	return (
		<Context.Provider
			value={{
				required,
				invalid,
				errorMessage,
				inputId,
			}}
		>
			<div
				data-slot='text-field'
				data-variant={variant}
				className={cn(className)}
			>
				{children}
			</div>
		</Context.Provider>
	)
}

TextFieldRoot.displayName = 'TextField'

export interface ITextFieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	children?: ReactNode
	variant?: TSlotVariant
}

/**
 * Лейбл поля. `htmlFor` берётся из `id`/`name` у `TextField`.
 *
 * @example
 * ```tsx
 * <TextField.Label>Фамилия</TextField.Label>
 * ```
 */
const TextFieldLabel = ({
	children,
	className,
	htmlFor,
	variant = 'default',
	...rest
}: ITextFieldLabelProps): ReactElement => {
	const { required, inputId } = useCompoundContext()

	return (
		<label
			htmlFor={htmlFor ?? inputId}
			data-slot='text-field-label'
			data-variant={variant}
			className={cn(className)}
			{...rest}
		>
			{children}
			{required ? (
				<span data-slot='text-field-required' aria-hidden='true'>
					*
				</span>
			) : null}
		</label>
	)
}

TextFieldLabel.displayName = 'TextField.Label'

export type ITextFieldSize = IInputSize

export interface ITextFieldInputProps extends IInputProps {
	errorMessage?: string
}

/**
 * Инпут внутри TextField. `invalid` и id наследуются из корня.
 *
 * @example
 * ```tsx
 * <TextField.Input value={lastName} onChange={handleChange} />
 * ```
 */
const TextFieldInput = forwardRef<HTMLInputElement, ITextFieldInputProps>(
	({ id, invalid: invalidProp, errorMessage: _errorMessage, ...rest }, ref) => {
		const context = useCompoundContext()
		const invalid = invalidProp ?? context.invalid
		const resolvedId = id ?? context.inputId ?? rest.name

		return (
			<Input
				ref={ref}
				id={resolvedId}
				invalid={invalid}
				aria-describedby={
					invalid && context.errorMessage ? `${resolvedId}-error` : undefined
				}
				{...rest}
			/>
		)
	},
)

TextFieldInput.displayName = 'TextField.Input'

export interface ITextFieldErrorProps extends ICompoundChildProps {
	className?: string
	variant?: TSlotVariant
}

/**
 * Текст ошибки. Рендерится только при `invalid` у корня.
 *
 * @example
 * ```tsx
 * <TextField.Error>Обязательное поле</TextField.Error>
 * ```
 */
const TextFieldError = ({
	children,
	className,
	variant = 'default',
}: ITextFieldErrorProps): ReactElement | null => {
	const { errorMessage, invalid, inputId } = useCompoundContext()

	if (!invalid) {
		return null
	}

	const message = children ?? errorMessage

	if (!message) {
		return null
	}

	return (
		<p
			id={inputId ? `${inputId}-error` : undefined}
			data-slot='text-field-error'
			data-variant={variant}
			className={cn(className)}
			role='alert'
		>
			{message}
		</p>
	)
}

TextFieldError.displayName = 'TextField.Error'

/**
 * Поле формы: лейбл, инпут, ошибка. `invalid` / `errorMessage` связывает a11y у Error.
 *
 * @example
 * ```tsx
 * <TextField invalid={Boolean(error)} errorMessage={error} id="lastName">
 *   <TextField.Label>Фамилия</TextField.Label>
 *   <TextField.Input value={lastName} onChange={handleChange} />
 *   <TextField.Error>{error}</TextField.Error>
 * </TextField>
 * ```
 */
export const TextField = Object.assign(TextFieldRoot, {
	Root: TextFieldRoot,
	Label: TextFieldLabel,
	Input: TextFieldInput,
	Error: TextFieldError,
})
