'use client'

import { useMediaQuery } from './use-media-query'

export const DEFAULT_MOBILE_MEDIA_QUERY = '(max-width: 1024px)'

const NEVER_MATCH_MEDIA_QUERY = 'not all'

export type TMobileCondition = boolean | string

/**
 * Резолвит мобильный режим: готовый boolean или CSS media query.
 * Нужен AdaptiveDialog и DatePicker, чтобы один проп принимал и JS-условие, и matchMedia.
 */
export const useMobileCondition = (
	mobileCondition?: TMobileCondition,
): boolean => {
	const isBooleanCondition = typeof mobileCondition === 'boolean'
	const mediaQuery =
		typeof mobileCondition === 'string' && mobileCondition.trim() !== ''
			? mobileCondition
			: DEFAULT_MOBILE_MEDIA_QUERY
	const isMediaMobile = useMediaQuery(
		isBooleanCondition ? NEVER_MATCH_MEDIA_QUERY : mediaQuery,
	)

	if (isBooleanCondition) {
		return mobileCondition
	}

	return isMediaMobile
}
