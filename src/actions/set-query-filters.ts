import type { ZodSchema } from 'zod'
import { defaultQueryFormatter } from './default-query-formatter'
import { sanitizeQueryFiltersBySchema } from './sanitize-query-filters-by-schema'
import type { IActionFilters } from './types/i-action.types'

const appendRequiredIds = (
	searchParams: URLSearchParams,
	requiredIds: unknown,
): void => {
	if (Array.isArray(requiredIds)) {
		requiredIds.forEach((id) => {
			if (typeof id === 'string' && id.length > 0) {
				searchParams.append('requiredIds', id)
			}
		})
		return
	}

	if (typeof requiredIds === 'string' && requiredIds.length > 0) {
		searchParams.append('requiredIds', requiredIds)
	}
}

/**
 * Дописывает к URL query string из zod-проверенных фильтров.
 * Нужен abstractGetAction перед fetch.
 */
export const setQueryFilters = async <TFilters>(
	url: string,
	filters: IActionFilters<TFilters> | undefined,
	queryFilterSchema?: ZodSchema<TFilters>,
	customFormatter?: (
		filters: IActionFilters<TFilters>,
	) => Record<string, string> | undefined,
): Promise<string> => {
	if (queryFilterSchema && filters) {
		const sanitizedFilters = sanitizeQueryFiltersBySchema(
			queryFilterSchema,
			filters,
		)

		if (Object.keys(sanitizedFilters).length) {
			const formattedParams = customFormatter
				? customFormatter(sanitizedFilters)
				: defaultQueryFormatter(sanitizedFilters)

			const searchParams = new URLSearchParams()

			if (formattedParams) {
				Object.entries(formattedParams).forEach(([key, value]) => {
					searchParams.set(key, value)
				})
			}

			appendRequiredIds(
				searchParams,
				(sanitizedFilters as Record<string, unknown>).requiredIds,
			)

			if ([...searchParams.keys()].length > 0) {
				url += `?${searchParams.toString()}`
			}
		}
	}

	return url
}
