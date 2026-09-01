import type { ZodSchema } from 'zod'
import { defaultQueryFormatter } from './default-query-formatter'
import { sanitizeQueryFiltersBySchema } from './sanitize-query-filters-by-schema'
import type { IActionFilters } from './types/i-action.types'

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

			if (formattedParams && Object.keys(formattedParams).length > 0) {
				url += `?${new URLSearchParams(formattedParams as Record<string, string>)}`
			}
		}
	}

	return url
}
