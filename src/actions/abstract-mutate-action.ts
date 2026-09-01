import type { IAppActionResponse } from './contracts/api-response/types/i-app-action-response.type'
import { ErrorObjectSetup } from './error-object-setup'
import type { IActionRequestWorkers } from './types/i-action-request-workers'
import type { IMutateActionOptions } from './types/i-action.types'
import type { IHttpParams, TAppFetcher } from './types/i-app-fetcher'

/**
 * Общий mutate server action: fetch через переданный fetcher, ответ через mapper.
 * Вызывать из доменных create/edit/delete; logout на 403 — через `onForbiddenLogout` в workers.
 */
export const abstractMutateAction = async <TBody, TData = unknown>(
	{
		url,
		params = { method: 'POST', body: undefined as TBody },
		json = true,
		isForbiddenLogout = false,
		isPublic = false,
		onOk,
	}: IMutateActionOptions<TBody> & { url: string },
	requestWorkers: IActionRequestWorkers,
): Promise<IAppActionResponse<TData>> => {
	const requestFetcher: TAppFetcher = requestWorkers.fetcher

	const res: Response = await requestFetcher({
		url,
		params: params as IHttpParams<BodyInit | null | undefined>,
		json,
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

	if (isForbiddenLogout) {
		await requestWorkers.onForbiddenLogout?.()
	}

	if (errorResult?.error) {
		return errorResult as IAppActionResponse<TData>
	}
	onOk?.()

	const data: unknown = requestWorkers.streamResponseParser
		? await requestWorkers.streamResponseParser(res)
		: await res.json()

	const formattedResponseData: IAppActionResponse<TData> =
		requestWorkers.responseMapper(data)

	return formattedResponseData
}
