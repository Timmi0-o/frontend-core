'use client'

import { cn } from '@/core/cn'
import { overlayLayerStyle, useOverlayLayer } from '@/core/overlay-layer'
import type { TSlotVariant } from '@/core/slot-variant'
import { useInheritedUiKit } from '@/core/use-inherited-ui-kit'
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll'
import { usePhotoGalleryDismissGesture } from '@/ui/photo-gallery/hooks/use-photo-gallery-dismiss-gesture'
import {
	GALLERY_OVERLAY_CHROME_BOTTOM_VARIANTS,
	GALLERY_OVERLAY_CHROME_TOP_VARIANTS,
	GALLERY_OVERLAY_ROOT_VARIANTS,
	GALLERY_OVERLAY_STAGE_VARIANTS,
	galleryOverlayEnterMotionProps,
	galleryOverlayMotionProps,
} from '@/ui/photo-gallery/photo-gallery.animation'
import {
	downloadGalleryImage,
	type IPhotoGalleryImage,
} from '@/ui/photo-gallery/photo-gallery.utils'
import {
	getMediaOverlayDismissChromeOpacity,
	getMediaOverlayDismissScale,
} from '@/ui/photo-gallery/utils/media-overlay-dismiss'
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import type { Swiper as SwiperInstance } from 'swiper/types'
import { A11y, Keyboard, Zoom } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/zoom'

export type { IPhotoGalleryImage }

export interface IPhotoGalleryLabels {
	title?: string
	download?: string
	close?: string
	prev?: string
	next?: string
	imageAlt?: (current: number, total: number) => string
	counter?: (current: number, total: number) => string
}

interface IResolvedPhotoGalleryLabels {
	title: string
	download: string
	close: string
	prev: string
	next: string
	imageAlt: (current: number, total: number) => string
	counter: (current: number, total: number) => string
}

export interface IPhotoGalleryProps {
	images: IPhotoGalleryImage[]
	open: boolean
	initialIndex?: number
	onOpenChange: (open: boolean) => void
	labels?: IPhotoGalleryLabels
	className?: string
	variant?: TSlotVariant
}

export interface IPhotoGalleryGridProps {
	images: IPhotoGalleryImage[]
	onSelect: (index: number) => void
	className?: string
	variant?: TSlotVariant
}

/**
 * Подставляет русские подписи оверлея, если потребитель не передал свои.
 * Нужен PhotoGallery, чтобы кит не зависел от i18n-пакета.
 */
const resolvePhotoGalleryLabels = (
	labels: IPhotoGalleryLabels | undefined,
): IResolvedPhotoGalleryLabels => {
	return {
		title: labels?.title ?? 'Галерея',
		download: labels?.download ?? 'Скачать фото',
		close: labels?.close ?? 'Закрыть',
		prev: labels?.prev ?? 'Предыдущее фото',
		next: labels?.next ?? 'Следующее фото',
		imageAlt:
			labels?.imageAlt ??
			((current, total) => `Фото ${current} из ${total}`),
		counter:
			labels?.counter ?? ((current, total) => `${current} / ${total}`),
	}
}

const DownloadIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 24 24'
			width='20'
			height='20'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M12 3v12m0 0l-4-4m4 4l4-4M5 21h14'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

const CloseIcon = (): ReactElement => {
	return (
		<svg
			viewBox='0 0 24 24'
			width='20'
			height='20'
			fill='none'
			aria-hidden='true'
		>
			<path
				d='M6 6l12 12M18 6L6 18'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

const PhotoGalleryGrid = ({
	images,
	onSelect,
	className,
	variant = 'default',
}: IPhotoGalleryGridProps): ReactElement => {
	return (
		<div
			data-slot='photo-gallery-grid'
			data-variant={variant}
			className={cn(className)}
		>
			{images.map((image, index) => (
				<button
					key={`${image.src}-${String(index)}`}
					type='button'
					data-slot='photo-gallery-thumb'
					onClick={() => onSelect(index)}
					aria-label={image.alt ?? `Открыть фото ${index + 1}`}
				>
					<img
						data-slot='photo-gallery-thumb-image'
						src={image.src}
						alt=''
					/>
				</button>
			))}
		</div>
	)
}

PhotoGalleryGrid.displayName = 'PhotoGallery.Grid'

const PhotoGalleryOverlay = ({
	images,
	open,
	initialIndex = 0,
	onOpenChange,
	labels,
	className,
	variant = 'default',
}: IPhotoGalleryProps): ReactElement => {
	const { hostRef, uiKit } = useInheritedUiKit()
	const { overlayZ } = useOverlayLayer()
	const resolvedLabels = resolvePhotoGalleryLabels(labels)
	const prefersReducedMotion = useReducedMotion()
	const overlayMotion = galleryOverlayMotionProps(prefersReducedMotion)
	const overlayEnterMotion =
		galleryOverlayEnterMotionProps(prefersReducedMotion)

	const overlayRef = useRef<HTMLDivElement | null>(null)
	const swiperRef = useRef<SwiperInstance | null>(null)
	const dragY = useMotionValue(0)
	const backdropOpacity = useMotionValue(1)

	const dismissScale = useTransform(dragY, (value) =>
		getMediaOverlayDismissScale(value),
	)
	const chromeOpacity = useTransform(dragY, (value) =>
		getMediaOverlayDismissChromeOpacity(value),
	)

	const [isMounted, setIsMounted] = useState(false)
	const [activeIndex, setActiveIndex] = useState(initialIndex)
	const [isDownloading, setIsDownloading] = useState(false)
	const [exitMode, setExitMode] = useState<'default' | 'gesture'>('default')

	const total = images.length
	const safeInitialIndex = Math.min(
		Math.max(0, initialIndex),
		Math.max(0, total - 1),
	)
	const currentImage = images[activeIndex] ?? images[safeInitialIndex] ?? null

	useLockBodyScroll(open)

	const disableOverlayPointerEvents = useCallback(() => {
		const overlay = overlayRef.current

		if (overlay) {
			overlay.style.pointerEvents = 'none'
		}
	}, [])

	const close = useCallback(() => {
		disableOverlayPointerEvents()
		setExitMode('default')
		onOpenChange(false)
	}, [disableOverlayPointerEvents, onOpenChange])

	const closeFromGesture = useCallback(() => {
		disableOverlayPointerEvents()
		setExitMode('gesture')
		onOpenChange(false)
	}, [disableOverlayPointerEvents, onOpenChange])

	const dismissHandlers = usePhotoGalleryDismissGesture({
		dragY,
		backdropOpacity,
		enabled: open && !prefersReducedMotion,
		swiperRef,
		onDismiss: closeFromGesture,
	})

	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		if (!open) {
			return
		}

		setActiveIndex(safeInitialIndex)
		dragY.set(0)
		backdropOpacity.set(1)
	}, [backdropOpacity, dragY, open, safeInitialIndex])

	const handleExitComplete = useCallback(() => {
		swiperRef.current = null
		setIsDownloading(false)
		setExitMode('default')
		dragY.set(0)
		backdropOpacity.set(1)
	}, [backdropOpacity, dragY])

	useEffect(() => {
		if (!open) {
			return
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				close()
			}
		}

		window.addEventListener('keydown', onKeyDown)

		return () => {
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [close, open])

	const handleDownload = async (): Promise<void> => {
		if (!currentImage || isDownloading) {
			return
		}

		setIsDownloading(true)

		try {
			await downloadGalleryImage(currentImage.src, currentImage.fileName)
		} finally {
			setIsDownloading(false)
		}
	}

	const overlay =
		isMounted && total > 0
			? createPortal(
					<AnimatePresence onExitComplete={handleExitComplete}>
						{open ? (
							<motion.div
								key='photo-gallery-overlay'
								data-ui-kit={uiKit}
								style={{
									...overlayLayerStyle(overlayZ),
									zIndex: overlayZ,
									position: 'fixed',
									inset: 0,
								}}
								variants={GALLERY_OVERLAY_ROOT_VARIANTS}
								initial='initial'
								animate='animate'
								exit={
									exitMode === 'gesture'
										? {
												opacity: 1,
												pointerEvents: 'none',
												transition: { duration: 0 },
											}
										: 'exit'
								}
								transition={
									prefersReducedMotion
										? { duration: 0 }
										: overlayMotion.transition
								}
							>
								<div
									ref={overlayRef}
									data-slot='photo-gallery-overlay'
									data-variant={variant}
									className={cn(className)}
									role='dialog'
									aria-modal
									aria-label={resolvedLabels.title}
								>
								<motion.div
									data-slot='photo-gallery-backdrop'
									style={{ opacity: backdropOpacity }}
									aria-hidden
								/>

								<h2 data-slot='photo-gallery-title'>
									{resolvedLabels.title}
								</h2>

								<motion.div
									data-slot='photo-gallery-header'
									variants={GALLERY_OVERLAY_CHROME_TOP_VARIANTS}
									{...overlayEnterMotion}
									style={{ opacity: chromeOpacity }}
								>
									<span data-slot='photo-gallery-header-spacer' aria-hidden />
									<div data-slot='photo-gallery-header-side'>
										<button
											type='button'
											data-slot='photo-gallery-icon-button'
											onClick={() => void handleDownload()}
											disabled={!currentImage || isDownloading}
											aria-label={resolvedLabels.download}
										>
											<DownloadIcon />
										</button>
										<button
											type='button'
											data-slot='photo-gallery-icon-button'
											onClick={close}
											aria-label={resolvedLabels.close}
										>
											<CloseIcon />
										</button>
									</div>
								</motion.div>

								<motion.div
									data-slot='photo-gallery-stage'
									variants={GALLERY_OVERLAY_STAGE_VARIANTS}
									{...overlayEnterMotion}
								>
									<motion.div
										data-slot='photo-gallery-dismiss-layer'
										style={{ y: dragY, scale: dismissScale }}
										{...dismissHandlers}
									>
										<Swiper
											key={`gallery-${String(safeInitialIndex)}-${String(total)}`}
											data-slot='photo-gallery-swiper'
											modules={[Zoom, Keyboard, A11y]}
											initialSlide={safeInitialIndex}
											slidesPerView={1}
											spaceBetween={0}
											zoom={{
												maxRatio: 3,
												minRatio: 1,
												toggle: true,
											}}
											keyboard={{ enabled: true }}
											a11y={{
												prevSlideMessage: resolvedLabels.prev,
												nextSlideMessage: resolvedLabels.next,
											}}
											onSwiper={(swiper: SwiperInstance) => {
												swiperRef.current = swiper
											}}
											onSlideChange={(swiper: SwiperInstance) => {
												setActiveIndex(swiper.activeIndex)
												swiper.zoom.out()
												dragY.set(0)
												backdropOpacity.set(1)
											}}
										>
											{images.map((image, index) => (
												<SwiperSlide key={`${image.src}-${String(index)}`}>
													<div
														className='swiper-zoom-container'
														data-slot='photo-gallery-zoom'
													>
														<img
															src={image.src}
															alt={
																image.alt ??
																resolvedLabels.imageAlt(index + 1, total)
															}
															data-slot='photo-gallery-image'
															draggable={false}
														/>
													</div>
												</SwiperSlide>
											))}
										</Swiper>
									</motion.div>
								</motion.div>

								<motion.div
									data-slot='photo-gallery-footer'
									variants={GALLERY_OVERLAY_CHROME_BOTTOM_VARIANTS}
									{...overlayEnterMotion}
									style={{ opacity: chromeOpacity }}
								>
									<span data-slot='photo-gallery-counter'>
										{resolvedLabels.counter(activeIndex + 1, total)}
									</span>
								</motion.div>
								</div>
							</motion.div>
						) : null}
					</AnimatePresence>,
					document.body,
				)
			: null

	return (
		<>
			<span ref={hostRef} hidden />
			{overlay}
		</>
	)
}

PhotoGalleryOverlay.displayName = 'PhotoGallery'

/**
 * Полноэкранная галерея. `Grid` — превью; оверлей открывается `open` / `onOpenChange`.
 *
 * @example
 * ```tsx
 * <PhotoGallery.Grid images={images} onSelect={(index) => {
 *   setIndex(index)
 *   setIsOpen(true)
 * }} />
 * <PhotoGallery
 *   images={images}
 *   open={isOpen}
 *   initialIndex={index}
 *   onOpenChange={setIsOpen}
 * />
 * ```
 */
export const PhotoGallery = Object.assign(PhotoGalleryOverlay, {
	Grid: PhotoGalleryGrid,
})
