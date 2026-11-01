'use client'

import { OTPInput, OTPInputContext } from 'input-otp'
import {
	forwardRef,
	useContext,
	type HTMLAttributes,
	type InputHTMLAttributes,
	type ReactElement,
	type ReactNode,
} from 'react'

import { cn } from '@/core/cn'
import { createCompoundContext } from '@/core/create-compound-context'
import type { TSlotVariant } from '@/core/slot-variant'
import type { IInputSize } from '@/ui/input/input'

interface IInputOTPContextValue {
	size: IInputSize
	isDisabled: boolean
	isInvalid: boolean
}

const { Context, useCompoundContext } =
	createCompoundContext<IInputOTPContextValue>('InputOTP')

export interface IInputOTPRootProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size' | 'disabled' | 'value' | 'onChange' | 'children'
> {
	value?: string
	defaultValue?: string
	onChange?: (newValue: string) => void
	onComplete?: (value: string) => void
	maxLength: number
	pattern?: string
	textAlign?: 'left' | 'center' | 'right'
	pasteTransformer?: (pasted: string) => string
	pushPasswordManagerStrategy?: 'increase-width' | 'none'
	inputClassName?: string
	className?: string
	isDisabled?: boolean
	isInvalid?: boolean
	size?: IInputSize
	variant?: TSlotVariant
	children: ReactNode
}

const InputOTPRoot = forwardRef<HTMLInputElement, IInputOTPRootProps>(
	(
		{
			className,
			inputClassName,
			isDisabled = false,
			isInvalid = false,
			size = 'md',
			variant = 'default',
			children,
			...rest
		},
		ref,
	): ReactElement => {
		return (
			<Context.Provider value={{ size, isDisabled, isInvalid }}>
				<div
					data-slot='input-otp'
					data-size={size}
					data-variant={variant}
					data-disabled={isDisabled ? '' : undefined}
					data-invalid={isInvalid ? '' : undefined}
					className={cn(className)}
				>
					<OTPInput
						{...rest}
						ref={ref}
						className={inputClassName}
						disabled={isDisabled}
						aria-invalid={isInvalid || undefined}
					>
						{children}
					</OTPInput>
				</div>
			</Context.Provider>
		)
	},
)

InputOTPRoot.displayName = 'InputOTP'

export interface IInputOTPGroupProps extends HTMLAttributes<HTMLDivElement> {}

const InputOTPGroup = ({
	className,
	...props
}: IInputOTPGroupProps): ReactElement => {
	return (
		<div
			aria-hidden
			data-slot='input-otp-group'
			className={cn(className)}
			{...props}
		/>
	)
}

InputOTPGroup.displayName = 'InputOTP.Group'

export interface IInputOTPSlotProps extends HTMLAttributes<HTMLDivElement> {
	index: number
}

const InputOTPSlot = ({
	index,
	className,
	...props
}: IInputOTPSlotProps): ReactElement => {
	const { isDisabled, isInvalid } = useCompoundContext()
	const otp = useContext(OTPInputContext)
	const slot = otp.slots?.[index]
	const char = slot?.char
	const isFilled = char != null && char.length > 0
	const isActive = slot?.isActive === true

	return (
		<div
			{...props}
			data-slot='input-otp-slot'
			data-active={isActive ? '' : undefined}
			data-disabled={isDisabled ? '' : undefined}
			data-filled={isFilled ? '' : undefined}
			data-invalid={isInvalid ? '' : undefined}
			className={cn(className)}
		>
			{isFilled ? (
				<div data-slot='input-otp-slot-value'>{char}</div>
			) : null}
			{slot?.hasFakeCaret === true && isActive ? (
				<div data-slot='input-otp-caret' />
			) : null}
		</div>
	)
}

InputOTPSlot.displayName = 'InputOTP.Slot'

export interface IInputOTPSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

const InputOTPSeparator = ({
	className,
	...props
}: IInputOTPSeparatorProps): ReactElement => {
	return (
		<div
			aria-hidden
			data-slot='input-otp-separator'
			className={cn(className)}
			{...props}
		/>
	)
}

InputOTPSeparator.displayName = 'InputOTP.Separator'

/**
 * Поле из отдельных ячеек для кода или фиксированного набора символов.
 * Скрытый input принимает ввод, вставку и фокус. `Group` / `Slot` / `Separator`
 * только рисуют значение. `index` у слота — позиция символа с нуля.
 *
 * @example
 * ```tsx
 * <InputOTP maxLength={6} value={code} onChange={setCode}>
 *   <InputOTP.Group>
 *     <InputOTP.Slot index={0} />
 *     <InputOTP.Slot index={1} />
 *     <InputOTP.Slot index={2} />
 *   </InputOTP.Group>
 *   <InputOTP.Separator />
 *   <InputOTP.Group>
 *     <InputOTP.Slot index={3} />
 *     <InputOTP.Slot index={4} />
 *     <InputOTP.Slot index={5} />
 *   </InputOTP.Group>
 * </InputOTP>
 * ```
 */
export const InputOTP = Object.assign(InputOTPRoot, {
	Group: InputOTPGroup,
	Slot: InputOTPSlot,
	Separator: InputOTPSeparator,
})

export {
	REGEXP_ONLY_CHARS,
	REGEXP_ONLY_DIGITS,
	REGEXP_ONLY_DIGITS_AND_CHARS,
} from 'input-otp'
