'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from '@/core/cn'
import {
	createCompoundContext,
	type ICompoundChildProps,
} from '@/core/create-compound-context'
import type { TSlotVariant } from '@/core/slot-variant'
import {
	createContext,
	useContext,
	useId,
	type ReactElement,
	type ReactNode,
} from 'react'

export type TSwitchLabelPosition = 'start' | 'end'

interface ISwitchContextValue {
	isDisabled: boolean
}

interface ISwitchFieldContextValue {
	switchId: string
	isDisabled: boolean
}

const { Context, useCompoundContext } =
	createCompoundContext<ISwitchContextValue>('Switch')

const SwitchFieldContext = createContext<ISwitchFieldContextValue | null>(
	null,
)

export interface ISwitchFieldProps extends ICompoundChildProps {
	isDisabled?: boolean
	labelPosition?: TSwitchLabelPosition
	className?: string
	variant?: TSlotVariant
}

/**
 * Ряд тумблера с подписью. Клик по тексту переключает Switch через htmlFor,
 * без двойного срабатывания (кнопку нельзя класть внутрь <label>).
 */
const SwitchField = ({
	children,
	isDisabled = false,
	labelPosition = 'end',
	className,
	variant = 'default',
}: ISwitchFieldProps): ReactElement => {
	const switchId = useId()

	return (
		<SwitchFieldContext.Provider value={{ switchId, isDisabled }}>
			<div
				data-slot='switch-field'
				data-variant={variant}
				data-disabled={isDisabled ? '' : undefined}
				data-label-position={labelPosition}
				className={cn(className)}
			>
				{children}
			</div>
		</SwitchFieldContext.Provider>
	)
}

SwitchField.displayName = 'Switch.Field'

export interface ISwitchRootProps extends ICompoundChildProps {
	isChecked: boolean
	onCheckedChange: (isChecked: boolean) => void
	ariaLabel?: string
	isDisabled?: boolean
	className?: string
	variant?: TSlotVariant
}

const SwitchRoot = ({
	children,
	isChecked,
	onCheckedChange,
	ariaLabel,
	isDisabled = false,
	className,
	variant = 'default',
}: ISwitchRootProps): ReactElement => {
	const field = useContext(SwitchFieldContext)
	const resolvedDisabled = field?.isDisabled ?? isDisabled

	return (
		<Context.Provider value={{ isDisabled: resolvedDisabled }}>
			<SwitchPrimitive.Root
				id={field?.switchId}
				checked={isChecked}
				onCheckedChange={onCheckedChange}
				disabled={resolvedDisabled}
				aria-label={ariaLabel}
				data-slot='switch'
				data-variant={variant}
				className={cn(className)}
			>
				{children ?? <SwitchThumb />}
			</SwitchPrimitive.Root>
		</Context.Provider>
	)
}

SwitchRoot.displayName = 'Switch'

export interface ISwitchThumbProps {
	className?: string
	variant?: TSlotVariant
}

const SwitchThumb = ({
	className,
	variant = 'default',
}: ISwitchThumbProps): ReactElement => {
	useCompoundContext()

	return (
		<SwitchPrimitive.Thumb
			data-slot='switch-thumb'
			data-variant={variant}
			className={cn(className)}
		/>
	)
}

SwitchThumb.displayName = 'Switch.Thumb'

export interface ISwitchLabelProps extends ICompoundChildProps {
	className?: string
	variant?: TSlotVariant
}

/**
 * Видимая подпись Switch. Класть внутрь Field: клик по тексту
 * переключает тот же тумблер.
 */
const SwitchLabel = ({
	children,
	className,
	variant = 'default',
}: ISwitchLabelProps): ReactElement => {
	const field = useContext(SwitchFieldContext)

	if (field === null) {
		throw new Error('Switch.Label must be used within Switch.Field')
	}

	return (
		<label
			htmlFor={field.switchId}
			data-slot='switch-label'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</label>
	)
}

SwitchLabel.displayName = 'Switch.Label'

export interface ISwitchDescriptionProps extends ICompoundChildProps {
	className?: string
	variant?: TSlotVariant
}

/**
 * Пояснение под подписью. Класть внутрь Switch.Label, когда одной строки мало.
 */
const SwitchDescription = ({
	children,
	className,
	variant = 'default',
}: ISwitchDescriptionProps): ReactElement => {
	return (
		<span
			data-slot='switch-description'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</span>
	)
}

SwitchDescription.displayName = 'Switch.Description'

interface ISwitchBaseProps {
	isChecked: boolean
	onCheckedChange: (isChecked: boolean) => void
	isDisabled?: boolean
	className?: string
	children?: ReactNode
	labelPosition?: TSwitchLabelPosition
	variant?: TSlotVariant
}

export type ISwitchProps =
	| (ISwitchBaseProps & { label: string; ariaLabel?: string })
	| (ISwitchBaseProps & { label?: undefined; ariaLabel: string })

const SwitchCombined = ({
	children,
	label,
	labelPosition = 'end',
	ariaLabel,
	isDisabled,
	...rest
}: ISwitchProps): ReactElement => {
	const control = (
		<SwitchRoot
			{...rest}
			isDisabled={isDisabled}
			ariaLabel={label ? undefined : ariaLabel}
		>
			{children}
		</SwitchRoot>
	)

	if (!label) {
		return control
	}

	return (
		<SwitchField isDisabled={isDisabled} labelPosition={labelPosition}>
			{control}
			<SwitchLabel>{label}</SwitchLabel>
		</SwitchField>
	)
}

/**
 * Тумблер. Нужен либо `label`, либо `ariaLabel`. Слоты — для описания и своей вёрстки.
 *
 * @example
 * ```tsx
 * <Switch
 *   label="Уведомления"
 *   isChecked={isEnabled}
 *   onCheckedChange={setIsEnabled}
 * />
 *
 * <Switch ariaLabel="Включить фильтр" isChecked={isOn} onCheckedChange={setIsOn} />
 * ```
 */
export const Switch = Object.assign(SwitchCombined, {
	Field: SwitchField,
	Root: SwitchRoot,
	Thumb: SwitchThumb,
	Label: SwitchLabel,
	Description: SwitchDescription,
})
