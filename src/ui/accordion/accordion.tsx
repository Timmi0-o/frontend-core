'use client'

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import type { ReactElement, ReactNode } from 'react'

const ChevronDownIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 24 24'
			width='18'
			height='18'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M6 9l6 6 6-6'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

export interface IAccordionRootProps extends AccordionPrimitive.Root.Props {
	variant?: TSlotVariant
}

const AccordionRoot = ({
	className,
	variant = 'default',
	...props
}: IAccordionRootProps): ReactNode => {
	return (
		<AccordionPrimitive.Root
			data-slot='accordion'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export interface IAccordionItemProps extends AccordionPrimitive.Item.Props {
	variant?: TSlotVariant
}

const AccordionItem = ({
	className,
	variant = 'default',
	...props
}: IAccordionItemProps): ReactNode => {
	return (
		<AccordionPrimitive.Item
			data-slot='accordion-item'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export interface IAccordionHeaderProps extends AccordionPrimitive.Header.Props {
	variant?: TSlotVariant
}

const AccordionHeader = ({
	className,
	variant = 'default',
	...props
}: IAccordionHeaderProps): ReactNode => {
	return (
		<AccordionPrimitive.Header
			data-slot='accordion-header'
			data-variant={variant}
			className={cn(className)}
			{...props}
		/>
	)
}

export interface IAccordionTriggerProps extends AccordionPrimitive.Trigger.Props {
	variant?: TSlotVariant
}

const AccordionTrigger = ({
	className,
	children,
	variant = 'default',
	...props
}: IAccordionTriggerProps): ReactNode => {
	return (
		<AccordionPrimitive.Trigger
			data-slot='accordion-trigger'
			data-variant={variant}
			className={cn(className)}
			{...props}
		>
			{children}
			<span data-slot='accordion-trigger-icon' aria-hidden='true'>
				<ChevronDownIcon />
			</span>
		</AccordionPrimitive.Trigger>
	)
}

export interface IAccordionPanelProps extends AccordionPrimitive.Panel.Props {
	variant?: TSlotVariant
}

const AccordionPanel = ({
	className,
	children,
	variant = 'default',
	...props
}: IAccordionPanelProps): ReactNode => {
	return (
		<AccordionPrimitive.Panel
			data-slot='accordion-panel'
			data-variant={variant}
			className={cn(className)}
			{...props}
		>
			<div data-slot='accordion-content'>{children}</div>
		</AccordionPrimitive.Panel>
	)
}

AccordionRoot.displayName = 'Accordion'
AccordionItem.displayName = 'Accordion.Item'
AccordionHeader.displayName = 'Accordion.Header'
AccordionTrigger.displayName = 'Accordion.Trigger'
AccordionPanel.displayName = 'Accordion.Panel'

export type IAccordionProps = IAccordionRootProps

/**
 * Аккордеон Base UI: несколько панелей, открытие через value у Item.
 *
 * @example
 * ```tsx
 * <Accordion>
 *   <Accordion.Item value="faq-1">
 *     <Accordion.Header>
 *       <Accordion.Trigger>Как отменить билет?</Accordion.Trigger>
 *     </Accordion.Header>
 *     <Accordion.Panel>До отправления поезда в личном кабинете.</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */
export const Accordion = Object.assign(AccordionRoot, {
	Item: AccordionItem,
	Header: AccordionHeader,
	Trigger: AccordionTrigger,
	Panel: AccordionPanel,
})
