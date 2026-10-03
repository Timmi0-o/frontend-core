'use client'

import { useCallback, useEffect, useRef, type RefObject } from 'react'
import type { TScrollShadowOrientation } from '../types/i-scroll-shadow-props'

interface IUseScrollShadowProps {
	containerRef: RefObject<HTMLDivElement | null>
	orientation: TScrollShadowOrientation
	size: number
	offset: number
	isEnabled: boolean
}

const clampShadowDepth = (value: number, maxDepth: number): number => {
	return Math.min(maxDepth, Math.max(0, value))
}

/**
 * Следит за overflow и scroll-позицией контейнера, выставляет --scroll-shadow-before/after
 * для плавного mask-fade на краях ScrollShadow.
 */
export const useScrollShadow = ({
	containerRef,
	orientation,
	size,
	offset,
	isEnabled,
}: IUseScrollShadowProps): void => {
	const prevDepthRef = useRef<{
		scrollBeforeDepth: number
		scrollAfterDepth: number
	} | null>(null)
	const rafIdRef = useRef<number | null>(null)

	const updateShadowDepth = useCallback(() => {
		const element = containerRef.current

		if (!element) {
			return
		}

		const isVertical = orientation === 'vertical'
		const scrollStart = isVertical ? element.scrollTop : Math.abs(element.scrollLeft)
		const scrollSize = isVertical ? element.scrollHeight : element.scrollWidth
		const clientSize = isVertical ? element.clientHeight : element.clientWidth
		const maxScroll = scrollSize - clientSize
		const scrollBeforeDepth =
			maxScroll <= 0
				? 0
				: clampShadowDepth(scrollStart - offset, size)
		const scrollAfterDepth =
			maxScroll <= 0
				? 0
				: clampShadowDepth(maxScroll - scrollStart - offset, size)
		const prevDepth = prevDepthRef.current

		if (
			prevDepth &&
			prevDepth.scrollBeforeDepth === scrollBeforeDepth &&
			prevDepth.scrollAfterDepth === scrollAfterDepth
		) {
			return
		}

		prevDepthRef.current = { scrollBeforeDepth, scrollAfterDepth }

		if (rafIdRef.current !== null) {
			cancelAnimationFrame(rafIdRef.current)
		}

		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = null
			element.style.setProperty('--scroll-shadow-before', `${scrollBeforeDepth}px`)
			element.style.setProperty('--scroll-shadow-after', `${scrollAfterDepth}px`)
		})
	}, [containerRef, orientation, offset, size])

	useEffect(() => {
		const element = containerRef.current

		if (!element || !isEnabled) {
			return
		}

		updateShadowDepth()

		element.addEventListener('scroll', updateShadowDepth, { passive: true })

		const resizeObserver = new ResizeObserver(updateShadowDepth)

		resizeObserver.observe(element)

		const mutationObserver = new MutationObserver(updateShadowDepth)

		mutationObserver.observe(element, {
			attributeFilter: ['class', 'style'],
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true,
		})

		return () => {
			element.removeEventListener('scroll', updateShadowDepth)
			resizeObserver.disconnect()
			mutationObserver.disconnect()
			element.style.removeProperty('--scroll-shadow-before')
			element.style.removeProperty('--scroll-shadow-after')

			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current)
				rafIdRef.current = null
			}

			prevDepthRef.current = null
		}
	}, [containerRef, isEnabled, updateShadowDepth])
}
