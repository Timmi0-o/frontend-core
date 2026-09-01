'use client'

import 'swiper/css'
import 'swiper/css/free-mode'

import { createCompoundContext } from '@/core/create-compound-context'
import { cn } from '@/core/cn'
import type { TSlotVariant } from '@/core/slot-variant'
import {
	Children,
	isValidElement,
	useCallback,
	useMemo,
	useState,
	type ReactElement,
	type ReactNode,
} from 'react'
import { FreeMode } from 'swiper/modules'
import {
	Swiper as SwiperViewportPrimitive,
	SwiperSlide,
	type SwiperProps,
} from 'swiper/react'
import type { Swiper as SwiperInstance, SwiperOptions } from 'swiper/types'

interface ISwiperCarouselContextValue {
	swiper: SwiperInstance | null
	canSlidePrevious: boolean
	canSlideNext: boolean
	navigationButtonClassName?: string
	previousLabel: string
	nextLabel: string
	previousIcon?: ReactNode
	nextIcon?: ReactNode
}

const { Context, useCompoundContext } =
	createCompoundContext<ISwiperCarouselContextValue>('SwiperCarousel')

export interface ISwiperCarouselRootProps
	extends Omit<SwiperProps, 'children' | 'className'> {
	children: ReactNode
	className?: string
	variant?: TSlotVariant
	swiperClassName?: string
	slideClassName?: string
	navigationButtonClassName?: string
	showNavigation?: boolean
	previousLabel?: string
	nextLabel?: string
	previousIcon?: ReactNode
	nextIcon?: ReactNode
}

const ChevronLeftIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 24 24'
			width='24'
			height='24'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M15 6l-6 6 6 6'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

const ChevronRightIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 24 24'
			width='24'
			height='24'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M9 6l6 6-6 6'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

const SwiperCarouselPrevious = ({
	className,
	variant = 'default',
}: {
	className?: string
	variant?: TSlotVariant
}): ReactElement | null => {
	const {
		swiper,
		canSlidePrevious,
		navigationButtonClassName,
		previousLabel,
		previousIcon,
	} = useCompoundContext()

	if (!canSlidePrevious) {
		return null
	}

	return (
		<button
			data-slot='carousel-previous'
			data-variant={variant}
			className={cn(navigationButtonClassName, className)}
			type='button'
			aria-label={previousLabel}
			onClick={() => swiper?.slidePrev()}
		>
			{previousIcon ?? <ChevronLeftIcon />}
		</button>
	)
}

SwiperCarouselPrevious.displayName = 'SwiperCarousel.Previous'

const SwiperCarouselNext = ({
	className,
	variant = 'default',
}: {
	className?: string
	variant?: TSlotVariant
}): ReactElement | null => {
	const {
		swiper,
		canSlideNext,
		navigationButtonClassName,
		nextLabel,
		nextIcon,
	} = useCompoundContext()

	if (!canSlideNext) {
		return null
	}

	return (
		<button
			data-slot='carousel-next'
			data-variant={variant}
			className={cn(navigationButtonClassName, className)}
			type='button'
			aria-label={nextLabel}
			onClick={() => swiper?.slideNext()}
		>
			{nextIcon ?? <ChevronRightIcon />}
		</button>
	)
}

SwiperCarouselNext.displayName = 'SwiperCarousel.Next'

const SwiperCarouselSlide = ({
	children,
	className,
	variant = 'default',
}: {
	children: ReactNode
	className?: string
	variant?: TSlotVariant
}): ReactElement => {
	return (
		<SwiperSlide
			data-slot='carousel-slide'
			data-variant={variant}
			className={cn(className)}
		>
			{children}
		</SwiperSlide>
	)
}

SwiperCarouselSlide.displayName = 'SwiperCarousel.Slide'

const SwiperCarouselRoot = ({
	children,
	className,
	variant = 'default',
	swiperClassName,
	slideClassName,
	navigationButtonClassName,
	showNavigation = true,
	previousLabel = 'Предыдущий слайд',
	nextLabel = 'Следующий слайд',
	previousIcon,
	nextIcon,
	onSwiper,
	onSlideChange,
	onResize,
	onBreakpoint,
	slidesPerView,
	freeMode,
	modules: modulesProp,
	...swiperProps
}: ISwiperCarouselRootProps): ReactElement => {
	const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
	const [canSlidePrevious, setCanSlidePrevious] = useState(false)
	const [canSlideNext, setCanSlideNext] = useState(false)

	const slides = Children.toArray(children)
	const hasFreeMode = Boolean(freeMode)

	const modules = useMemo(() => {
		const resolvedModules = [...(modulesProp ?? [])]

		if (hasFreeMode && !resolvedModules.includes(FreeMode)) {
			resolvedModules.push(FreeMode)
		}

		return resolvedModules
	}, [hasFreeMode, modulesProp])

	const updateNavigation = useCallback((instance: SwiperInstance): void => {
		setCanSlidePrevious(!instance.isBeginning)
		setCanSlideNext(!instance.isEnd)
	}, [])

	const handleSwiper = (instance: SwiperInstance): void => {
		setSwiper(instance)
		updateNavigation(instance)
		onSwiper?.(instance)
	}

	const handleSlideChange = (instance: SwiperInstance): void => {
		updateNavigation(instance)
		onSlideChange?.(instance)
	}

	const handleResize = (instance: SwiperInstance): void => {
		updateNavigation(instance)
		onResize?.(instance)
	}

	const handleBreakpoint = (
		instance: SwiperInstance,
		breakpointParams: SwiperOptions,
	): void => {
		updateNavigation(instance)
		onBreakpoint?.(instance, breakpointParams)
	}

	return (
		<Context.Provider
			value={{
				swiper,
				canSlidePrevious,
				canSlideNext,
				navigationButtonClassName,
				previousLabel,
				nextLabel,
				previousIcon,
				nextIcon,
			}}
		>
			<div
				data-slot='carousel'
				data-variant={variant}
				data-slides-per-view={slidesPerView === 'auto' ? 'auto' : undefined}
				className={cn(className)}
			>
				{showNavigation ? <SwiperCarouselPrevious /> : null}

				<SwiperViewportPrimitive
					observer
					observeParents
					watchOverflow
					{...swiperProps}
					slidesPerView={slidesPerView}
					freeMode={freeMode}
					modules={modules}
					className={cn(swiperClassName)}
					onSwiper={handleSwiper}
					onSlideChange={handleSlideChange}
					onResize={handleResize}
					onBreakpoint={handleBreakpoint}
				>
					{slides.map((child, index) => (
						<SwiperSlide
							key={isValidElement(child) ? child.key : `slide-${String(index)}`}
							data-slot='carousel-slide'
							className={cn(slideClassName)}
						>
							{child}
						</SwiperSlide>
					))}
				</SwiperViewportPrimitive>

				{showNavigation ? <SwiperCarouselNext /> : null}
			</div>
		</Context.Provider>
	)
}

SwiperCarouselRoot.displayName = 'SwiperCarousel'

export type ISwiperCarouselProps = ISwiperCarouselRootProps

/**
 * Карусель Swiper. Дети — слайды; навигация включается `showNavigation`.
 *
 * @example
 * ```tsx
 * <SwiperCarousel slidesPerView={3} spaceBetween={12} showNavigation>
 *   {photos.map((photo) => (
 *     <img key={photo.id} src={photo.src} alt="" />
 *   ))}
 * </SwiperCarousel>
 * ```
 */
export const SwiperCarousel = Object.assign(SwiperCarouselRoot, {
	Root: SwiperCarouselRoot,
	Previous: SwiperCarouselPrevious,
	Next: SwiperCarouselNext,
	Slide: SwiperCarouselSlide,
})
