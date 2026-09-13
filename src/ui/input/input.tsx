'use client'

import { cn } from '@/core/cn'
import {
	createCompoundContext,
	type ICompoundChildProps,
} from '@/core/create-compound-context'
import type { TSlotVariant } from '@/core/slot-variant'
import {
	forwardRef,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type ChangeEvent,
	type InputHTMLAttributes,
	type ReactElement,
	type ReactNode,
} from 'react'

export type IInputSize = 'xs' | 'sm' | 'md' | 'lg'
export type TInputVariant = TSlotVariant | 'light'

interface IInputContextValue {
	size: IInputSize
	invalid: boolean
	isDisabled: boolean
	isClearable: boolean
	hasValue: boolean
	setHasValue: (hasValue: boolean) => void
	clear: () => void
}

const { Context, useCompoundContext } =
	createCompoundContext<IInputContextValue>('Input')

const ClearIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 16 16'
			width='16'
			height='16'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M4 4l8 8M12 4l-8 8'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
		</svg>
	)
}

const clearNativeInputValue = (input: HTMLInputElement): void => {
	const valueSetter = Object.getOwnPropertyDescriptor(
		HTMLInputElement.prototype,
		'value',
	)?.set

	valueSetter?.call(input, '')
	input.dispatchEvent(new Event('input', { bubbles: true }))
}

export interface IInputRootProps extends ICompoundChildProps {
	size?: IInputSize
	invalid?: boolean
	isDisabled?: boolean
	isClearable?: boolean
	onClear?: () => void
	className?: string
	style?: CSSProperties
	variant?: TInputVariant
}

const InputClearButton = (): ReactElement | null => {
	const { isClearable, hasValue, isDisabled, clear } = useCompoundContext()

	if (!isClearable || !hasValue || isDisabled) {
		return null
	}

	return (
		<button
			type='button'
			data-slot='input-clear'
			aria-label='Очистить'
			onMouseDown={(event) => {
				event.preventDefault()
			}}
			onClick={clear}
		>
			<ClearIcon />
		</button>
	)
}

InputClearButton.displayName = 'Input.Clear'

const InputRoot = ({
	children,
	size = 'md',
	invalid = false,
	isDisabled = false,
	isClearable = false,
	onClear,
	className,
	style,
	variant = 'default',
}: IInputRootProps): ReactElement => {
	const rootRef = useRef<HTMLDivElement>(null)
	const [hasValue, setHasValue] = useState(false)

	const clear = useCallback(() => {
		if (isDisabled) {
			return
		}

		const field = rootRef.current?.querySelector<HTMLInputElement>(
			'[data-slot="input-field"]',
		)

		if (!field) {
			return
		}

		clearNativeInputValue(field)
		setHasValue(false)
		field.focus()
		onClear?.()
	}, [isDisabled, onClear])

	return (
		<Context.Provider
			value={{
				size,
				invalid,
				isDisabled,
				isClearable,
				hasValue,
				setHasValue,
				clear,
			}}
		>
			<div
				ref={rootRef}
				data-slot='input'
				data-size={size}
				data-invalid={invalid ? '' : undefined}
				data-disabled={isDisabled ? '' : undefined}
				data-variant={variant}
				className={className}
				style={style}
			>
				{children}
				<InputClearButton />
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
	variant?: TInputVariant
}

const InputField = forwardRef<HTMLInputElement, IInputFieldProps>(
	(
		{
			size: _sizeProp,
			invalid: invalidProp,
			isDisabled: isDisabledProp,
			variant = 'default',
			className,
			onChange,
			value,
			defaultValue,
			...rest
		},
		ref,
	): ReactElement => {
		const context = useCompoundContext()
		const { isClearable, setHasValue } = context
		const isInvalid = invalidProp ?? context.invalid
		const isFieldDisabled = isDisabledProp ?? context.isDisabled
		const isControlled = value !== undefined

		useLayoutEffect(() => {
			if (!isClearable) {
				return
			}

			const nextValue = isControlled ? value : defaultValue
			setHasValue(String(nextValue ?? '').length > 0)
		}, [defaultValue, isClearable, isControlled, setHasValue, value])

		const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
			setHasValue(event.target.value.length > 0)
			onChange?.(event)
		}

		return (
			<input
				{...rest}
				ref={ref}
				data-slot='input-field'
				data-variant={variant}
				disabled={isFieldDisabled}
				aria-invalid={isInvalid || undefined}
				className={cn(className)}
				value={value}
				defaultValue={defaultValue}
				onChange={handleChange}
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
	isClearable?: boolean
	onClear?: () => void
	containerClassName?: string
	children?: ReactNode
	variant?: TInputVariant
}

const InputCombined = forwardRef<HTMLInputElement, IInputProps>(
	(
		{
			size = 'md',
			invalid = false,
			isDisabled = false,
			isClearable = false,
			onClear,
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
				isClearable={isClearable}
				onClear={onClear}
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
 * `isClearable` — крестик справа, сбрасывает значение через native `input`.
 * `onClear` — доп. действие после сброса (например, убрать query из URL).
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
 * <Input
 *   isClearable
 *   value={query}
 *   onChange={(event) => setQuery(event.target.value)}
 *   onClear={() => setQuery('')}
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
