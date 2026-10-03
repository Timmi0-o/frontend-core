'use client'

import { useCallback, useEffect, useRef, type RefObject } from 'react'
import type {
	TScrollShadowOrientation,
	TScrollShadowVisibility,
} from '../types/i-scroll-shadow-props'
import { supportsScrollTimeline } from '../utils/supports-scroll-timeline'

interface IUseScrollShadowProps {
	containerRef: RefObject<HTMLDivElement | null>
	orientation: TScrollShadowOrientation
	offset: number
	visibility: TScrollShadowVisibility
	isEnabled: boolean
	onVisibilityChange?: (visibility: TScrollShadowVisibility) => void
}

/**
 * Fallback для браузеров без scroll-driven animations: выставляет data-*-scroll
 * по overflow и scroll-позиции контейнера.
 */
export const useScrollShadow = ({
	containerRef,
	orientation,
	offset,
	visibility,
	isEnabled,
	onVisibilityChange,
}: IUseScrollShadowProps): void => {
	const onVisibilityChangeRef = useRef(onVisibilityChange)

	useEffect(() => {
		onVisibilityChangeRef.current = onVisibilityChange
	}, [onVisibilityChange])

	const prevStateRef = useRef<{
		hasScrollBefore: boolean
		hasScrollAfter: boolean
	} | null>(null)
	const rafIdRef = useRef<number | null>(null)

	const checkOverflow = useCallback(() => {
		const element = containerRef.current

		if (!element) {
			return
		}

		const isVertical = orientation === 'vertical'
		const scrollStart = isVertical ? element.scrollTop : Math.abs(element.scrollLeft)
		const scrollSize = isVertical ? element.scrollHeight : element.scrollWidth
		const clientSize = isVertical ? element.clientHeight : element.clientWidth
		const hasScrollBefore = scrollStart > offset
		const hasScrollAfter = scrollStart + clientSize + offset < scrollSize - 1
		const prevState = prevStateRef.current

		if (
			prevState &&
			prevState.hasScrollBefore === hasScrollBefore &&
			prevState.hasScrollAfter === hasScrollAfter
		) {
			return
		}

		prevStateRef.current = { hasScrollBefore, hasScrollAfter }

		if (rafIdRef.current !== null) {
			cancelAnimationFrame(rafIdRef.current)
		}

		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = null

			const notify = onVisibilityChangeRef.current

			if (isVertical) {
				if (hasScrollBefore && hasScrollAfter) {
					element.dataset.topBottomScroll = 'true'
					delete element.dataset.topScroll
					delete element.dataset.bottomScroll
					notify?.('both')
				} else {
					element.dataset.topScroll = String(hasScrollBefore)
					element.dataset.bottomScroll = String(hasScrollAfter)
					delete element.dataset.topBottomScroll

					if (notify) {
						if (hasScrollBefore) {
							notify('top')
						} else if (hasScrollAfter) {
							notify('bottom')
						} else {
							notify('none')
						}
					}
				}

				delete element.dataset.leftScroll
				delete element.dataset.rightScroll
				delete element.dataset.leftRightScroll

				return
			}

			if (hasScrollBefore && hasScrollAfter) {
				element.dataset.leftRightScroll = 'true'
				delete element.dataset.leftScroll
				delete element.dataset.rightScroll
				notify?.('both')
			} else {
				element.dataset.leftScroll = String(hasScrollBefore)
				element.dataset.rightScroll = String(hasScrollAfter)
				delete element.dataset.leftRightScroll

				if (notify) {
					if (hasScrollBefore) {
						notify('left')
					} else if (hasScrollAfter) {
						notify('right')
					} else {
						notify('none')
					}
				}
			}

			delete element.dataset.topScroll
			delete element.dataset.bottomScroll
			delete element.dataset.topBottomScroll
		})
	}, [containerRef, orientation, offset])

	useEffect(() => {
		const element = containerRef.current

		if (
			!element ||
			!isEnabled ||
			visibility !== 'auto' ||
			supportsScrollTimeline()
		) {
			return
		}

		checkOverflow()

		element.addEventListener('scroll', checkOverflow, { passive: true })

		const resizeObserver = new ResizeObserver(checkOverflow)

		resizeObserver.observe(element)

		const mutationObserver = new MutationObserver(checkOverflow)

		mutationObserver.observe(element, {
			attributeFilter: ['class', 'style'],
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true,
		})

		return () => {
			element.removeEventListener('scroll', checkOverflow)
			resizeObserver.disconnect()
			mutationObserver.disconnect()

			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current)
				rafIdRef.current = null
			}

			prevStateRef.current = null
		}
	}, [containerRef, visibility, isEnabled, checkOverflow])
}
