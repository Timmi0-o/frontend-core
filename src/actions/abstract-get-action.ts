import { EMPTY_DEFAULT_API_RESPONSE } from './constants/empty-default-api-response'
import type { IAppActionResponse } from './contracts/api-response/types/i-app-action-response.type'
import { createError } from './create-error'
import { ErrorObjectSetup } from './error-object-setup'
import { setQueryFilters } from './set-query-filters'
import type { IGetActionRequestWorkers } from './types/i-action-request-workers'
import type { IGetActionOptions } from './types/i-action.types'
import type { IHttpParams, TAppFetcher } from './types/i-app-fetcher'

/**
 * Общий GET server action: фильтры → query, fetch через переданный fetcher, ответ через mapper.
 * Вызывать из доменных getMany/getOne, передавая `fetcher` и `responseMapper`.
 */
export const abstractGetAction = async <
	TData,
	TFilters = Record<string, unknown>,
>(
	options: IGetActionOptions<TFilters> & { url: string },
	requestWorkers: IGetActionRequestWorkers<TFilters>,
): Promise<IAppActionResponse<TData>> => {
	const {
		url,
		params = { method: 'GET' },
		filters,
		customFormatter,
		isArray = false,
		isPublic = false,
	} = options

	const requestFetcher: TAppFetcher = requestWorkers.fetcher

	const finalUrl = await setQueryFilters<TFilters>(
		url,
		filters,
		requestWorkers.queryFilterSchema,
		customFormatter,
	)

	const res: Response = await requestFetcher({
		url: finalUrl,
		params: {
			method: 'GET',
			...(params as IHttpParams<BodyInit | null | undefined>),
		},
		isPublic,
	})

	const errorResult = await ErrorObjectSetup(
		res,
		requestWorkers.responseMapper,
		{
			formatErrorMessage: requestWorkers.formatErrorMessage,
			onError: requestWorkers.onError,
		},
	)

	if (errorResult?.error) {
		if (errorResult.error.statusCode === 404 && isArray) {
			return EMPTY_DEFAULT_API_RESPONSE as IAppActionResponse<TData>
		}
		return errorResult as IAppActionResponse<TData>
	}

	const data: unknown = requestWorkers.streamResponseParser
		? await requestWorkers.streamResponseParser(res)
		: await res.json()

	const formattedResponseData: IAppActionResponse<TData> =
		requestWorkers.responseMapper(data)

	if (!isArray && !formattedResponseData.result?.data) {
		return {
			result: {
				data: null,
			},
			error: createError(404, 'Data not found', finalUrl, 'GET'),
		}
	}

	return formattedResponseData
}
