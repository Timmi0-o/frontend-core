'use client'

import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { cn } from '@/core/cn'
import {
	createCompoundContext,
	type ICompoundChildProps,
} from '@/core/create-compound-context'
import type { WithUnstyledVariant } from '@/core/slot-variant'
import { type ReactElement, type ReactNode } from 'react'
import { getSliderThumbCount } from './helpers/get-slider-thumb-count'
import { renderSliderOutput } from './helpers/render-slider-output'
import {
	resolveSliderRangeInteraction,
	type TSliderThumbCollisionBehavior,
} from './helpers/resolve-slider-range-interaction'

export type { TSliderThumbCollisionBehavior }

export type TSliderSize = 'sm' | 'md' | 'lg'
export type TSliderTone = 'default' | 'danger' | 'soft-danger'
export type TSliderVariant = WithUnstyledVariant<'default' | 'plain'>
export type TSliderOrientation = 'horizontal' | 'vertical'
export type TSliderValue = number | readonly number[]
export type TSliderHintSide = 'min' | 'max'

export type TSliderFormatValue = (value: number, index: number) => string

interface ISliderContextValue {
	formatValue?: TSliderFormatValue
	size: TSliderSize
	variant: TSliderVariant
	tone: TSliderTone
}

const { Context, useCompoundContext } =
	createCompoundContext<ISliderContextValue>('Slider')

export interface ISliderRootProps {
	value?: TSliderValue
	defaultValue?: TSliderValue
	onValueChange?: (value: TSliderValue) => void
	onValueCommitted?: (value: TSliderValue) => void
	min?: number
	max?: number
	step?: number
	largeStep?: number
	minStepsBetweenValues?: number
	thumbCollisionBehavior?: TSliderThumbCollisionBehavior
	orientation?: TSliderOrientation
	isDisabled?: boolean
	name?: string
	form?: string
	format?: Intl.NumberFormatOptions
	locale?: Intl.LocalesArgument
	formatValue?: TSliderFormatValue
	size?: TSliderSize
	variant?: TSliderVariant
	tone?: TSliderTone
	className?: string
	children?: ReactNode
}

const SliderRoot = ({
	value,
	defaultValue,
	onValueChange,
	onValueCommitted,
	min,
	max,
	step,
	largeStep,
	minStepsBetweenValues,
	thumbCollisionBehavior,
	orientation = 'horizontal',
	isDisabled = false,
	name,
	form,
	format,
	locale,
	formatValue,
	size = 'md',
	variant = 'default',
	tone = 'default',
	className,
	children,
}: ISliderRootProps): ReactElement => {
	const rangeInteraction = resolveSliderRangeInteraction(
		value,
		defaultValue,
		thumbCollisionBehavior,
		minStepsBetweenValues,
	)

	return (
		<Context.Provider value={{ formatValue, size, variant, tone }}>
			<SliderPrimitive.Root
				value={value}
				defaultValue={defaultValue}
				onValueChange={(next) => {
					onValueChange?.(next)
				}}
				onValueCommitted={(next) => {
					onValueCommitted?.(next)
				}}
				min={min}
				max={max}
				step={step}
				largeStep={largeStep}
				minStepsBetweenValues={rangeInteraction.minStepsBetweenValues}
				thumbCollisionBehavior={rangeInteraction.thumbCollisionBehavior}
				orientation={orientation}
				disabled={isDisabled}
				name={name}
				form={form}
				format={format}
				locale={locale}
				thumbAlignment='center'
				data-slot='slider'
				data-variant={variant}
				data-tone={tone}
				data-size={size}
				className={cn(className)}
			>
				{children}
			</SliderPrimitive.Root>
		</Context.Provider>
	)
}

SliderRoot.displayName = 'Slider'

export interface ISliderHeaderProps extends ICompoundChildProps {
	className?: string
	variant?: TSliderVariant
}

const SliderHeader = ({
	children,
	className,
	variant: variantProp,
}: ISliderHeaderProps): ReactElement => {
	const { variant: contextVariant } = useCompoundContext()
	const variant = variantProp ?? contextVariant

	return (
		<div
			data-slot='slider-header'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</div>
	)
}

SliderHeader.displayName = 'Slider.Header'

export interface ISliderLabelProps extends ICompoundChildProps {
	className?: string
	variant?: TSliderVariant
}

const SliderLabel = ({
	children,
	className,
	variant: variantProp,
}: ISliderLabelProps): ReactElement => {
	const { variant: contextVariant } = useCompoundContext()
	const variant = variantProp ?? contextVariant

	return (
		<SliderPrimitive.Label
			data-slot='slider-label'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</SliderPrimitive.Label>
	)
}

SliderLabel.displayName = 'Slider.Label'

export interface ISliderValueProps {
	className?: string
	variant?: TSliderVariant
}

const SliderValue = ({
	className,
	variant: variantProp,
}: ISliderValueProps): ReactElement => {
	const { formatValue, variant: contextVariant } = useCompoundContext()
	const variant = variantProp ?? contextVariant

	return (
		<SliderPrimitive.Value
			data-slot='slider-value'
			data-variant={variant}
			className={cn(className)}
		>
			{(formattedValues, values) =>
				renderSliderOutput(formatValue, formattedValues, values)
			}
		</SliderPrimitive.Value>
	)
}

SliderValue.displayName = 'Slider.Value'

export interface ISliderControlProps extends ICompoundChildProps {
	className?: string
	variant?: TSliderVariant
}

const SliderControl = ({
	children,
	className,
	variant: variantProp,
}: ISliderControlProps): ReactElement => {
	const { variant: contextVariant } = useCompoundContext()
	const variant = variantProp ?? contextVariant

	return (
		<SliderPrimitive.Control
			data-slot='slider-control'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</SliderPrimitive.Control>
	)
}

SliderControl.displayName = 'Slider.Control'

export interface ISliderTrackProps extends ICompoundChildProps {
	className?: string
	variant?: TSliderVariant
}

const SliderTrack = ({
	children,
	className,
	variant: variantProp,
}: ISliderTrackProps): ReactElement => {
	const { variant: contextVariant } = useCompoundContext()
	const variant = variantProp ?? contextVariant

	return (
		<SliderPrimitive.Track
			data-slot='slider-track'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</SliderPrimitive.Track>
	)
}

SliderTrack.displayName = 'Slider.Track'

export interface ISliderIndicatorProps {
	className?: string
	variant?: TSliderVariant
}

const SliderIndicator = ({
	className,
	variant: variantProp,
}: ISliderIndicatorProps): ReactElement => {
	const { variant: contextVariant } = useCompoundContext()
	const variant = variantProp ?? contextVariant

	return (
		<SliderPrimitive.Indicator
			data-slot='slider-indicator'
			data-variant={variant}
			className={cn(className)}
		/>
	)
}

SliderIndicator.displayName = 'Slider.Indicator'

export interface ISliderThumbProps {
	index?: number
	className?: string
	variant?: TSliderVariant
	getAriaLabel?: (index: number) => string
	getAriaValueText?: (
		formattedValue: string,
		value: number,
		index: number,
	) => string
}

const SliderThumb = ({
	index,
	className,
	variant: variantProp,
	getAriaLabel,
	getAriaValueText,
}: ISliderThumbProps): ReactElement => {
	const { variant: contextVariant } = useCompoundContext()
	const variant = variantProp ?? contextVariant

	return (
		<SliderPrimitive.Thumb
			index={index}
			getAriaLabel={getAriaLabel}
			getAriaValueText={getAriaValueText}
			data-slot='slider-thumb'
			data-variant={variant}
			className={cn(className)}
		/>
	)
}

SliderThumb.displayName = 'Slider.Thumb'

export interface ISliderHintsProps extends ICompoundChildProps {
	className?: string
	variant?: TSliderVariant
}

const SliderHints = ({
	children,
	className,
	variant: variantProp,
}: ISliderHintsProps): ReactElement => {
	const { variant: contextVariant } = useCompoundContext()
	const variant = variantProp ?? contextVariant

	return (
		<div
			data-slot='slider-hints'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</div>
	)
}

SliderHints.displayName = 'Slider.Hints'

export interface ISliderHintProps extends ICompoundChildProps {
	side: TSliderHintSide
	className?: string
	variant?: TSliderVariant
}

const SliderHint = ({
	side,
	children,
	className,
	variant: variantProp,
}: ISliderHintProps): ReactElement => {
	const { variant: contextVariant } = useCompoundContext()
	const variant = variantProp ?? contextVariant

	return (
		<span
			data-slot='slider-hint'
			data-side={side}
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</span>
	)
}

SliderHint.displayName = 'Slider.Hint'

interface ISliderCombinedBaseProps extends Omit<ISliderRootProps, 'children'> {
	minLabel?: ReactNode
	maxLabel?: ReactNode
	showValue?: boolean
	ariaLabel?: string
	children?: ReactNode
}

export type ISliderProps =
	| (ISliderCombinedBaseProps & { label: string; ariaLabel?: string })
	| (ISliderCombinedBaseProps & { label?: undefined; ariaLabel?: string })

const SliderControlTree = ({
	thumbCount,
	ariaLabel,
}: {
	thumbCount: number
	ariaLabel?: string
}): ReactElement => {
	return (
		<SliderControl>
			<SliderTrack>
				<SliderIndicator />
			</SliderTrack>
			{Array.from({ length: thumbCount }, (_, index) => (
				<SliderThumb
					key={index}
					index={index}
					getAriaLabel={ariaLabel ? () => ariaLabel : undefined}
				/>
			))}
		</SliderControl>
	)
}

const SliderCombined = ({
	children,
	label,
	minLabel,
	maxLabel,
	showValue,
	ariaLabel,
	...rootProps
}: ISliderProps): ReactElement => {
	if (children) {
		return <SliderRoot {...rootProps}>{children}</SliderRoot>
	}

	const thumbCount = getSliderThumbCount(rootProps.value, rootProps.defaultValue)
	const shouldShowValue = showValue ?? Boolean(label)
	const hasHeader = Boolean(label) || shouldShowValue
	const hasHints = minLabel != null || maxLabel != null

	return (
		<SliderRoot {...rootProps}>
			{hasHeader ? (
				<SliderHeader>
					{label ? <SliderLabel>{label}</SliderLabel> : null}
					{shouldShowValue ? <SliderValue /> : null}
				</SliderHeader>
			) : null}
			<SliderControlTree
				thumbCount={thumbCount}
				ariaLabel={label ? undefined : ariaLabel}
			/>
			{hasHints ? (
				<SliderHints>
					<SliderHint side='min'>{minLabel}</SliderHint>
					<SliderHint side='max'>{maxLabel}</SliderHint>
				</SliderHints>
			) : null}
		</SliderRoot>
	)
}

/**
 * Слайдер. Одно значение — `number`, диапазон — массив. `label` или `ariaLabel`.
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Цена"
 *   min={0}
 *   max={10000}
 *   value={price}
 *   onValueChange={setPrice}
 *   minLabel="0 ₽"
 *   maxLabel="10 000 ₽"
 * />
 *
 * <Slider
 *   ariaLabel="Диапазон"
 *   value={[minPrice, maxPrice]}
 *   onValueChange={setRange}
 * />
 * ```
 */
export const Slider = Object.assign(SliderCombined, {
	Root: SliderRoot,
	Header: SliderHeader,
	Label: SliderLabel,
	Value: SliderValue,
	Control: SliderControl,
	Track: SliderTrack,
	Indicator: SliderIndicator,
	Thumb: SliderThumb,
	Hints: SliderHints,
	Hint: SliderHint,
})
