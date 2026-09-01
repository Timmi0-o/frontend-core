import type { IApiResponseMapper } from './contracts/api-response/types/i-api-response-mapper'
import type { IAppActionResponseError } from './contracts/api-response/types/i-app-action-response.type'
import type {
	TActionErrorLogger,
	TFormatActionErrorMessage,
} from './types/i-action-request-workers'

/**
 * Если HTTP-статус не ok, читает тело ответа через mapper и возвращает `IAppActionResponse` с error.
 * Вызывать сразу после fetch в abstract-actions и в ручных auth-флоу.
 */
export const ErrorObjectSetup = async (
	res: Response,
	responseMapper: IApiResponseMapper,
	options?: {
		formatErrorMessage?: TFormatActionErrorMessage
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

		const shortDescription = formattedErrorResponse?.message
			? `API: ${String(formattedErrorResponse.message)
					.split(',')
					.map((item: string) => item.trim())
					.join(', ')}`
			: ''

		const errorMessage = [shortDescription].filter(Boolean).join(`\n`).trim()

		options?.onError?.(errorMessage || 'Неизвестная ошибка запроса')

		const rawMessage = errorMessage
			? errorMessage
			: `Ошибка запроса (${res.status})`

		errorData = {
			statusCode: formattedErrorResponse?.statusCode || res.status,
			timestamp: formattedErrorResponse?.timestamp || new Date().toISOString(),
			message: options?.formatErrorMessage
				? options.formatErrorMessage(rawMessage)
				: rawMessage,
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
