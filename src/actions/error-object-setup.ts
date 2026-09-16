import type { IApiResponseMapper } from './contracts/api-response/types/i-api-response-mapper'
import type { IAppActionResponseError } from './contracts/api-response/types/i-app-action-response.type'
import type {
	TActionErrorLogger,
	TResolveActionError,
} from './types/i-action-request-workers'

/**
 * Если HTTP-статус не ok, читает тело ответа через mapper и возвращает `IAppActionResponse` с error.
 * Вызывать сразу после fetch в abstract-actions и в ручных auth-флоу.
 */
export const ErrorObjectSetup = async (
	res: Response,
	responseMapper: IApiResponseMapper,
	options?: {
		resolveActionError?: TResolveActionError
		onError?: TActionErrorLogger
	},
) => {
	if (res.ok) {
		return
	}

	let errorData: IAppActionResponseError

	try {
		const errorResponse: unknown = await res.json()
		const formattedErrorResponse = responseMapper(errorResponse).error

		const apiMessage = formattedErrorResponse?.message
			? String(formattedErrorResponse.message)
					.split(',')
					.map((item: string) => item.trim())
					.join(', ')
			: ''

		const apiCode = formattedErrorResponse?.code
		const fallbackMessage = apiMessage || `Ошибка запроса (${res.status})`

		options?.onError?.(fallbackMessage)

		const resolved = options?.resolveActionError
			? await options.resolveActionError(apiMessage, apiCode)
			: null

		errorData = {
			statusCode: formattedErrorResponse?.statusCode || res.status,
			timestamp: formattedErrorResponse?.timestamp || new Date().toISOString(),
			message: resolved?.message ?? fallbackMessage,
			...(apiCode ? { code: apiCode } : {}),
			...(resolved?.cta ? { cta: resolved.cta } : {}),
		}
	} catch {
		errorData = {
			statusCode: res.status,
			timestamp: new Date().toISOString(),
			message: `Ошибка запроса (${res.status})`,
		}
	}

	return { result: null, error: errorData, isArray: false }
}
