'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { cn } from '@/core/cn'
import {
	createCompoundContext,
	type ICompoundChildProps,
} from '@/core/create-compound-context'
import type { TSlotVariant } from '@/core/slot-variant'
import {
	type FocusEventHandler,
	type ReactElement,
	type ReactNode,
} from 'react'
import { type CheckboxTextColor } from './data/checkbox-text-color'

export type TCheckboxSize = 'sm' | 'md'
export type TCheckboxVariant = 'checkbox' | 'radio' | 'unstyled'
type TCheckboxAppearance = Exclude<TCheckboxVariant, 'unstyled'>

interface ICheckboxContextValue {
	size: TCheckboxSize
	variant: TCheckboxAppearance
	textColor?: CheckboxTextColor
	checked?: boolean
	isDisabled: boolean
	readOnly?: boolean
	name?: string
	onBlur?: FocusEventHandler<HTMLElement>
	onCheckedChange: (isChecked: boolean) => void
}

const { Context, useCompoundContext } =
	createCompoundContext<ICheckboxContextValue>('Checkbox')

export interface ICheckboxRootProps extends ICompoundChildProps {
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (isChecked: boolean) => void
	onBlur?: FocusEventHandler<HTMLElement>
	isDisabled?: boolean
	name?: string
	readOnly?: boolean
	size?: TCheckboxSize
	variant?: TCheckboxVariant
	textColor?: CheckboxTextColor
	className?: string
	label?: string
}

/**
 * Заглушка для Control, когда чекбокс только отображает состояние (readonly в списке).
 */
const noopCheckedChange = (): void => undefined

const CheckboxRoot = ({
	children,
	checked,
	defaultChecked,
	onCheckedChange,
	onBlur,
	isDisabled,
	name,
	readOnly,
	size = 'md',
	variant = 'checkbox',
	textColor,
	className,
	label,
}: ICheckboxRootProps): ReactElement => {
	const appearance: TCheckboxAppearance =
		variant === 'radio' ? 'radio' : 'checkbox'

	return (
		<Context.Provider
			value={{
				size,
				variant: appearance,
				textColor,
				checked,
				isDisabled: isDisabled === true,
				readOnly,
				name,
				onBlur,
				onCheckedChange: onCheckedChange ?? noopCheckedChange,
			}}
		>
			<label
				data-slot='checkbox'
				data-variant={variant}
				data-size={size}
				data-disabled={isDisabled ? '' : undefined}
				className={className}
			>
				{children ?? (
					<>
						<CheckboxControl defaultChecked={defaultChecked} />
						{label ? <CheckboxLabel>{label}</CheckboxLabel> : null}
					</>
				)}
			</label>
		</Context.Provider>
	)
}

CheckboxRoot.displayName = 'Checkbox'

export interface ICheckboxControlProps {
	className?: string
	defaultChecked?: boolean
	variant?: TSlotVariant
}

/**
 * Галочка в квадрате: SVG, чтобы не плясать с border-trick и центрированием.
 */
const CheckboxCheckIcon = (): ReactElement => {
	return (
		<svg viewBox='0 0 16 16' fill='none' aria-hidden='true'>
			<path
				d='M3.2 8.2 6.6 11.2 12.8 4.6'
				stroke='currentColor'
				strokeWidth='2.2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

/**
 * Точка радио: отдельный SVG, чтобы не путать с квадратным чекбоксом.
 */
const CheckboxRadioDot = (): ReactElement => {
	return (
		<svg viewBox='0 0 16 16' aria-hidden='true'>
			<circle cx='8' cy='8' r='4.25' fill='currentColor' />
		</svg>
	)
}

const CheckboxControl = ({
	className,
	defaultChecked,
	variant: variantProp,
}: ICheckboxControlProps): ReactElement => {
	const {
		checked,
		isDisabled,
		readOnly,
		name,
		variant: contextAppearance,
		onBlur,
		onCheckedChange,
	} = useCompoundContext()

	return (
		<CheckboxPrimitive.Root
			checked={checked}
			defaultChecked={defaultChecked}
			disabled={isDisabled}
			readOnly={readOnly}
			name={name}
			onBlur={onBlur}
			onCheckedChange={onCheckedChange}
			data-slot='checkbox-control'
			data-variant={variantProp === 'unstyled' ? 'unstyled' : contextAppearance}
			className={className}
		>
			<CheckboxPrimitive.Indicator data-slot='checkbox-indicator'>
				{contextAppearance === 'radio' ? (
					<CheckboxRadioDot />
				) : (
					<CheckboxCheckIcon />
				)}
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

CheckboxControl.displayName = 'Checkbox.Control'

export interface ICheckboxLabelProps extends ICompoundChildProps {
	className?: string
	variant?: TSlotVariant
}

const CheckboxLabel = ({
	children,
	className,
	variant = 'default',
}: ICheckboxLabelProps): ReactElement => {
	const { textColor } = useCompoundContext()

	return (
		<span
			data-slot='checkbox-label'
			data-variant={variant}
			data-text-color={textColor}
			className={cn(className)}
		>
			{children}
		</span>
	)
}

CheckboxLabel.displayName = 'Checkbox.Label'

export interface ICheckboxProps {
	label?: string
	variant?: TCheckboxVariant
	size?: TCheckboxSize
	textColor?: CheckboxTextColor
	containerClassName?: string
	boxClassName?: string
	labelClassName?: string
	checked?: boolean
	defaultChecked?: boolean
	isDisabled?: boolean
	name?: string
	readOnly?: boolean
	onBlur?: FocusEventHandler<HTMLElement>
	onCheckedChange?: (isChecked: boolean) => void
	children?: ReactNode
}

const CheckboxCombined = ({
	label,
	variant = 'checkbox',
	size = 'md',
	textColor,
	containerClassName,
	boxClassName,
	labelClassName,
	checked,
	defaultChecked,
	isDisabled,
	name,
	readOnly,
	onBlur,
	onCheckedChange,
	children,
}: ICheckboxProps): ReactElement => {
	return (
		<CheckboxRoot
			label={label}
			variant={variant}
			size={size}
			textColor={textColor}
			className={containerClassName}
			checked={checked}
			defaultChecked={defaultChecked}
			isDisabled={isDisabled}
			name={name}
			readOnly={readOnly}
			onBlur={onBlur}
			onCheckedChange={onCheckedChange}
		>
			{children ?? (
				<>
					<CheckboxControl
						className={boxClassName}
						defaultChecked={defaultChecked}
					/>
					{label ? (
						<CheckboxLabel className={labelClassName}>{label}</CheckboxLabel>
					) : null}
				</>
			)}
		</CheckboxRoot>
	)
}

/**
 * Чекбокс. Короткий путь: `label` + `checked` / `onCheckedChange`.
 * Слоты `Root` / `Control` / `Label` — когда нужна своя вёрстка.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Нужно питание"
 *   checked={hasMeal}
 *   onCheckedChange={setHasMeal}
 * />
 *
 * <Checkbox.Root checked={hasMeal} onCheckedChange={setHasMeal}>
 *   <Checkbox.Control />
 *   <Checkbox.Label>Нужно питание</Checkbox.Label>
 * </Checkbox.Root>
 * ```
 */
export const Checkbox = Object.assign(CheckboxCombined, {
	Root: CheckboxRoot,
	Control: CheckboxControl,
	Label: CheckboxLabel,
})
