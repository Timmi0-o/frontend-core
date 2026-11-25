import { emptyDefaultApiResponse } from './constants/empty-default-api-response'
import type { IAppActionResponse } from './contracts/api-response/types/i-app-action-response.type'
import { createError } from './create-error'
import { ErrorObjectSetup } from './error-object-setup'
import { setQueryFilters } from './set-query-filters'
import type { IActionRequestWorkers } from './types/i-action-request-workers'
import type {
	IDeleteActionOptions,
	IGetActionOptions,
	IPatchActionOptions,
	IPostActionOptions,
	IPutActionOptions,
	ISseActionOptions,
} from './types/i-action.types'
import type { IHttpParams, TAppFetcher } from './types/i-app-fetcher'

type THttpMethod = NonNullable<IHttpParams['method']>

interface IExecuteActionInput<TFilters> {
	method: THttpMethod
	url: string
	body?: unknown
	isPublic?: boolean
	cache?: IHttpParams['cache']
	headers?: IHttpParams['headers']
	next?: IHttpParams['next']
	isArray?: boolean
	filters?: IGetActionOptions<TFilters>['filters']
	customFormatter?: IGetActionOptions<TFilters>['customFormatter']
	onOk?: () => void | Promise<void>
	json: boolean
	applyQueryFilters: boolean
	treatMissingDataAsNotFound: boolean
	useStreamParser: boolean
}

const readResponseData = async (
	response: Response,
	requestWorkers: IActionRequestWorkers<any>,
	useStreamParser: boolean,
): Promise<unknown> => {
	if (useStreamParser) {
		if (requestWorkers.streamResponseParser) {
			return requestWorkers.streamResponseParser(response)
		}

		return response.text()
	}

	return response.json()
}

const executeAction = async <TData, TFilters>(
	input: IExecuteActionInput<TFilters>,
	requestWorkers: IActionRequestWorkers<TFilters>,
): Promise<IAppActionResponse<TData>> => {
	const requestFetcher: TAppFetcher = requestWorkers.fetcher
	const finalUrl = input.applyQueryFilters
		? await setQueryFilters<TFilters>(
				input.url,
				input.filters,
				requestWorkers.queryFilterSchema,
				input.customFormatter,
			)
		: input.url

	const response: Response = await requestFetcher({
		url: finalUrl,
		params: {
			method: input.method,
			body: input.body as BodyInit | null | undefined,
			cache: input.cache,
			headers: input.headers,
			next: input.next,
		},
		json: input.json,
		isPublic: input.isPublic,
	})

	const errorResult = await ErrorObjectSetup(response, requestWorkers.responseMapper, {
		resolveActionError: requestWorkers.resolveActionError,
		onError: requestWorkers.onError,
	})

	if (errorResult) {
		if (errorResult.error.statusCode === 404 && input.isArray) {
			return emptyDefaultApiResponse<TData>()
		}

		return errorResult
	}

	input.onOk?.()

	const data = await readResponseData(response, requestWorkers, input.useStreamParser)
	const formattedResponseData: IAppActionResponse<TData> = requestWorkers.responseMapper(data)

	if (
		input.treatMissingDataAsNotFound &&
		formattedResponseData.error === null &&
		!formattedResponseData.result.data
	) {
		return {
			result: null,
			error: createError(404, 'Data not found', finalUrl, input.method),
		}
	}

	return formattedResponseData
}

const getAction = async <TData, TFilters = Record<string, unknown>>(
	options: IGetActionOptions<TFilters> & { url: string },
	requestWorkers: IActionRequestWorkers<TFilters>,
): Promise<IAppActionResponse<TData>> =>
	executeAction<TData, TFilters>(
		{
			method: 'GET',
			url: options.url,
			isPublic: options.isPublic,
			cache: options.cache,
			headers: options.headers,
			next: options.next,
			isArray: options.isArray,
			filters: options.filters,
			customFormatter: options.customFormatter,
			json: true,
			applyQueryFilters: true,
			treatMissingDataAsNotFound: options.isArray !== true,
			useStreamParser: false,
		},
		requestWorkers,
	)

const mutateAction =
	(method: Exclude<THttpMethod, 'GET'>) =>
	async <TBody, TData = unknown>(
		options: IPostActionOptions<TBody>,
		requestWorkers: IActionRequestWorkers,
	): Promise<IAppActionResponse<TData>> =>
		executeAction<TData, Record<string, unknown>>(
			{
				method,
				url: options.url,
				body: options.body,
				isPublic: options.isPublic,
				cache: options.cache,
				headers: options.headers,
				next: options.next,
				onOk: options.onOk,
				json: true,
				applyQueryFilters: false,
				treatMissingDataAsNotFound: false,
				useStreamParser: false,
			},
			requestWorkers,
		)

const postAction = mutateAction('POST')
const putAction = mutateAction('PUT')
const patchAction = mutateAction('PATCH')
const deleteAction = mutateAction('DELETE')

const sseAction = async <TData, TFilters = Record<string, unknown>>(
	options: ISseActionOptions<TFilters>,
	requestWorkers: IActionRequestWorkers<TFilters>,
): Promise<IAppActionResponse<TData>> =>
	executeAction<TData, TFilters>(
		{
			method: 'GET',
			url: options.url,
			isPublic: options.isPublic,
			cache: options.cache,
			headers: options.headers,
			next: options.next,
			filters: options.filters,
			customFormatter: options.customFormatter,
			json: false,
			applyQueryFilters: true,
			treatMissingDataAsNotFound: false,
			useStreamParser: true,
		},
		requestWorkers,
	)

/**
 * Единый server action. Метод запроса выбирается вызовом, в options его передавать не нужно.
 *
 * @example
 * ```ts
 * await abstractAction().GET<Service[], ServiceFilters>({ url, filters, isArray: true }, workers)
 * await abstractAction().POST<CreateInput, CreateOutput>({ url, body }, workers)
 * await abstractAction().SSE<StreamPayload>({ url }, workers)
 * ```
 */
export const abstractAction = (): {
	GET: <TData, TFilters = Record<string, unknown>>(
		options: IGetActionOptions<TFilters> & { url: string },
		requestWorkers: IActionRequestWorkers<TFilters>,
	) => Promise<IAppActionResponse<TData>>
	POST: <TBody, TData = unknown>(
		options: IPostActionOptions<TBody>,
		requestWorkers: IActionRequestWorkers,
	) => Promise<IAppActionResponse<TData>>
	PUT: <TBody, TData = unknown>(
		options: IPutActionOptions<TBody>,
		requestWorkers: IActionRequestWorkers,
	) => Promise<IAppActionResponse<TData>>
	PATCH: <TBody, TData = unknown>(
		options: IPatchActionOptions<TBody>,
		requestWorkers: IActionRequestWorkers,
	) => Promise<IAppActionResponse<TData>>
	DELETE: <TBody, TData = unknown>(
		options: IDeleteActionOptions<TBody>,
		requestWorkers: IActionRequestWorkers,
	) => Promise<IAppActionResponse<TData>>
	SSE: <TData, TFilters = Record<string, unknown>>(
		options: ISseActionOptions<TFilters>,
		requestWorkers: IActionRequestWorkers<TFilters>,
	) => Promise<IAppActionResponse<TData>>
} => ({
	GET: getAction,
	POST: postAction,
	PUT: putAction,
	PATCH: patchAction,
	DELETE: deleteAction,
	SSE: sseAction,
})
